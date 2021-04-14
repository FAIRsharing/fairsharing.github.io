<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-main>
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
            v-if="currentRecord.fairsharingRecord['isHidden']!==undefined"
            class="text-right"
          >
            <v-menu
              offset-y
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

      <!--  Content  -->
      <div v-if="currentRecord['fairsharingRecord'] && !error">
        <!-- Top Block -->
        <GeneralInfo
          class="ma-4"
          :can-claim="canClaim"
          @requestOwnership="requestOwnership"
        />

        <v-row no-gutters>
          <!--Left Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!-- COLLECTIONS -->
            <Collections class="ma-4 mb-8" />
            <!-- SUPPORT -->
            <Support class="ma-4 mb-8" />
            <!-- Data Conditions -->
            <DataCondtions class="ma-4 mb-4" />
          </v-col>
          <!--Right Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!-- Related Content -->
            <RelatedContent class="ma-4 mb-8" />
            <!-- Tools -->
            <Tools class="ma-4 mb-8" />
            <!-- Organisations -->
            <Organisations class="ma-4 mb-6 mb-sm-4 " />
          </v-col>
        </v-row>
        <!-- Bottom Block -->
        <Publications class="mb-10 ma-4" />
      </div>
    </v-container>
    <!-- This html is from a safe source -->
    <!-- eslint-disable vue/no-v-html -->
    <script
      type="application/ld+json"
      v-html="JSONLD"
    />
    <!-- eslint-enable vue/no-v-html -->
  </v-main>
</template>

<script>
    import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'
    import Client from '@/components/GraphClient/GraphClient.js'
    import RestClient from "@/components/Client/RESTClient.js"
    import stringUtils from '@/utils/stringUtils';
    import GeneralInfo from "@/components/Records/Record/GeneralInfo";
    import Tools from '@/components/Records/Record/Tools';
    import DataCondtions from '@/components/Records/Record/DataConditions';
    import Publications from '@/components/Records/Record/Publications';
    import Support from '@/components/Records/Record/Support';
    import NotFound from "@/views/Errors/404"
    import Organisations from "@/components/Records/Record/Organisations";
    import Collections from "@/components/Records/Record/Collections";
    import RelatedContent from "@/components/Records/Record/RelatedContent";

    const client = new RestClient();

    export default {
        name: "Record",
        components: {
          RelatedContent,
          Collections,
          Organisations,
            GeneralInfo,
            Tools,
            DataCondtions,
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
                buttons: []
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
            userIsLoggedIn(){
              return this.user().isLoggedIn;
            },
            getTitle() {
                return 'FAIRsharing | ' + this.currentRoute;
            },
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
                try {
                  if (this.target) await _module.fetchPreviewRecord(this.target);
                    else await _module.fetchRecord({
                        id: this.currentRoute,
                        token: _module.user().credentials.token
                      });
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
            async canEditRecord(){
              const _module = this;
              _module.canEdit = false;
              if (_module.user().isLoggedIn) {
                const recordID = _module.currentRecord['fairsharingRecord'].id;
                const canEdit = await client.canEdit(recordID, _module.user().credentials.token);
                _module.canEdit = !canEdit.error;
              }
            },
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
              }
              let response = await this.updateWatchedRecords(data);
              // Refresh user data to reload followed record status.
              if (response.modification === 'success'){
                _module.changeWatched(records);
              }
              this.loading = false;
            },
            isWatching() {
              return  this.currentRecord['fairsharingRecord'].id
                      && this.user().watchedRecords.includes(this.currentRecord['fairsharingRecord'].id);
            },
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
                  name: function() { return "Have a suggestion/question ?" },
                  isDisabled: function(){ return true},
                  method: function(){return null}
                }
            ];
          }
        },
        metaInfo() {
          try {
            if (!this.target) {
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
