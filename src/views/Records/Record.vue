<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-main>
    <v-container
      v-if="queryTriggered"
      fluid
    >
      <v-row v-if="error">
        <v-col cols="12">
          <NotFound />
        </v-col>
      </v-row>

      <v-row
        v-else
        class="pr-3"
      >
        <v-col
          cols="12"
          class="d-flex"
        >
          <v-alert
            v-if="alreadyClaimed || claimedTriggered"
            :type="claimedTriggered ? 'success' : 'warning'"
            style="flex:1"
            class="mr-3"
          >
            <span v-if="alreadyClaimed"> You have already requested to maintain this record. </span>
            <span v-if="claimedTriggered"> Thank you for claiming this record. </span>
            <span> We will be getting back to you between 48 and 72h.</span>
          </v-alert>
          <v-spacer v-else />
          <v-menu
            cmass="mt-3"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
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
      <v-row
        v-if="currentRecord['fairsharingRecord'] && !error"
        no-gutters
      >
        <v-col
          cols="12"
          lg="12"
          md="12"
          xl="12"
        >
          <v-row
            no-gutters
          >
            <v-col>
              <GeneralInfo />
            </v-col>
          </v-row>

          <!-- Single Row -->
          <v-row>
            <!--Left Column-->
            <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
              <!-- KEYWORDS -->
              <Keywords />

              <!-- SUPPORT -->
              <Support />

              <!-- ORGANISATION -->
              <Organisations />
            </v-col>
            <!--Right Column-->
            <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
              <!-- LICENCES -->
              <Licences />

              <!-- MAINTAINERS -->
              <Maintainers
                :can-claim="canClaim"
                @requestOwnership="requestOwnership"
              />

              <!-- PUBLICATIONS -->
              <Publications />
            </v-col>
          </v-row>
          <!-- Associated Records -->
          <v-row
            no-gutters
          >
            <v-col>
              <AssociatedRecords :record-associations="recordAssociations" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
    import Client from '@/components/GraphClient/GraphClient.js'
    import AssociatedRecords from "@/components/Records/Record/AssociatedRecords";
    import GeneralInfo from "@/components/Records/Record/GeneralInfo";
    import Keywords from '@/components/Records/Record/Keywords';
    import Licences from '@/components/Records/Record/Licences';
    import Maintainers from '@/components/Records/Record/Maintainers';
    import Organisations from '@/components/Records/Record/Organisations';
    import Publications from '@/components/Records/Record/Publications';
    import Support from '@/components/Records/Record/Support';
    import NotFound from "@/views/Errors/404"
    import RestClient from "@/components/Client/RESTClient.js"
    import stringUtils from '@/utils/stringUtils';

    const client = new RestClient();

    export default {
        name: "Record",
        components: {
            AssociatedRecords,
            GeneralInfo,
            Keywords,
            Licences,
            Maintainers,
            Organisations,
            Publications,
            Support,
            NotFound
        },
        mixins: [stringUtils],
        data: () => {
            return {
                error: null,
                queryTriggered: false,
                showScrollToTopButton: false,
                recordAssociations: [],
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
                return this.$route.params['id'];
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
            async currentRoute() {await this.getData()},
            async userIsLoggedIn() {
              await this.canEditRecord();
              await this.checkClaimStatus();
            }
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
            ...mapActions('record', ['fetchRecord', "fetchRecordHistory"]),
            /** Combines associations and reserveAssociations into a single array and prepare the data for the search table */
            prepareAssociations(associations, reverseAssociations) {
                let _module = this;
                let joinedArrays = associations.concat(reverseAssociations);
                const properties = ['fairsharingRecord', 'linkedRecord'];

                joinedArrays.forEach(item => {
                    let object = {};
                    properties.forEach(prop => {
                        if (Object.prototype.hasOwnProperty.call(item, prop)) {
                            object.recordAssocLabel = _module.cleanString(item.recordAssocLabel);
                            if (_module.currentRecord['fairsharingRecord'].registry === 'collection' && item.recordAssocLabel === 'collects'){
                                object.recordAssocLabel = 'is collected by';
                            }
                            if (_module.currentRecord['fairsharingRecord'].registry === 'policy' && item.recordAssocLabel === 'recommends'){
                                object.recordAssocLabel = 'is recommended by';
                            }
                            object.id = item[prop].id;
                            object.registry = item[prop].registry;
                            object.name = item[prop].name;
                            object.subject = _module.currentRecord['fairsharingRecord'].name;
                            object.type = item[prop].type;
                        }
                    });
                    _module.recordAssociations.push(object);
                });
            },
            /**
            * Goes to the edit page for this record.
            * @returns {undefined}
            * */
            goToEdit(){
              let _module = this;
              const recordID =  _module.currentRecord['fairsharingRecord'].id;
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
                    await _module.fetchRecord(this.currentRoute);
                    const currentRecord = _module.currentRecord['fairsharingRecord'];
                    _module.recordAssociations = [];
                    if (Object.prototype.hasOwnProperty.call(currentRecord, "recordAssociations") || Object.prototype.hasOwnProperty.call(currentRecord, "reverseRecordAssociations")) {
                        _module.prepareAssociations(_module.currentRecord['fairsharingRecord'].recordAssociations, _module.currentRecord['fairsharingRecord']['reverseRecordAssociations'])
                    }
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
            return {
                title: 'FAIRsharing | ' + this.currentRecord.fairsharingRecord.abbreviation
            }
        },
    }
</script>
