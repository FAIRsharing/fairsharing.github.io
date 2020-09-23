<template>
  <v-main>
    <h1 class="d-none">
      Content
    </h1>
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
        v-if="user().isLoggedIn && !error && canEdit"
        class="pr-3"
      >
        <v-spacer />
        <v-btn
          class="success"
          @click="goToEdit()"
        >
          EDIT
        </v-btn>
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
              <Maintainers />

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
    import {mapActions, mapState} from 'vuex'
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
                canEdit: false
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
            },
            async userIsLoggedIn() {
              await this.canEditRecord();
            }
        },
        mounted() {
            this.$nextTick(async function () {
                this.client = new Client();
                await this.getData();
                await this.canEditRecord()
            })
        },
        methods: {
            ...mapActions('record', ['fetchRecord', "fetchRecordHistory"]),
            /** Combines associations and reserveAssociations into a single array and prepare the data for the earch table */
            prepareAssociations(associations, reverseAssociations) {
                let _module = this;
                let joinedArrays = associations.concat(reverseAssociations);
                const properties = ['fairsharingRecord', 'linkedRecord'];

                joinedArrays.forEach(item => {
                    let object = {};
                    properties.forEach(prop => {
                        if (Object.prototype.hasOwnProperty.call(item, prop)) {
                            object.recordAssocLabel = _module.cleanString(item.recordAssocLabel);
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
             * Method to set the current record in the store
             * @returns {Promise} - the current record
             * */
            async getData() {
                let _module = this;
                this.queryTriggered = false;
                this.error = null;
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
                title: this.getTitle
            }
        },
    }
</script>
