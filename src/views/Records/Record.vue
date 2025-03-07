<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <main>
    <v-container
      v-if="queryTriggered"
      fluid
    >
      <!--   error   -->
      <div v-if="error">
        <NotFound />
      </div>

      <!--   Action Menu & Alert   -->
      <v-row
        v-if="!target && queryTriggered"
        class="mx-1"
      >
        <v-col
          cols="12"
        >
          <!-- alerts         -->
          <record-alert
            v-for="(alert,key,index) in alerts"
            :key="key+'_'+alert.message+'_'+index"
            :type="alert.type"
            :message="alert.message"
          />

          <!--  snackbars        -->
          <record-snackbar
            v-for="(snackbar,index) in snackbars"
            :key="snackbar.message+'_'+index"
            :message="snackbar.message"
            :type="snackbar.type"
            :model="convertStringToLocalVar(snackbar.model)"
          />

          <!-- Menu component -->
          <record-menu
            v-if="currentRecord.fairsharingRecord['isHidden']!==undefined && !error && !recordHidden"
            :buttons="buttons"
            :read-only-mode="readOnlyMode"
          />
        </v-col>
      </v-row>

      <!--  CuratorsNotes   -->
      <CuratorNotes
        id="curatorNotes"
        class="ma-4 mb-7"
        :back-color="getRecordCardBackground"
      />

      <Tombstone
        v-if="currentRecord['fairsharingRecord'] && currentRecord['fairsharingRecord'].metadata.tombstone"
        id="tombStone"
        :record="currentRecord['fairsharingRecord']"
      />

      <Hidden
        v-if="recordHidden"
        id="hidden"
        :record-name="currentRecord['fairsharingRecord'].metadata.name"
        :is-logged-in="user().isLoggedIn"
      />

      <!-- handle situations where the record is hidden -->

      <!--  Content  -->
      <div v-if="currentRecord['fairsharingRecord'] && !error && !recordHidden && !currentRecord['fairsharingRecord'].metadata.tombstone">
        <!-- Top Block -->
        <GeneralInfo
          id="generalInfo"
          :class="['ma-4',{'mb-10':currentRecord.fairsharingRecord.registry==='Collection'}]"
          :can-claim="canClaim"
          :back-color="getRecordCardBackground"
          @requestOwnership="requestOwnership"
        />
        <!-- Dynamic Block -->
        <v-row no-gutters>
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!--Left Block-->
            <div v-if="currentRecord.fairsharingRecord.registry!=='Collection'">
              <component
                :is="block"
                v-for="(block,index) in currentDynamicBlock.leftBlock"
                :id="block.toLowerCase()"
                :key="block"
                :back-color="getRecordCardBackground"
                :class="['ma-4',index===currentDynamicBlock.rightBlock.length-1?'mb-4':'mb-8']"
              />
            </div>
          </v-col>
          <!--Right Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <div v-if="currentRecord.fairsharingRecord.registry!=='Collection'">
              <component
                :is="block"
                v-for="(block,index) in currentDynamicBlock.rightBlock"
                :id="block.toLowerCase()"
                :key="block"
                :back-color="getRecordCardBackground"
                :class="['ma-4',index===currentDynamicBlock.rightBlock.length-1?'mb-4':'mb-8']"
              />
            </div>
          </v-col>
        </v-row>

        <!-- Bottom Block -->
        <Publications
          id="publications"
          :class="['ma-4 mb-8', {'mb-10 mt-0':currentRecord.fairsharingRecord.registry==='Collection'}]"
          :back-color="getRecordCardBackground"
        />
        <!-- Additional Information -->
        <AdditionalInfo
          v-if="currentRecord.fairsharingRecord.registry!=='Collection'"
          id="additionalInfo"
          class="mb-8 ma-4"
          :back-color="getRecordCardBackground"
        />
        <!-- Search Collection -->
        <SearchCollection
          v-if="currentRecord.fairsharingRecord.registry==='Collection'"
          id="searchCollection"
          class="mb-10 ma-4"
        />
      </div>
    </v-container>
    <!-- This html is from a safe source -->
    <!-- eslint-disable vue/no-v-html -->
    <script
      type="application/ld+json"
      v-html="JSONLD"
    />
    <!-- eslint-enable vue/no-v-html -->
    <v-dialog
      v-model="history.show"
      fullscreen
      class="pa-0"
      persistent
      no-click-animation
    >
      <v-card>
        <v-card-title
          class="blue white--text pb-4"
          style="border-radius: 0 !important;"
        >
          {{ getField("name") }} history logs
          <v-spacer />
          <v-btn
            x-small
            fab
            @click="closeHistory()"
          >
            <v-icon> fa-times </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2">
          <RecordHistory
            v-if="!history.loading"
            id="recordHistory"
            :history="currentRecordHistory.history"
            :legacy-logs="currentRecordHistory.legacyLogs"
          />
          <Loaders v-else />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.deleteRecord"
      max-width="650px"
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          Are you sure you want to
          <span
            style="color:red; padding-left: 5px; padding-right: 5px;"
          >
            DELETE
          </span>
          (without DOI) or tombstone (with DOI) this record?
          <ul style="list-style-type:none;">
            <li>
              {{ dialogs.recordName }}
            </li>
          </ul>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="closeDeleteMenu()"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="dialogs.disableDelButton === true || dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="confirmDelete()"
          >
            DELETE
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.claimRecord"
      max-width="700px"
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          <p class="claimtext">
            <b>Please confirm that you would like to request ownership of this record.</b>
          </p>
          <p class="claimtext">
            We encourage resource developers to claim ownership of their FAIRsharing record; doing so
            allows them to make updates and provides them with a visible means of attribution for their efforts.
            However, please note that for this request to be approved, you must be associated with the institutions(s)
            that develop this resource.
          </p>
          <p class="claimtext">
            Please also see our <a href="https://fairsharing.gitbook.io/fairsharing/#claiming-a-record">
              documentation on requesting ownership</a>.
          </p>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="closeClaimMenu()"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="dialogs.disableDelButton === true || dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="requestOwnership()"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogs.stopMaintainRecord"
      max-width="700px"
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          <p class="claimtext">
            <b>Please confirm that you would like to stop maintaining this record:</b>
          </p>
          <p class="claimtext">
            <b>&ldquo;{{ dialogs.recordName }}&rdquo;</b>
          </p>
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="closeMaintainMenu()"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="dialogs.disableDelButton === true || dialogs.disableButton === true"
            color="blue darken-1"
            text
            @click="removeMaintainer()"
          >
            OK
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

import Loaders from "@/components/Navigation/Loaders";
import AdditionalInfo from "@/components/Records/Record/AdditionalInfo";
import SearchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection";
import Collections from "@/components/Records/Record/Collections";
import CuratorNotes from "@/components/Records/Record/CuratorNotes";
import DataProcessesAndConditions from '@/components/Records/Record/DataProcessesAndConditions';
import GeneralInfo from "@/components/Records/Record/GeneralInfo";
import RecordHistory from "@/components/Records/Record/History/RecordHistory";
import Organisations from "@/components/Records/Record/Organisations";
import Publications from '@/components/Records/Record/Publications';
import RecordAlert from "@/components/Records/Record/RecordAlert";
import RecordMenu from "@/components/Records/Record/RecordMenu";
import RecordSnackbar from "@/components/Records/Record/RecordSnackBar";
import RelatedContent from "@/components/Records/Record/RelatedContent";
import Support from '@/components/Records/Record/Support';
import Tools from '@/components/Records/Record/Tools';
import AlertBuilder from "@/lib/AlertBuilder/AlertBuilder";
import RestClient from "@/lib/Client/RESTClient.js"
import Client from '@/lib/GraphClient/GraphClient.js'
import getHostname from "@/utils/generalUtils";
import stringUtils from '@/utils/stringUtils';
import NotFound from "@/views/Errors/404"

import Hidden from "../Errors/Hidden";
import Tombstone from "../Errors/Tombstone";

const client = new RestClient();
export default {
  name: "Record",
  components: {
    RecordSnackbar,
    RecordAlert,
    RecordMenu,
    CuratorNotes,
    AdditionalInfo,
    Tombstone,
    Hidden,
    SearchCollection,
    Loaders,
    RecordHistory,
    RelatedContent,
    Collections,
    Organisations,
    GeneralInfo,
    Tools,
    DataProcessesAndConditions,
    Publications,
    Support,
    NotFound
  },
  mixins: [stringUtils, getHostname],
  props: {
    target: {type: Number, default: null}
  },
  data: () => {
    return {
      recordID: null,
      error: null,
      queryTriggered: false,
      showScrollToTopButton: false,
      canEdit: false,
      canClaim: false,
      alreadyClaimed: false,
      noClaimRegistered:false,
      ownershipApproved: false,
      ownershipApprovalStatus:null,
      claimedTriggered: false,
      reviewSuccess: false,
      reviewFail: false,
      stopMaintainSuccess: false,
      stopMaintainFailure: false,
      buttons: [],
      history: {
        show: false,
        loading: false
      },
      tombstone: false,
      alerts:{},
      snackbars: [
        {
          model: "claimedTriggered",
          type: "success",
          message: "Thank you for claiming this record. We will be getting back to you between 48 and 72h."
        },
        {
          model: "reviewSuccess",
          type: "success",
          message: "Thank you for reviewing this record."
        },
        {
          model: "reviewFail",
          type: "warning",
          message: "Sorry, it was not possibly to save a review for this record."
        },
        {
          model: "stopMaintainSuccess",
          type: "success",
          message: "You have been removed as maintainer of this record."
        },
        {
          model: "stopMaintainFailure",
          type: "warning",
          message: "You could not be removed as maintainer. Please email for assistance."
        }
      ],
      dialogs: {
        recordName: "",
        recordID: "",
        deleteRecord: false,
        disableDelButton: true,
        disableButton: false,
        claimRecord: false,
        stopMaintainRecord: false
      },
    }
  },
  head: {
    link: function() {
      if (this.recordID) {
        let results = [];
        let citeAsUrl;
        let describedByUrl;
        // Mysteriously not covered even if a doi value is provided in tests.
        /* istanbul ignore if */
        if (this.currentRecord.fairsharingRecord.doi) {
          citeAsUrl = "https://doi.org/" + this.currentRecord.fairsharingRecord.doi;
          describedByUrl = this.getHostname()  + this.currentRecord.fairsharingRecord.doi.split(/\//)[1];
        }
        else {
          citeAsUrl = this.getHostname() + this.recordID;
          describedByUrl = this.getHostname() + this.recordId;
        }
        results.push({
          rel: 'cite-as',
          type: "application/html",
          href: citeAsUrl
        });
        results.push(
          {
            rel: 'describedby',
            type: "application/json",
            href: describedByUrl
          }
        )
        results.push(
          {
            rel: 'describedby',
            type: "application/ld+json",
            href: describedByUrl
          }
        )
        return results;
      }
    }
  },
  computed: {
    ...mapState('record', ["currentRecord", "currentRecordHistory"]),
    ...mapState('users', ["user", "messages"]),
    ...mapGetters("record", ["getField"]),
    ...mapState('introspection', ["readOnlyMode"]),
    recordHidden() {
        let _module = this;
        if (_module.currentRecord.fairsharingRecord.isHidden) {
            if (!_module.user().isLoggedIn) {
                return true;
            }
            else {
                if (!_module.canEdit) {
                    return true;
                }
            }
        }
        return false;
    },
    getRecordCardBackground() {
      let finalCardBackColor
      switch (this.currentRecord.fairsharingRecord.registry) {
        case 'Standard':
          finalCardBackColor = this.$vuetify.theme.themes.light.bg_standard_record_card;
          break;
        case 'Database':
          finalCardBackColor = this.$vuetify.theme.themes.light.bg_database_record_card;
          break;
        case 'Policy':
          finalCardBackColor = this.$vuetify.theme.themes.light.bg_policy_record_card;
          break;
        case 'Collection':
          finalCardBackColor = this.$vuetify.theme.themes.light.bg_collection_record_card;
          break;
      }
      return finalCardBackColor
    },
    JSONLD () {
      return this.$sanitize(JSON.stringify(this.getField("schemaOrg")));
    },
    currentRoute() {
      let id = this.$route.params['id'];
      if (id.includes("FAIRsharing.")) {
        return "10.25504/" + id;
      }
      return this.target || this.$route.params['id'];
    },
    userIsLoggedIn(){
      return this.user().isLoggedIn;
    },
    getTitle() {
      return 'FAIRsharing | ' + this.currentRoute;
    },
    maintainsRecord() {
      let _module = this;
      if (!_module.userIsLoggedIn){
        return false
      }
      // Is the current_user's ID in the array of maintainer objects?
      if (typeof _module.currentRecord['fairsharingRecord']['maintainers'] === 'undefined') {
        return false;
      }
      if (_module.currentRecord['fairsharingRecord']['maintainers'].length === 0) {
        return false;
      }
      return _module.currentRecord['fairsharingRecord']['maintainers'].some(({ id }) => id === _module.user().id);
    },
    currentDynamicBlock() {
      if (this.$vuetify.breakpoint.name === 'md') {
        return {
          leftBlock: ["Collections", "RelatedContent", "Support"],
          rightBlock: ["DataProcessesAndConditions", "Tools", "Organisations"]
        }
      } else {
        return {
          leftBlock: ["Collections", "Support", "DataProcessesAndConditions"],
          rightBlock: ["RelatedContent", "Tools", "Organisations"]
        }
      }
    },
  },
  watch: {
    async currentRoute() {
      await this.getData();
      if (!this.error) {
        await this.canEditRecord();
        //await this.checkClaimStatus();
        await this.getMenuButtons();
      }
      await this.$nextTick();
      await this.$scrollTo(this.$route.hash || 'body')
    },
    async userIsLoggedIn() {
      await this.canEditRecord();
      //await this.checkClaimStatus();
      await this.getMenuButtons();
      await this.checkAlerts();
    }
  },
  destroyed() {
    // minor change in the y axis can fix a serious bug after going back to records..
    this.$scrollTo('body',5,{})
  },
  async mounted() {
      let _module = this;
      _module.client = new Client();
      await _module.getData();
      _module.recordID = this.currentRecord.fairsharingRecord.id;
      _module.$emit('updateHead');
      if (!_module.error) {
        await _module.canEditRecord();
        await _module.checkClaimStatus();
        await _module.getMenuButtons()
      }
      await _module.$nextTick();
      await _module.checkAlerts();
    try {
      await _module.$scrollTo(_module.$route.hash || 'body')
      // eslint-disable-next-line no-empty
    }
    catch (e) {
      // This serves to prevent warnings when tests are run on Github (trying to scroll with no DOM etc.).  #1201
    }
    // update the UI padding and margin after DOM is fully loaded.

    // At this point it might be possible to directly load the record page if a parameter has been passed...
    let query = _module.$route.query;
    if (!(query === undefined || query === null)) {
      // TODO: This does work but yet again the test refuses to acknowledge this.
      /* istanbul ignore if */
      if (query.history === 'show') {
        _module.history = {
          show: true,
          loading: true
        };
        await _module.getHistory();
        _module.history.loading = false;
      }
    }
  },
  methods: {
    closeHistory() {
      this.history.show = false;
      this.$router.replace({query: {}});
    },
    async checkAlerts() {
      let _module = this;
      // here order of calling functions matters in presentation first we stack blue alerts(no-auth needed ones)
      // and then curators alerts(auth-needed orange ones) so blue ones stack,
      // then orange and then red/green [approval/rejection] ones.
      let alertBuilder  = new AlertBuilder(_module.currentRecord, this.user())
          .isAwaitingApproval()
          .isWatching(this.isWatching())
          .isNeedingReview(this.needsReviewing(), this.error)
          .isNeedingReviewAndBeenReviewed(this.reviewsPresent())
          .isAlreadyClaimed(this.alreadyClaimed)
          .isHidden()
          .isOwnerShipApproved(this.ownershipApprovalStatus, this.isBannerExpired());
      _module.alerts = alertBuilder.getAlerts();
    },
    ...mapActions('record', ['fetchRecord', 'fetchRecordHistory', 'fetchPreviewRecord']),
    ...mapActions('users', ['updateWatchedRecords']),
    ...mapMutations('users', ['changeWatched']),
    async getMenuButtons() {
      let _module = this;
      this.buttons = []
      let initial_buttons = [
        {
          name: function() { return "Edit record" },
          isDisabled: function(){
            if (!_module.userIsLoggedIn){
              return false
            }
            return !_module.canEdit
          },
          method: function(){return _module.goToEdit()}
        },
        {
          name: function() { return "Request ownership" },
          isDisabled: function(){
            if (!_module.userIsLoggedIn){
              return false
            }
            return !_module.canClaim;
          },
          method: async function(){
            if (!_module.userIsLoggedIn){
              _module.$router.push({
                path: "/accounts/login",
                query: {
                  goTo: `/${_module.currentRecord['fairsharingRecord'].id}`
                }
              })
            }
            else {
              _module.claimRecordMenu(
                  _module.currentRecord['fairsharingRecord'].name,
                  _module.currentRecord['fairsharingRecord'].id,
              );
            }
          }
        },
        {
          name: () => {
            if (!_module.userIsLoggedIn){
              return "Watch record"
            }
            else {
              if (!_module.isWatching()){
                return "Watch record"
              }
              else {
                return "Unwatch record"
              }
            }
          },
          isDisabled: function() { return false },
          method: function(){
            if (!_module.userIsLoggedIn){
              _module.$router.push({
                path: "/accounts/login",
                query: {
                  goTo: `/${_module.currentRecord['fairsharingRecord'].id}`
                }
              })
            }
            else {
              if (_module.isWatching()) {
                _module.changeWatchRecord(false);
              }
              else {
                _module.changeWatchRecord(true);
              }
            }
          }
        },
        {
          name: function() {
            if (_module.currentRecord['fairsharingRecord'].hasGraph) {
              return "View Relation Graph"
            }
            return "No graph available"
          },
          isDisabled: function(){
            if (_module.currentRecord['fairsharingRecord'].hasGraph) {
              return false;
            }
            return true;
          },
          method: function(){
            _module.$router.push({
              path: "/graph/" + _module.currentRecord['fairsharingRecord'].id
            })
          }
        },
        {
          name: function() { return "View record history" },
          isDisabled: function(){return false},
          method: async () => {
            this.history = {
              show: true,
              loading: true
            };
            await this.getHistory();
            this.history.loading = false;
          }
        },
        {
          name: function () {
            return "Have a suggestion/question ?"
          },
          isDisabled: function () {
            return false;
          },
          method: function () {
            parent.location = "mailto:contact@fairsharing.org?subject=[FAIRsharing][Feedback] Comments on " + _module.currentRecord.fairsharingRecord.name;
          }
        }
      ];
      if (_module.user().is_curator && _module.needsReviewing()) {
        initial_buttons.push(
            {
              name: function () {
                return "Review this record"
              },
              isDisabled: function () {
                // Only to be seen by logged-in curators.
                // So, this line shouldn't really be encountered...
                /* istanbul ignore if */
                if (!_module.userIsLoggedIn) {
                  return true;
                }
                return !_module.user().is_curator;
              },
              method: async function () {
                await _module.reviewRecord();
              }
            }
        )
      }
      if (_module.user().is_super_curator) {
        initial_buttons.push(
            {
              name: function () {
                return "Delete this record"
              },
              isDisabled: function () {
                return !_module.user().is_super_curator;
              },
              method: /* istanbul ignore next */ async function () {
                _module.deleteRecordMenu(
                    _module.currentRecord['fairsharingRecord'].name,
                    _module.currentRecord['fairsharingRecord'].id,
                );
              }
            }
        )
      }
      if (_module.maintainsRecord) {
        let _module = this;
        initial_buttons.push(
            {
              name: function() { return "Stop maintaining"},
              isDisabled: function() {
                return false;
              },
              method: async function () {
                _module.stopMaintainRecordMenu(
                    _module.currentRecord['fairsharingRecord'].name,
                    _module.currentRecord['fairsharingRecord'].id,
                );
              }
            },
        )
      }
      this.buttons = initial_buttons;
    },
    convertStringToLocalVar(stringVarName){
      return this[stringVarName]
    },
    /*
        useful methods for communicating from child to parent // please keep these as reference
        updateStates(property, value) {
          this[property] = value
        },
        callMyMethod(name, value = null) {
          this[name](value)
        },
     */
    async confirmDelete(){
      const _module = this;
      _module.dialogs.disableButton = true;
      let data = await client.deleteRecord(_module.dialogs.recordID, this.user().credentials.token);
      if (data.error){
        _module.error = "error deleting record";
      }
      else{
        // Redirect to current record to show it has gone...
        this.$router.go();
      }
      _module.dialogs.deleteRecord = false;
    },
    claimRecordMenu(recordName, recordID) {
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.disableDelButton = true
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.claimRecord = true;
      /* istanbul ignore next */ setTimeout(function () {
        _module.dialogs.disableDelButton = false;
      }, 5000);
    },
    stopMaintainRecordMenu(recordName, recordID) {
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.disableDelButton = true
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.stopMaintainRecord = true;
      /* istanbul ignore next */ setTimeout(function () {
        _module.dialogs.disableDelButton = false;
      }, 5000);
    },
    deleteRecordMenu(recordName, recordID){
      const _module = this;
      _module.dialogs.disableButton = false;
      _module.dialogs.disableDelButton = true
      _module.dialogs.recordName = recordName;
      _module.dialogs.recordID = recordID;
      _module.dialogs.deleteRecord = true;
      /* istanbul ignore next */ setTimeout(function () {
        _module.dialogs.disableDelButton = false;
      }, 5000);
    },
    closeDeleteMenu () {
      this.dialogs.disableButton = true;
      this.dialogs.deleteRecord = false;
    },
    closeClaimMenu () {
      this.dialogs.disableButton = true;
      this.dialogs.claimRecord = false;
    },
    closeMaintainMenu () {
      this.dialogs.disableButton = true;
      this.dialogs.stopMaintainRecord = false;
    },
    goToEdit(){
      let _module = this;
      const recordID = '/' + _module.currentRecord['fairsharingRecord'].id;
      if (_module.userIsLoggedIn) {
        this.$router.push({
          path: recordID + '/edit',
          params: {
            fromRecordPage: true
          }
        })
      }
      else {
        this.$router.push({
          path: "/accounts/login",
          query: {
            goTo: `/${_module.currentRecord['fairsharingRecord'].id}`
          }
        })
      }

    },
    /**
     * Method to create a maintenance_request; sets canClaim and (on fail) error.
     * @returns {undefined}
     * */
    async requestOwnership() {
      let _module = this;
      const recordID =  _module.currentRecord['fairsharingRecord'].id;
      const claim = await client.claimRecord(recordID, _module.user().credentials.token);
      /* istanbul ignore else */
      if (claim.error) {
        _module.error = "Sorry, your request to claim this record failed. Please contact us.";
        _module.canClaim = false;
      }
      else {
        // show modal here
        _module.canClaim = false;
        _module.claimedTriggered = true;
        _module.alreadyClaimed = true;
      }
      await _module.checkAlerts();
      _module.dialogs.claimRecord = false;
    },
    /**
     * Method to remove current_user from the list of maintainers.
     * @returns {undefined}
     * */
    async removeMaintainer() {
      let _module = this;
      const recordID =  _module.currentRecord['fairsharingRecord'].id;
      // TODO: Write new function to remove claim.
      const unclaim = await client.removeMaintainer(recordID, _module.user().credentials.token);
      if (unclaim.error) {
        _module.error = "Sorry, your request to be removed as a maintainer of this record failed. Please contact us.";
        _module.stopMaintainFailure = true;
      }
      else {
        // Display a toast here.
        _module.stopMaintainSuccess = true;
        // remove maintainer from local data
        let newMaintainers = _module.currentRecord['fairsharingRecord']['maintainers'].filter(maintainer => {
            return maintainer.id !== _module.user().id
          }
        )
        _module.currentRecord['fairsharingRecord']['maintainers'] = newMaintainers;
      }
      _module.dialogs.stopMaintainRecord = false;
    },
    /**
     * Method to set the canClaim status for this record.
     * @returns {undefined}
     * */
    async checkClaimStatus() {
      let _module = this;
      if (_module.user().isLoggedIn) {
        const recordID = _module.currentRecord['fairsharingRecord'].id;
        _module.canClaim = false;
        try {
          const claim = await client.canClaim(recordID, _module.user().credentials.token);
          if (claim.error) {
            if (claim.error.response.data.existing && claim.error.response.data.status === 'pending') {
              let maintainer = _module.getField("maintainers").filter(maintainer => maintainer.username === _module.user().credentials.username);
              if (maintainer.length === 0) {
                //alreadyClaimed: this is the situation where the current record has been already claimed by user to be maintained.
                _module.alreadyClaimed = true;
              }
            }

            _module.ownershipApprovalStatus = claim.error.response.data.status;

            // assign expiring date for approval/rejection banner---
            if (_module.ownershipApprovalStatus === 'approved' || _module.ownershipApprovalStatus === 'rejected') {
              _module.setBannerExpiry();
            }
            _module.canClaim = false;
          }
          else {
            // show modal here
            _module.canClaim = !claim.existing;
          }
          if(!claim.error) {
            //noClaimRegistered: this is the situation where the current record is not requested to be maintained by user
            _module.noClaimRegistered = true;
          }
        }
        catch (e) {
          /* istanbul ignore next */
          _module.canClaim = false;
        }
      }
    },
    /**
     * Method to set the current record in the store
     * @returns {Promise} - the current record
     * */
    async getData() {
      let _module = this;
      this.queryTriggered = false;
      this.error = null;
      this.alreadyClaimed = false;
      this.claimedTriggered = false;
      this.tombstone = false;
      try {
        if (this.target) await _module.fetchPreviewRecord(this.target);
        else await _module.fetchRecord({
          id: this.currentRoute,
          token: (_module.user().credentials) ? _module.user().credentials.token : null
        });
        // UNCOMMENT ME TO TEST TOMBSTONE PAGE
        // Or, set tombstone to true on a record, if using a local server.
        // this.currentRecord['fairsharingRecord'].metadata.tombstone = true;
      }
      catch (e) {
        this.error = e.message;
      }
      this.queryTriggered = true;
    },
    /**
     * Method to dispatch the current record history into the store
     * @returns {Promise} - the current record history
     * */
    async getHistory() {
      await this.$store.dispatch("record/fetchRecordHistory", {
        id: this.currentRoute, token: this.user().credentials.token
      }
      );
    },
    /**
     * Test if the current user can edit the current record
     * @returns {Promise<void>}
     */
    async canEditRecord(){
      const _module = this;
      _module.canEdit = false;
      if (_module.user().isLoggedIn) {
        const recordID = _module.currentRecord['fairsharingRecord'].id;
        if (!recordID) {
          return false;
        }
        const canEdit = await client.canEdit(recordID, _module.user().credentials.token);
        _module.canEdit = !canEdit.error;
      }
      else {
        return false;
      }
    },
    /**
     * Method to add or remove the current record to the list of watched records
     * @param watch
     * @returns {Promise<void>}
     */
    async changeWatchRecord(watch) {
      const _module = this;
      this.loading = true;
      let operation;
      let records = _module.user().watchedRecords.slice();
      if (watch) {
        operation = 'add';
        records.push(_module.currentRecord['fairsharingRecord'].id);
      }
      else {
        operation = 'remove';
        records = records.filter(function(value){
          return value !== _module.currentRecord['fairsharingRecord'].id;
        });
      }
      let response = await this.updateWatchedRecords(
          {
            recordID: _module.currentRecord['fairsharingRecord'].id,
            operation: operation
          }
      );
      // Refresh user data to reload followed record status.
      /* istanbul ignore else */
      if (response.message.indexOf('success') !== -1){
        _module.changeWatched(records);
      }
      this.loading = false;
      await _module.checkAlerts();
    },
    /**
     * Test if the user is watching the current record
     * @returns {*|boolean}
     */
    isWatching() {
      if (this.user().watchedRecords === undefined) {
        return false;
      }
      return  this.currentRecord['fairsharingRecord'].id
          && this.user().watchedRecords.includes(this.currentRecord['fairsharingRecord'].id) || false;
    },
    setBannerExpiry() {
      const _module = this;
      let bannerExpiryDate = {...JSON.parse(localStorage.getItem("bannerExpiryDate"))};
      if (!bannerExpiryDate[_module.getField("id")]) {
        bannerExpiryDate = {
          ...JSON.parse(localStorage.getItem("bannerExpiryDate")),
          [_module.getField("id")]: new Date()
        }
        localStorage.setItem("bannerExpiryDate", JSON.stringify(bannerExpiryDate));
      }
    },
    isBannerExpired() {
      let now = new Date();
      let id = this.getField("id");
      const DAY = 2;
      const temp = JSON.parse(localStorage.getItem("bannerExpiryDate"));
      if (temp) {
        const expiryDate = new Date(temp[id]);
        // very important line: instead of adding if its been expired I directly assigned to variable so test can be passed much easier.
        return  !(expiryDate.getTime() + (DAY * 24 * 60 * 60 * 1000) < now.getTime());
      }
      return true;
    },
    needsReviewing() {
      const _module = this;
      let need = true;
      let d = new Date();
      let pastYear = d.getFullYear() - 1;
      d.setFullYear(pastYear);
      if (!_module.reviewsPresent()){
        return !_module.reviewsPresent();
      }
      else {
        // Creating a date from the string returned by the API.
        // See: https://stackoverflow.com/a/11658343/1195207
        _module.currentRecord['fairsharingRecord']['reviews'].forEach(function (review) {
          let rawDate = review['createdAt'].split('T')[0].split('-');
          if (new Date(rawDate[0], rawDate[1]-1, rawDate[2]) > d) {
            need = false;
          }
        })
      }
      return need;
    },
    reviewsPresent() {
      const _module = this;
      if (!_module.currentRecord['fairsharingRecord']['reviews']) {
        return false;
      }
      if(_module.currentRecord['fairsharingRecord']['reviews'].length === 0) {
        return false;
      }
      return true;
    },
    async reviewRecord() {
      // Post a review to the server.
      const _module = this;
      const recordID = _module.currentRecord['fairsharingRecord'].id;
      const reviewRecord = await client.reviewRecord(recordID, _module.user().credentials.token);
      if (reviewRecord.error) {
        _module.reviewFail = true;
      }
      else {
        _module.reviewSuccess = true;
        await this.getData();
      }
      // Re-display the menu.
      await this.getMenuButtons();
      await this.checkAlerts();
    }
  },
  metaInfo() {
    try {
      let id;
      if (this.currentRecord.fairsharingRecord.doi) {
        id = this.currentRecord.fairsharingRecord.doi.split('/')[1];
      }
      else {
        id = this.currentRecord.fairsharingRecord.id;
      }
      if (this.currentRecord.fairsharingRecord.abbreviation) {
        return {
          title: 'FAIRsharing | ' + this.currentRecord.fairsharingRecord.abbreviation,
          meta: [
            {
              name: 'description',
              content: `FAIRsharing record for ${this.currentRecord.fairsharingRecord.name} (${this.currentRecord.fairsharingRecord.abbreviation})`
            },
            {
              name: 'link',
              content: `${process.env.VUE_APP_HOSTNAME}${id}`,
              rel: 'canonical'
            }
          ]
        }
      }
      else {
        return {
          title: 'FAIRsharing | ' + this.currentRecord.fairsharingRecord.name,
          meta: [
            {
              name: 'description',
              content: `FAIRsharing record for ${this.currentRecord.fairsharingRecord.name}`
            },
            {
              name: 'link',
              content: `${process.env.VUE_APP_HOSTNAME}${id}`,
              rel: 'canonical'
            }
          ]
        }
      }
    } catch (e) {
      //error
    }
  }
}
</script>
<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
  transition-delay: 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
ul,li {
  padding: 0;
}

.claimtext {
  word-break: keep-all;
  font-size: 70%;
}

</style>
