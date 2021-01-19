<template xmlns:v-sl ot="http://www.w3.org/1999/XSL/Transform">
  <v-card id="editPublications">
    <v-card-title class="grey lighten-4 blue--text">
      <v-btn
        class="blue mr-4"
        fab
        x-small
      >
        <v-icon
          class="white--text"
          small
        >
          fa fa-info
        </v-icon>
      </v-btn>
      <b> EDIT PUBLICATIONS </b>
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
            type="info"
            dismissible
          >
            <b>Note:</b> Only curators can edit saved publications. Please contact us if you have an issue.
          </v-alert>
        </v-row>
        <v-row>
          <v-col
            v-for="(publication, pubIndex) in publications"
            :key="'selected_' + pubIndex"
            class="col-3"
          >
            <v-card
              height="100%"
              class="flexCard"
            >
              <v-card-title
                class="white--text"
                :class="{'grey': !publication.isCitation, 'green': publication.isCitation}"
              >
                Publication <span
                  v-if="publication.doi"
                  class="ml-2"
                > - {{ publication.doi }}</span>
              </v-card-title>
              <v-card-text
                :class="{'grey lighten-3': !publication.isCitation, 'green lighten-3': publication.isCitation}"
                class="pt-4 pb-0"
                style="flex-grow: 1;"
              >
                <div> <b>TITLE:</b> {{ publication.title }}</div>
                <div> <b>PUBLISHED IN:</b> {{ publication.journal }}, {{ publication.year }}</div>
                <div> <b>AUTHORS:</b> {{ publication.authors }}</div>
                <v-switch
                  :input-value="publication.isCitation"
                  @change="toggleCitation(pubIndex)"
                  color="green"
                  label="Cite record using this publication?"
                />
              </v-card-text>
              <v-card-actions :class="{'grey lighten-3': !publication.isCitation, 'green lighten-3': publication.isCitation}">
                <v-spacer />
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="user().is_curator"
                      v-bind="attrs"
                      class="green white--text mr-2"
                      icon
                      v-on="on"
                      @click="editPublication(publication, pubIndex)"
                    >
                      <v-icon small>
                        fas fa-pen
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Edit this publication</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      class="red white--text"
                      icon
                      v-on="on"
                      @click="removePublication(pubIndex)"
                    >
                      <v-icon small>
                        fa-trash
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Remove this publication</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <v-text-field
        v-model="search"
        append-icon="fa-search"
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
          :loading="loading"
          @click="saveRecord(false)"
      >
        Save and continue
      </v-btn>
      <v-btn
          :loading="loading"
          class="primary"
          @click="saveRecord(true)"
      >
        Save and exit
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
                  <v-col class="col-12">
                    <v-switch
                      v-model="newPublication.isCitation"
                      color="primary"
                      label="Do you want to cite this record using this publication?"
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
    import { mapState, mapActions, mapGetters } from "vuex"
    import { parseBibFile } from "bibtex";
    import PublicationClient from "@/components/Client/ExternalClients.js"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import RestClient from "@/components/Client/RESTClient.js"
    import publicationsQuery from "@/components/GraphClient/queries/getPublications.json"

    const graphClient = new GraphClient();
    const pubClient = new PublicationClient();
    const restClient = new RestClient();

    export default {
        name: "EditPublications",
        data(){
          return {
            availablePublications: [],
            headers: [
              {
                text: "title",
                value: "title"
              },
              {
                text: "DOI",
                value: "doi"
              },
              {
                text: "Pubmed ID",
                value: "pubmedId"
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
            loading: false,
            newPublication: {},
            errors: {
              doi: null,
              general: null,
              pmid: null
            },
            openEditor: false,
            currentPublicationIndex: false,
            citations_ids: [],
            initialized: false,
            initialFields: []
          }
        },
        computed: {
          // TODO: Remove
          //...mapState('record', ['currentRecord', 'recordUpdate']),
          ...mapState('users', ['user']),
          ...mapGetters("record", ["citations", "getSection", "getChanges", "currentRecord"]),
          section(){
            return this.getSection('publications');
          },
          message(){
            let error = this.getSection("publications").error;
            return {
              error: error,
              value: this.getSection("publications").message,
              type: function(){if (error){return "error"} else {return "success"}}
            };
          },
          publications: {
            get() { return this.getSection("publications").data; },
            set(newValue) {
              this.$store.commit('record/setPublications', newValue);
            }
          },
          metadata() {
            return this.getSection("generalInformation").data.metadata
          }

        },
        watch: {
          publications: {
            deep: true,
            handler(newVal){
              let _module = this;
              if (_module.initialized){
                let updated = _module.checkChanges(newVal);
                /*
                 *  This function deals with seeing what elelemts have been added.
                 */
                let then = _module.initialFields.map(e => e[0])
                let now = updated.map(e => e[0])
                let changes = then
                    .filter(x => !now.includes(x))
                    .concat(now.filter(x => !then.includes(x))).length;

                /*
                 * This function compares to see which have changed, i.e. isCitation has been
                 * toggled.
                 */
                updated.forEach((obj) => {
                  let orig = _module.initialFields.find(e => e[0] === obj[0]);
                  if (orig) {
                    if (orig[1] !== obj[1]) {
                      changes += 1;
                    }
                  }
                });
                this.$store.commit("record/setChanges", {
                  section: "publications",
                  value: changes
                })
              }
            }
          }
        },
        mounted(){
          this.$nextTick(async function () {
            const _module = this;
            _module.initialized = false;

            // get available publications from the DB.
            let pub = await graphClient.executeQuery(publicationsQuery);
            let position = 0;
            pub['searchPublications'].forEach(function(pub){
                pub.isCitation = false;
                _module.publications.forEach(function(publication){
                  if (pub.id === publication.id){
                    publication.tablePosition = position;
                    pub.tablePosition = position;
                  }
                });
              _module.availablePublications.push(pub);
              position += 1;
            });
            _module.initialFields = _module.checkChanges(JSON.parse(JSON.stringify(_module.publications)));
            // neutralize loading.
            _module.loading = false;
            _module.initialized = true;
          });
        },
        methods: {
          ...mapActions("record", ["updatePublications"]),
          checkChanges(data) {
            let summary = [];
            data.forEach((d) => {
              summary.push([d['id'], d['isCitation']]);
            });
            return summary;
          },
          toggleCitation(index) {
            let pub = this.publications[index];
            pub.isCitation = !pub.isCitation;
            this.$set(this.publications, index, pub);
          },
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
                let title = "";
                publication.getField('title').data.forEach(function(titleComponent){
                  if (typeof titleComponent !== "object" ){
                    title += titleComponent
                  }
                  else {
                    let subTitle = "";
                    titleComponent.data.forEach(function (subTitleComponent) {
                      subTitle += subTitleComponent;
                    });
                    title += subTitle;
                  }
                });
                this.newPublication.authors = publication.getField('author').data.join('');
                this.newPublication.doi = publication.getField('doi').data.join('');
                this.newPublication.title = title;
                this.newPublication.journal = publication.getField('journal').data.join('');
                this.newPublication.url = decodeURIComponent(publication.getField('url').data.join(''));
                this.newPublication.year = publication.getField('year');
                this.newPublication.isCitation = false;
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
                let pubDate = new Date(pub['sortpubdate']);
                let doi = this.processIDs(pub['elocationid']);
                this.newPublication = {
                  title: pub.title,
                  journal: pub['fulljournalname'],
                  year: pubDate.getFullYear(),
                  authors: pub['authors'].map(function(elem){return elem.name;}).join(", "),
                  pubmed_id: pub['uid'],
                  url: "https://pubmed.ncbi.nlm.nih.gov/" + id
                };
                if (doi) {
                  this.newPublication.doi = doi;
                  this.newPublication.url = "https://doi.org/" + doi;
                }
                this.newPublication.isCitation = false;
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
          async addPublication(){
            const _module = this;
            let newPub = JSON.parse(JSON.stringify(_module.newPublication));

            // PUT/UPDATE
            if (_module.currentPublicationIndex !== false){
              let editedPublication = await restClient.editPublication(newPub, _module.user().credentials.token);
              if (editedPublication.error){
                _module.errors.general = editedPublication.error;
              }
              else {
                editedPublication.isCitation = newPub.isCitation;
                delete this.availablePublications[newPub.tablePosition];
                editedPublication.tablePosition = this.availablePublications.length;
                this.availablePublications.push(editedPublication);
                this.publications[this.currentPublicationIndex] = editedPublication;
              }
            }

            // POST/CREATE
            else {
              let createdPublication = await restClient.createPublication(newPub, _module.user().credentials.token);
              if (createdPublication.error) {
                _module.errors.general = createdPublication.error;
              }
              else {
                this.publications.push(createdPublication);
                createdPublication.tablePosition = this.availablePublications.length;
                this.availablePublications.push(createdPublication);
              }
            }

            if (!newPub.doi){
              _module.search = newPub.title;
            }
            else {
              _module.search = newPub.doi;
            }

            _module.newPublication = {};
            _module.openEditor = false;
            _module.currentPublicationIndex = false;
          },
          removePublication(pubIndex){
            this.publications.splice(pubIndex, 1);
          },
          editPublication(publication, publicationIndex){
            this.currentPublicationIndex = (' ' + publicationIndex).slice(1);
            this.openEditor = true;
            this.newPublication = JSON.parse(JSON.stringify(publication));
          },
          async saveRecord(redirect){
            this.openEditor = false; // what's this for?
            this.loading = true;
            await this.updatePublications({
              token: this.user().credentials.token,
              id: this.$route.params.id
            });
            this.loading = false;
            if (!redirect) {
              this.$scrollTo("#mainHeader");
              // Clear the changes tracking in case a user edits further before saving again.
              this.initialFields = this.checkChanges(JSON.parse(JSON.stringify(this.publications)));
              this.$store.commit("record/setChanges", {
                section: "publications",
                value: 0
              })
            }
            if (redirect && !this.message.error){
              await this.$router.push({path: '/' + this.$route.params.id})
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
              pubmed_id: "",
              isCitation: false
            };
            this.openEditor = true;
          }
        }
    }
</script>

<style scoped>
  .flexCard {
    display:flex;
    flex-direction: column;
  }
</style>
