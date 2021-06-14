<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-main>
    <v-container
      v-if="queryTriggered"
      fluid
    >
      <div>test</div>
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
          <v-alert
            v-if="!currentRecord.fairsharingRecord['isApproved'] && !error"
            dense
            type="info"
            class="mb-2 flex-grow-1"
          >
            <span>This record is is awaiting review by FAIRsharing curators</span>
          </v-alert>

          <v-alert
            v-if="isWatching()"
            dense
            type="info"
            class="mb-2 flex-grow-1"
          >
            <span>You are watching this record for changes</span>
          </v-alert>

          <div
            v-if="alreadyClaimed || claimedTriggered || user().is_curator"
            class="d-flex flex-column"
          >
            <v-alert
              v-if="user().is_curator && currentRecord.fairsharingRecord['isHidden']"
              dense
              type="info"
              class="mb-2 flex-grow-1"
            >
              <span>This record is hidden!</span>
            </v-alert>



            <v-alert
              v-if="alreadyClaimed"
              dense
              type="warning"
              class="mb-1 flex-grow-1"
            >
              <span> You have already requested to maintain this record.  We will be getting back to you between 48 and 72h.</span>
            </v-alert>
            <v-snackbar
              v-model="claimedTriggered"
              color="success"
              class="text-body"
            >
              Thank you for claiming this record. We will be getting back to you between 48 and 72h.
            </v-snackbar>
          </div>
          <div
            v-if="currentRecord.fairsharingRecord['isHidden']!==undefined && !error"
            class="text-right"
          >
            <v-menu
              offset-y
              :disabled="readOnlyMode"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  class="mt-1"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="getMenuButtons()"
                >
                  Actions
                  <v-icon
                    small
                    right
                  >
                    fa-chevron-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(button, index) in buttons"
                  :key="'button_' + index"
                  :disabled="button.isDisabled()"
                  @click="button.method()"
                >
                  <v-list-item-title>
                    {{ button.name() }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-col>
      </v-row>

      <!--  CuratorsNotes   -->
      <CuratorNotes class="ma-4 mb-7" />

      <Tombstone
        v-if="currentRecord['fairsharingRecord'] && currentRecord['fairsharingRecord'].metadata.tombstone"
        :record="currentRecord['fairsharingRecord']"
      />
      <!--  Content  -->
      <div v-if="currentRecord['fairsharingRecord'] && !error && !currentRecord['fairsharingRecord'].metadata.tombstone">
        <!-- Top Block -->
        <GeneralInfo
          :class="['ma-4',{'mb-10':currentRecord.fairsharingRecord.registry==='Collection'}]"
          :can-claim="canClaim"
          @requestOwnership="requestOwnership"
        />
        <!-- Dynamic Block -->
        <v-row no-gutters>
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!--Left Block-->
            <component
              :is="block"
              v-for="(block,index) in currentDynamicBlock.leftBlock"
              :key="block"
              :class="['ma-4',index===currentDynamicBlock.rightBlock.length-1?'mb-4':'mb-8']"
            />
          </v-col>
          <!--Right Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <component
              :is="block"
              v-for="(block,index) in currentDynamicBlock.rightBlock"
              :key="block"
              :class="['ma-4',index===currentDynamicBlock.rightBlock.length-1?'mb-4':'mb-8']"
            />
          </v-col>
        </v-row>

        <!-- Bottom Block -->
        <Publications
          v-if="currentRecord.fairsharingRecord.registry!=='Collection'"
          class="mb-8 ma-4"
        />
        <!-- Additional Information -->
        <AdditionalInfo
          v-if="currentRecord.fairsharingRecord.registry!=='Collection'"
          class="mb-8 ma-4"
        />
        <!-- Search Collection -->
        <SearchCollection
          v-if="currentRecord.fairsharingRecord.registry==='Collection'"
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
            @click="history.show = false"
          >
            <v-icon> fa-times </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2">
          <RecordHistory
            v-if="!history.loading"
            :history="currentRecordHistory.history"
            :legacy-logs="currentRecordHistory.legacyLogs"
          />
          <Loaders v-else />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- eslint-enable vue/no-v-html -->
  </v-main>
</template>

<script>
import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
import Client from '@/lib/GraphClient/GraphClient.js'
import RestClient from "@/lib/Client/RESTClient.js"
import stringUtils from '@/utils/stringUtils';
import GeneralInfo from "@/components/Records/Record/GeneralInfo";
import Tools from '@/components/Records/Record/Tools';
import DataConditions from '@/components/Records/Record/DataConditions';
import Publications from '@/components/Records/Record/Publications';
import Support from '@/components/Records/Record/Support';
import NotFound from "@/views/Errors/404"
import Organisations from "@/components/Records/Record/Organisations";
import Collections from "@/components/Records/Record/Collections";
import RelatedContent from "@/components/Records/Record/RelatedContent";
import RecordHistory from "@/components/Records/Record/History/RecordHistory";
import Loaders from "@/components/Navigation/Loaders";
import SearchCollection from "@/components/Records/Record/CollectionRecord/SearchCollection";
import Tombstone from "../Errors/Tombstone";
import AdditionalInfo from "@/components/Records/Record/AdditionalInfo";
import CuratorNotes from "@/components/Records/Record/CuratorNotes";

const client = new RestClient();

export default {
  name: "Record",
  components: {
    CuratorNotes,
    AdditionalInfo,
    Tombstone,
    SearchCollection,
    Loaders,
    RecordHistory,
    RelatedContent,
    Collections,
    Organisations,
    GeneralInfo,
    Tools,
    DataConditions,
    Publications,
    Support,
    NotFound
  },
  mixins: [stringUtils],
  props: {
    target: {type: Number, default: null}
  },
  data: () => {
    return {
      error: null,
      queryTriggered: false,
      showScrollToTopButton: false,
      canEdit: false,
      canClaim: false,
      alreadyClaimed: false,
      claimedTriggered: false,
      buttons: [],
      history: {
        show: false,
        loading: false
      },
      tombstone: false
    }
  },
  computed: {
    JSONLD () {
      return JSON.stringify(this.getField("schemaOrg"));
    },
    currentRoute() {
      let id = this.$route.params['id'];
      if (id.includes("FAIRsharing.")) {
        return "10.25504/" + id;
      }
      return this.target || this.$route.params['id'];
    },
    ...mapState('record', ["currentRecord", "currentRecordHistory"]),
    ...mapState('users', ["user", "messages"]),
    ...mapGetters("record", ["getField"]),
    ...mapState('introspection', ["readOnlyMode"]),
    userIsLoggedIn(){
      return this.user().isLoggedIn;
    },
    getTitle() {
      return 'FAIRsharing | ' + this.currentRoute;
    },
    currentDynamicBlock() {
      if (this.$vuetify.breakpoint.name === 'md') {
        return {
          leftBlock: ["Collections", "RelatedContent", "Support"],
          rightBlock: ["DataConditions", "Tools", "Organisations"]
        }
      } else {
        return {
          leftBlock: ["Collections", "Support", "DataConditions"],
          rightBlock: ["RelatedContent", "Tools", "Organisations"]
        }
      }
    }
  },
  watch: {
    async currentRoute() {
      await this.getData();
      await this.checkClaimStatus();
    },
    async userIsLoggedIn() {
      await this.canEditRecord();
      await this.checkClaimStatus();
    }
  },
  destroyed() {
    // minor change in the y axis can fix a serious bug after going back to records..
    this.$scrollTo('body',5,{})
  },
  mounted() {
    this.$nextTick(async function () {
      this.client = new Client();
      await this.getData();
      await this.canEditRecord();
      await this.checkClaimStatus();
    })
  },
  methods: {
    ...mapActions('record', ['fetchRecord', 'fetchRecordHistory', 'fetchPreviewRecord']),
    ...mapActions('users', ['updateWatchedRecords']),
    ...mapMutations('users', ['changeWatched']),
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
      if (claim.error) {
        _module.error = "Sorry, your request to claim this record failed. Please contact us.";
        _module.canClaim = false;
      }
      else {
        // show modal here
        _module.canClaim = false;
        _module.claimedTriggered = true;
      }
    },
    /**
     * Method to set the canClaim status for this record.
     * @returns {undefined}
     * */
    async checkClaimStatus() {
      let _module = this;
      if (_module.user().isLoggedIn) {
        const recordID = _module.currentRecord['fairsharingRecord'].id;
        const claim = await client.canClaim(recordID, _module.user().credentials.token);
        if (claim.error) {
          if (claim.error.response.data.existing){
            let maintainer = _module.getField("maintainers").filter(maintainer => maintainer.username === _module.user().credentials.username);
            if (maintainer.length === 0){
              _module.alreadyClaimed = true;
            }
          }
          _module.canClaim = false;
        }
        else {
          // show modal here
          _module.canClaim = !claim.existing;
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
        // this.currentRecord['fairsharingRecord'].metadata.tombstone = true; // UNCOMMENT ME TO TEST TOMBSTONE PAGE
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
      await this.$store.dispatch("record/fetchRecordHistory", this.currentRoute);
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
        const canEdit = await client.canEdit(recordID, _module.user().credentials.token);
        _module.canEdit = !canEdit.error;
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
      let records = _module.user().watchedRecords.slice();
      if (watch) {
        records.push(_module.currentRecord['fairsharingRecord'].id)
      }
      else {
        records = records.filter(function(value){
          return value !== _module.currentRecord['fairsharingRecord'].id;
        });
      }
      let data = {
        watched_record_ids: records
      };
      let response = await this.updateWatchedRecords(data);
      // Refresh user data to reload followed record status.
      if (response.modification === 'success'){
        _module.changeWatched(records);
      }
      this.loading = false;
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
    /**
     * Method that builds and set the buttons of the action menu
     */
    getMenuButtons(){
      let _module = this;
      _module.buttons = [
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
            return !_module.canClaim
          },
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
              return _module.requestOwnership()
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
          name: function() { return "View Relation Graph" },
          isDisabled: function(){ return false },
          method: function(){
            _module.$router.push({
              path: "/graph/" + _module.currentRecord['fairsharingRecord'].id
            })
          }
        },
        {
          name: function() { return "View record history" },
          isDisabled: function(){return !_module.user().is_curator},
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
          name: function() { return "Have a suggestion/question ?" },
          isDisabled: function(){ return true},
          method: function(){return null}
        }
      ];
    }
  },
  metaInfo() {
    try {
      if (this.currentRecord.fairsharingRecord.abbreviation) {
        return {
          title: 'FAIRsharing | ' + this.currentRecord.fairsharingRecord.abbreviation
        }
      }
    } catch (e) {
      //error
    }
  },
}
</script>
