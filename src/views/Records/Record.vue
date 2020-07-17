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
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row
        v-if="user().isLoggedIn && !error"
        class="pr-3"
      >
        <v-spacer />
        <v-btn
          class="success"
          :href="'#/' + currentRoute + '/edit'"
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
              <v-card
                class="pa-4 mt-5 d-flex flex-column"
                outlined
                tile
                elevation="1"
              >
                <!-- General Info -->
                <SectionTitle title="General Info"/>
                <!-- Ribbon -->
                <Ribbon
                  v-if="currentRecord['fairsharingRecord'].isRecommended"
                  title="RECOMMENDED"
                />
                <!-- Title and DOI -->
                <v-row
                  no-gutters
                  class="mb-2"
                >
                  <v-col
                    cols="4"
                    sm="2"
                    md="2"
                    lg="1"
                    xl="1"
                    class="d-flex flex-row align-center mt-4 "
                  >
                    <record-status :record="currentRecord['fairsharingRecord']" />
                  </v-col>
                  <v-col
                    class="d-flex flex-column justify-center"
                    cols="12"
                    sm="10"
                    md="10"
                    lg="11"
                    xl="11"
                  >
                    <div class="d-flex flex-column mt-2  ml-sm-6 ml-lg-8">
                      <div class="d-flex flex-row mb-2 align-center">
                        <h3>{{ currentRecord['fairsharingRecord'].name }}</h3>
                        <b class="ml-2">({{ currentRecord['fairsharingRecord'].abbreviation
                        }})</b>
                      </div>
                      <div class="d-flex align-center">
                        <h3 class="mr-1">
                          doi:
                        </h3>
                        <a :href="currentRecord['fairsharingRecord'].doi">
                          {{ currentRecord['fairsharingRecord'].doi }}
                        </a>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <section>
                  <!--Type-->
                  <div class="d-flex">
                    <b class="mr-2">Type:</b>
                    <p>
                      {{ cleanString(currentRecord['fairsharingRecord'].type) | capitalize }}
                    </p>
                  </div>
                  <!--Year of Creation-->
                  <!--!! Attention need data model to be changed. must be sent by fairsharing Object like below!! -->
                  <!--fairsharingRecord.year_creation-->
                  <div class="d-flex">
                    <b class="mr-2">Year of Creation:</b>
                    <p>{{ currentRecord['fairsharingRecord'].metadata.year_creation }}</p>
                  </div>
                  <!--Registry-->
                  <div class="d-flex">
                    <b class="mr-2">Registry:</b>
                    <p>{{ currentRecord['fairsharingRecord'].registry | capitalize }}</p>
                  </div>
                  <!--Description-->
                  <div class="d-flex align-center">
                    <b class="mr-2">Description:</b>
                    <p>{{ currentRecord['fairsharingRecord'].description | capitalize }}</p>
                  </div>
                  <!--HomePage-->
                  <div class="d-flex">
                    <b class="mr-2 mb-4">Home Page:</b>
                    <a
                      :href="currentRecord['fairsharingRecord'].homepage"
                      target="_blank"
                    >{{ currentRecord['fairsharingRecord'].homepage }}</a>
                  </div>
                  <!--Developed Countries -->
                  <div class="d-flex flex-wrap">
                    <b class="mr-2">Countries developed this resource:</b>
                    <v-tooltip
                      v-for="country in currentRecord['fairsharingRecord'].countries"
                      :key="country.id"
                      top
                    >
                      <template v-slot:activator="{ on }">
                        <v-sheet
                          class="mb-2 flag-mr"
                          v-on="on"
                        >
                          <country-flag
                            :country="country.code"
                            size="big"
                          />
                        </v-sheet>
                      </template>
                      <span class="white--text">{{ country.name }}</span>
                    </v-tooltip>
                  </div>
                </section>
              </v-card>
            </v-col>
          </v-row>

          <!-- Single Row -->
          <v-row>
            <!--Left Column-->
            <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
              <!-- KEYWORDS -->
              <Keywords :taxonomies="currentRecord['fairsharingRecord'].taxonomies"
                        :domains="currentRecord['fairsharingRecord'].domains"
                        :subjects="currentRecord['fairsharingRecord'].subjects"
              />

              <!-- SUPPORT -->
              <Support :contactData="currentRecord['fairsharingRecord'].metadata.contacts" :supportLinkData="null" />

              <!-- ORGANISATION -->
              <Organisations :organisationData="currentRecord['fairsharingRecord'].organisations"/>

            </v-col>
            <!--Right Column-->
            <v-col :cols="$vuetify.breakpoint.mdAndDown?'12':'6'">
              <!-- LICENCES -->
              <Licences :licenceData="currentRecord['fairsharingRecord'].licences"/>

              <!-- MAINTAINERS -->
              <Maintainers :maintainerData="currentRecord['fairsharingRecord'].maintainers"/>

              <!-- GRANTS -->
              <Grants :grantData="currentRecord['fairsharingRecord'].grants"/>

              <!-- PUBLICATIONS -->
              <Publications :publicationData="currentRecord['fairsharingRecord'].publications"/>

            </v-col>
          </v-row>
          <!-- Associated Records -->
          <v-row
            no-gutters
          >
            <v-col>
              <v-card
                class="pa-4 mt-2 d-flex flex-column"
                outlined
                tile
                elevation="1"
              >
                <div class="title-style">
                  <div>
                    <h4>
                      ASSOCIATED
                      RECORDS
                    </h4>
                    <span class="triangle-bottomLeft" /><span
                      class="triangle-bottomRight"
                    />
                  </div>
                </div>
                <section class="mt-2">
                  <v-card class="mt-3">
                    <v-card-title>
                      Data Table
                      <v-spacer />
                      <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                      />
                    </v-card-title>
                    <v-data-table
                      :headers="headers"
                      :items="recordAssociations"
                      :search="search"
                    />
                  </v-card>
                </section>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import CountryFlag from 'vue-country-flag';
  import Client from '@/components/GraphClient/GraphClient.js'
  import Grants from '@/components/Records/Record/Grants';
  import Keywords from '@/components/Records/Record/Keywords';
  import Licences from '@/components/Records/Record/Licences';
  import Maintainers from '@/components/Records/Record/Maintainers';
  import Organisations from '@/components/Records/Record/Organisations';
  import Publications from '@/components/Records/Record/Publications';
  import RecordStatus from "@/components/Records/Shared/RecordStatus";
  import Ribbon from "@/components/Records/Shared/Ribbon";
  import SectionTitle from '@/components/Records/Record/SectionTitle';
  import Support from '@/components/Records/Record/Support';

  export default {
    name: "Record",
    components: {
      CountryFlag,
      Grants,
      Keywords,
      Licences,
      Maintainers,
      Organisations,
      Publications,
      RecordStatus,
      Ribbon,
      SectionTitle,
      Support
    },
    filters: {
      capitalize (str){
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1)
      }
    },
    data: () => {
      return {
        error: null,
        queryTriggered: false,
        search: '',
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Registry', value: 'registry' },
          { text: 'Relationship', value: 'recordAssocLabel' },
          { text: 'Subject', value: 'subject' },
        ],
        showScrollToTopButton: false,
        recordAssociations: []
      }
    },
    computed: {
      currentRoute () {
        let id = this.$route.params['id'];
        if (id.includes("FAIRsharing.")) {
          return "10.25504/" + id;
        }
        return this.$route.params['id'];
      },
      ...mapState('record', ["currentRecord", "currentRecordHistory"]),
      ...mapState('users', ["user"]),
      getTitle () {
        return 'FAIRsharing | ' + this.currentRoute;
      },
    },
    watch: {
      async currentRoute() {
        await this.getData();
      }
    },
    mounted() {
      this.$nextTick(async function () {
        this.client = new Client();
        await this.getData();
      })
    },
    methods: {
      ...mapActions('record', ['fetchRecord', "fetchRecordHistory"]),
      /** Combines associations and reserveAssociations into a single array and prepare the data for the search table */
      prepareAssociations (associations, reverseAssociations) {
        let _module = this;
        let joinedArrays = associations.concat(reverseAssociations);
        const properties = ['fairsharingRecord', 'linkedRecord'];
        joinedArrays.forEach(item => {
          let object = {
            recordAssocLabel: _module.cleanString(item.recordAssocLabel),
            subject: _module.currentRecord['fairsharingRecord'].name
          };
          properties.forEach(prop => {
            if (Object.prototype.hasOwnProperty.call(item, prop)) {
              object.id = item[prop].id;
              object.registry = item[prop].registry;
              object.name = item[prop].name;
            }
          });
          _module.recordAssociations.push(object);
        });
      },
      /**
       * Method to set the current record in the store
       * @returns {Promise} - the current record
       * */
      async getData () {
        let _module = this;
        this.queryTriggered = false;
        this.error = null;
        try {
          await _module.fetchRecord(this.currentRoute);
          const currentRecord = _module.currentRecord['fairsharingRecord'];
          _module.recordAssociations = [];
          if (Object.prototype.hasOwnProperty.call(currentRecord, "recordAssociations") || Object.prototype.hasOwnProperty.call(currentRecord, "reverseRecordAssociations")) {
            _module.prepareAssociations(_module.currentRecord['fairsharingRecord'].recordAssociations, _module.currentRecord['fairsharingRecord'].reverseRecordAssociations)
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
      async getHistory () {
        await this.$store.dispatch("record/fetchRecordHistory", this.currentRoute);
      },
      cleanString (string) {
        if (typeof string === "string") {
          return string.replace(/_/g, " ");
        }
        return string;
      }
    },
    metaInfo() {
      return {
        title: this.getTitle
      }
    },
  }
</script>

<style scoped lang="scss">
  a {
    text-decoration: none;

    &:hover, &:focus {
      text-decoration: underline;
      outline: 0;
    }
  }

  .flag-mr {
    margin-right: .29em;
  }

  #banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1em;
  }

  .content-custom {
    max-height: 100vh;
    scroll-behavior: smooth;
    padding: 0;
  }

  .title-style {
    position: absolute;
    top: -10px;
    background: linear-gradient(#4f5f5d, #00aa8e);
    background: -moz-linear-gradient(#4f5f5d, #00aa8e);
    background: -webkit-linear-gradient(#4f5f5d, #00aa8e);
    background: -o-linear-gradient(#4f5f5d, #00aa8e);
    padding: 1px 10px 1px 10px;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;

    div {
      position: relative;

      h4 {
        font-size: 1rem;
        color: white;
      }

      .triangle-bottomLeft {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: -18px;
        border-bottom: 8px solid #aaaaaa;
        border-left: 8px solid transparent;
      }

      .triangle-bottomRight {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        right: -18px;
        border-bottom: 8px solid #aaaaaa;
        border-right: 8px solid transparent;
      }
    }

  }
</style>
