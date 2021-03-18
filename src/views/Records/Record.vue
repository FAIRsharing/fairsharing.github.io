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
        class="pr-3"
      >
        <v-col
          cols="12"
          class="d-flex"
        >
          <div
            v-if="alreadyClaimed || claimedTriggered || user().is_curator"
            class="d-flex flex-column flex-grow-1"
          >
            <v-alert
              v-if="user().is_curator && currentRecord.fairsharingRecord['isHidden']"
              dense
              type="info"
              class="mr-3"
            >
              <span>the record is hidden</span>
            </v-alert>

            <v-alert
              v-if="alreadyClaimed"
              dense
              type="warning"
              style="flex:1"
              class="mr-3"
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
          <v-spacer v-else />
          <v-menu
            class="mt-3"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-btn
                class="mt-2"
                color="primary"
                v-bind="attrs"
                v-on="on"
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
                v-for="(button, index) in getMenuButtons"
                :key="'button_' + index"
                :disabled="button.isDisabled()"
                @click="button.method()"
              >
                <v-list-item-title>
                  {{ button.name }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <!--  Content  -->
      <div v-if="currentRecord['fairsharingRecord'] && !error">
        <!-- Top Block -->
        <GeneralInfo
          :can-claim="canClaim"
          @requestOwnership="requestOwnership"
        />

        <v-row no-gutters>
          <!--Left Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!-- COLLECTIONS -->
            <Collections class="mt-5" />
            <!-- SUPPORT -->
            <Support class="mt-5" />
            <!-- Data Conditions -->
            <DataCondtions class="mt-5" />
          </v-col>
          <!--Right Block-->
          <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
            <!-- Tools -->
            <Tools class="mt-5 ml-lg-5" />
            <!-- Organisations -->
            <Organisations class="mt-5 ml-lg-5" />
          </v-col>
        </v-row>
        <!-- Bottom Block -->
        <Publications class="mt-5 mb-10" />
      </div>
    </v-container>
  </v-main>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
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

    const client = new RestClient();

    export default {
        name: "Record",
        components: {
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
            }
        },
        computed: {
            currentRoute() {
                let id = this.$route.params['id'];
                if (id.includes("FAIRsharing.")) {
                    return "10.25504/" + id;
                }
                return this.target || this.$route.params['id'];
            },
            ...mapState('record', ["currentRecord", "currentRecordHistory"]),
            ...mapState('users', ["user"]),
            ...mapGetters("record", ["getField"]),
            userIsLoggedIn(){
              return this.user().isLoggedIn;
            },
            getTitle() {
                return 'FAIRsharing | ' + this.currentRoute;
            },
            getMenuButtons(){
              let _module = this;
              return [
                {
                  name: "Edit record",
                  isDisabled: function(){
                    if (!_module.userIsLoggedIn){
                      return false
                    }
                    return !_module.canEdit
                  },
                  method: function(){return _module.goToEdit()}
                },
                {
                  name: "Request ownership",
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
                  name: "Watch record",
                  disable: true,
                  isDisabled: function(){ return true},
                  method: function(){return null}
                },
                {
                  name: "Have a suggestion/question ?",
                  isDisabled: function(){ return true},
                  method: function(){return null}
                }
              ];
            }
        },
        watch: {
            async currentRoute() {
              await this.getData()
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
            ...mapActions('record', ['fetchRecord', "fetchRecordHistory", "fetchPreviewRecord"]),
            goToEdit(){
              let _module = this;
              const recordID = '/' + _module.currentRecord['fairsharingRecord'].id;
              this.$router.push({
                path: recordID + '/edit',
                params: {
                  fromRecordPage: true
                }
              })
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
                    else await _module.fetchRecord(this.currentRoute);
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
