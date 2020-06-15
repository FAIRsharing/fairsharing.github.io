<template>
  <v-card id="editPublications">
    <v-card-title>
      Edit Publications
    </v-card-title>
    <v-card-text v-if="errors.general">
      <v-alert type="error">
        {{ errors.general.data }}
      </v-alert>
    </v-card-text>
    <v-card-text>
      <v-container
        fluid
        class="pb-0"
      >
        <v-row>
          <v-alert
            width="100%"
            type="warning"
            dismissible
          >
            <b>Note:</b> Publications can only be edited before being saved. Once saved to the database, you will have to ask an administrator
            to modify it for you. However, you can associate and create as many publications as required.
          </v-alert>
        </v-row>
        <v-row>
          <v-col
            v-for="(publication, pubIndex) in publications"
            :key="'selected_' + pubIndex"
            class="col-3"
          >
            <v-card
              class="pb-4"
              height="100%"
            >
              <v-card-text class="text-justify mb-12">
                <div> <b>{{ publication.title }} </b> <i>({{ publication.journal }}, {{ publication.year }}).</i></div>
                <div> <b>DOI:</b> {{ publication.doi }}</div>
                <div> <b>AUTHORS:</b> {{ publication.authors }}</div>
              </v-card-text>
              <v-card-actions
                class="justify-center"
                style="bottom:0; position:absolute"
              >
                <v-btn
                  :disabled="Object.keys(publication).indexOf('id') > -1"
                  class="green mr-3 white--text"
                  @click="editPublication(publication, pubIndex)"
                >
                  <v-icon
                    small
                    left
                  >
                    fas fa-pen
                  </v-icon>
                  EDIT
                </v-btn>
                <v-btn
                  class="red mr-3 white--text"
                  @click="removePublication(pubIndex)"
                >
                  <v-icon
                    small
                    left
                  >
                    fa-trash
                  </v-icon>
                  REMOVE
                </v-btn>
                <v-btn class="primary">
                  <v-icon
                    small
                    left
                  >
                    fas fa-quote-left
                  </v-icon>
                  CITE RECORD
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search through publications"
        outlined
        hide-details
      />
      <v-data-table
        v-model="publications"
        :items="availablePublications"
        :headers="headers"
        :search="search"
        :loading="loading"
        class="elevation-1"
        show-select
        :items-per-page="9"
      >
        <template slot="no-results">
          <div class="noPublications">
            <div class="noTerm mt-3">
              No publications found. Would you like to create a new publication or import it from a DOI or a PubMed ID?
            </div>
            <v-btn
              class="green white--text my-3"
              @click="getDOI()"
            >
              Import from DOI
            </v-btn>
            <v-btn
              class="green white--text my-3 ml-3"
              @click="getPMID()"
            >
              Import from PUBMED ID
            </v-btn>
            <v-btn
              class="green white--text my-3 ml-3"
              @click="createNewPublication()"
            >
              Create new publication
            </v-btn>
          </div>
          <v-alert
            v-if="errors.doi"
            type="error"
          >
            DOI not found !
          </v-alert>
          <v-alert
            v-if="errors.pmid"
            type="error"
          >
            PubMed ID not found !
          </v-alert>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        @click="updateLicences()"
      >
        Submit Publications
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="openEditor"
      max-width="1000px"
      class="pa-0"
      persistent
      no-click-animation
    >
      <v-container
        fluid
        class="py-0"
      >
        <v-row justify="center">
          <v-card width="100%">
            <v-card-title class="green white--text">
              Create/Edit a new publication
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-row justify="start">
                  <v-col class="col-6">
                    <v-text-field
                      v-model="newPublication.doi"
                      label="DOI"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-6">
                    <v-text-field
                      v-model="newPublication.pubmed_id"
                      label="PubMed ID"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-12">
                    <v-text-field
                      v-model="newPublication.title"
                      label="Title"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-4">
                    <v-text-field
                      v-model="newPublication.authors"
                      label="Authors"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-4">
                    <v-text-field
                      v-model="newPublication.journal"
                      label="Journal"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-4">
                    <v-text-field
                      v-model="newPublication.year"
                      label="Publication Year"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-12">
                    <v-text-field
                      v-model="newPublication.url"
                      label="URL"
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="green white--text"
                @click="addPublication()"
              >
                Edit or add a new publication
              </v-btn>
              <v-btn
                class="red white--text"
                @click="openEditor = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
  </v-card>
</template>

<script>
    import { mapState, mapActions } from "vuex"
    import { parseBibFile } from "bibtex";
    import PublicationClient from "@/components/Client/ExternalClients.js"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import publicationsQuery from "@/components/GraphClient/queries/getPublications.json"

    const graphClient = new GraphClient();
    const pubClient = new PublicationClient();

    export default {
        name: "EditPublications",
        data(){
          return {
            publications: [],
            availablePublications: [],
            headers: [
              {
                text: "title",
                value: "title"
              },
              {
                text: "doi",
                value: "doi"
              },
              {
                text: "authors",
                value: "authors"
              },
              {
                text: "journal",
                value: "journal"
              },
              {
                text: "url",
                value: "url"
              },
              {
                text: "year",
                value: "year"
              }
            ],
            search: null,
            loading: true,
            newPublication: {},
            errors: {
              doi: null,
              general: null,
              pmid: null
            },
            openEditor: false,
            currentPublicationIndex: false
          }
        },
        computed: {
          ...mapState('record', ['currentRecord', 'recordUpdate']),
          ...mapState('users', ['user'])
        },
        mounted(){
          this.$nextTick(async function () {
            this.publications = JSON.parse(JSON.stringify(this.currentRecord["fairsharingRecord"].publications));
            let pub = await graphClient.executeQuery(publicationsQuery);
            this.availablePublications = pub['searchPublications'];
            this.loading = false;
          });
        },
        methods: {
          ...mapActions("record", ["updateRecord"]),
          async getDOI(){
              this.currentPublicationIndex = false;
              this.errors = {
                  doi: null,
                  general: null,
                  pmid: null
              };
              let doi = (' ' + this.search).slice(1).trim(); // make a copy of the string and trim it
              let data = await pubClient.getDOI(doi);
              if (data.error){
                this.errors.doi = true;
              }
              else {
                let publication = parseBibFile(data).content[0];
                this.newPublication.authors = publication.getField('author').data.join('');
                this.newPublication.doi = publication.getField('doi').data.join('');
                this.newPublication.title = publication.getField('title').data.join('');
                this.newPublication.journal = publication.getField('journal').data.join('');
                this.newPublication.url = decodeURIComponent(publication.getField('url').data.join(''));
                this.newPublication.year = publication.getField('year');
                this.openEditor = true;
              }
          },
          async getPMID() {
              this.currentPublicationIndex = false;
              this.errors = {
                doi: null,
                general: null,
                pmid: null
              };
              let id = (' ' + this.search).slice(1).trim(); // make a copy of the string and trim it
              let data = await pubClient.getPMID(id);
              if (data.error || data.result[id].error){
                this.errors.pmid = true
              }
              else {
                const pub = data.result[id];
                let doi = this.processIDs(pub['elocationid']);
                this.newPublication = {
                  title: pub.title,
                  journal: pub['fulljournalname'],
                  year: pub['pubdate'],
                  authors: pub['authors'].map(function(elem){return elem.name;}).join(", "),
                  pubmed_id: pub['uid']
                };
                if (doi) {
                  this.newPublication.doi = doi;
                  this.newPublication.url = "https://doi.org/" + doi;
                }
                this.openEditor = true;
              }
          },
          processIDs(idsString){
            let doi = null;
            if (idsString){
              let IDsArray = idsString.split(". ");
              IDsArray.forEach(function(IDString){
                let IDArray = IDString.split(": ");
                if (IDArray[0] === 'doi'){
                  doi = IDArray[1]
                }
              });
            }
            return doi;
          },
          addPublication(){
            let newPub = JSON.parse(JSON.stringify(this.newPublication));
            if (this.currentPublicationIndex){
              delete this.availablePublications[newPub.pubIndex];
              this.publications[this.currentPublicationIndex] = newPub;
              newPub.pubIndex = this.availablePublications.length;
              this.availablePublications.push(newPub);
            }
            else{
              this.publications.push(newPub);
              newPub.pubIndex = this.availablePublications.length;
              this.availablePublications.push(newPub);
            }
            if (!newPub.doi){
              this.search = newPub.title;
            }
            else {
              this.search = newPub.doi;
            }
            this.newPublication = {};
            this.openEditor = false;
            this.currentPublicationIndex = false;
          },
          removePublication(pubIndex){
            this.publications.splice(pubIndex, 1);
          },
          editPublication(publication, publicationIndex){
            this.currentPublicationIndex = (' ' + publicationIndex).slice(1);
            this.openEditor = true;
            this.newPublication = JSON.parse(JSON.stringify(publication));
          },
          async updateLicences(){
              this.openEditor = false;
              let licences = {
                publication_ids: [],
                publications_attributes: []
              };
              this.publications.forEach(function(publication){
                if (publication.id){
                  licences.publication_ids.push(publication.id);
                }
                else {
                  licences.publications_attributes.push(publication);
                }
              });
              const record = {
                record: licences,
                token: this.user().credentials.token,
                id: this.$route.params.id
              };
              await this.updateRecord(record);
              if (!this.recordUpdate.error){
                let ID = this.recordUpdate.id.data.id;
                this.$router.push({
                  path: "/" + ID
                })
              }
              else {
                this.errors.general = this.recordUpdate.message;
              }
            },
          createNewPublication(){
            this.errors = {
              doi: null,
              general: null,
              pmid: null
            };
            this.newPublication = {
              doi: "",
              title: "",
              journal: "",
              year: "",
              authors: "",
              pubmed_id: ""
            };
            this.openEditor = true;
          }
        }
    }
</script>

<style scoped>
</style>
