<template>
  <v-container id="editPublications" class="standard" fluid>
    <v-card id="editPublications">
      <v-card-title class="bg-grey-lighten-4 text-blue">
        Add/Remove Publications
      </v-card-title>
      <Alerts target="publications" />
      <v-card-text>
        <v-container class="pb-0" fluid>
          <v-row>
            <v-col
              v-for="(publication, pubIndex) in publications"
              :key="'selected_' + pubIndex"
              class="col-3"
              cols="12"
              lg="4"
              md="6"
              sm="12"
              xl="3"
              xs="12"
            >
              <v-card class="d-flex flex-column" height="100%">
                <v-card-title
                  :class="{
                    'bg-grey': !publication.isCitation,
                    'bg-green': publication.isCitation,
                  }"
                  class="text-white"
                >
                  Publication
                  <span v-if="publication.doi" class="ml-2">
                    - {{ publication.doi }}</span
                  >
                </v-card-title>
                <v-card-text
                  :class="{
                    'bg-grey-lighten-3': !publication.isCitation,
                    'bg-green-lighten-3': publication.isCitation,
                  }"
                  class="pt-4 pb-0"
                  style="flex-grow: 1"
                >
                  <div><b>TITLE:</b> {{ publication.title }}</div>
                  <div>
                    <b>PUBLISHED IN:</b> {{ publication.journal }},
                    {{ publication.year }}
                  </div>
                  <div><b>AUTHORS:</b> {{ publication.authors }}</div>
                  <v-switch
                    :model-value="publication.isCitation"
                    color="green"
                    label="Cite record using this publication?"
                    @update:model-value="toggleCitation(pubIndex)"
                  />
                </v-card-text>
                <v-card-actions
                  :class="{
                    'grey-lighten-3': !publication.isCitation,
                    'green-lighten-3': publication.isCitation,
                  }"
                >
                  <v-spacer />
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-btn
                        v-if="user().is_curator"
                        class="bg-green text-white mr-2"
                        icon
                        size="small"
                        v-bind="props"
                        @click="editPublication(publication, pubIndex)"
                      >
                        <v-icon size="small"> fas fa-pen</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit this publication</span>
                  </v-tooltip>
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <v-btn
                        class="bg-red text-white"
                        icon
                        size="small"
                        v-bind="props"
                        @click="removePublication(pubIndex)"
                      >
                        <v-icon size="small"> fas fa-trash</v-icon>
                      </v-btn>
                    </template>
                    <span>Remove this publication</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-divider />
          <v-row>
            <v-col class="col-12">
              <v-alert
                closable
                close-icon="fas fa-solid fa-circle-xmark"
                icon="fas fa-info-circle"
                type="info"
                width="100%"
              >
                Please use the search bar below to check if we already have your
                publication in FAIRsharing. If not, you can add it using the
                buttons below.
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
        <v-row>
          <v-col class="col-12 ml-4 mr-3">
            <v-text-field
              v-model="search"
              append-inner-icon="fas fa-search"
              clearable
              color="primary"
              hide-details
              label="Search existing publications"
              variant="outlined"
            />
            <v-data-table
              v-model="publications"
              :headers="headers"
              :items="availablePublications"
              :items-per-page="9"
              :loading="loading"
              :search="search"
              class="elevation-1"
              item-key="title"
              return-object
              show-select
            />

            <div class="noPublications">
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon class="d-inline-block mr-2" v-bind="props">
                    fas fa-question-circle
                  </v-icon>
                </template>
                Please ensure that you enter a doi above in a prefix/suffix
                format, e.g. 10.25504/FAIRsharing.2abjs5, before clicking the
                DOI import button.
              </v-tooltip>
              <v-btn
                :loading="doiLoader"
                class="bg-green text-white my-3"
                @click="getDOI()"
              >
                Import from DOI / Zenodo
              </v-btn>
              <v-btn
                :loading="loadingPub"
                class="bg-green text-white my-3 ml-3"
                @click="getPMID()"
              >
                Import from PUBMED ID
              </v-btn>
              <v-btn
                class="bg-green text-white my-3 ml-3"
                @click="createNewPublication()"
              >
                Create new publication
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-alert v-if="errors.doi" type="error"> DOI not found !</v-alert>
        <v-alert v-if="errors.pmid" type="error">
          PubMed ID not found !
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :loading="continueLoader"
          class="bg-primary"
          variant="elevated"
          @click="saveRecord(false, $event.target)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :loading="exitLoader"
          class="bg-primary"
          variant="elevated"
          @click="saveRecord(true, $event.target)"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
      <v-dialog
        :model-value="openEditor"
        class="pa-0"
        max-width="1000px"
        no-click-animation
        persistent
      >
        <v-container class="py-0" fluid>
          <v-form
            id="editPublication"
            ref="editPublication"
            v-model="subFormValid"
            width="1000"
          >
            <v-card>
              <v-card-title class="bg-green text-white">
                Create/Edit a new publication
              </v-card-title>
              <v-card-text v-if="errors.general" class="pt-3 mb-0 pb-0">
                <v-alert type="error">
                  {{ errors.general.response.data }}
                </v-alert>
              </v-card-text>
              <v-card-text v-else class="pt-0 mt-0">
                <v-container fluid>
                  <v-row>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newPublication.doi"
                        label="DOI"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newPublication.pubmed_id"
                        label="PubMed ID"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="col-12">
                      <v-text-field
                        v-model="newPublication.title"
                        :rules="[rules.isRequired()]"
                        label="Title"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="col-4">
                      <v-text-field
                        v-model="newPublication.authors"
                        :rules="[rules.isRequired()]"
                        label="Authors"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col class="col-4">
                      <v-text-field
                        v-model="newPublication.journal"
                        :rules="[rules.isRequired()]"
                        label="Journal"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col class="col-4">
                      <v-text-field
                        v-model="newPublication.year"
                        :rules="[rules.isRequired()]"
                        label="Publication Year"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="col-12">
                      <v-text-field
                        v-model="newPublication.url"
                        :rules="[rules.isRequired()]"
                        label="URL"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!subFormValid"
                  class="bg-green text-white"
                  @click="addPublication()"
                >
                  Edit or add a new publication
                </v-btn>
                <v-btn class="bg-red text-white" @click="openEditor = false">
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-container>
      </v-dialog>
    </v-card>
    <v-dialog v-model="showEmptySearch" width="auto">
      <v-card>
        <v-card-title> Search Term Missing</v-card-title>
        <v-card-text>
          Please paste or type a value (e.g. a DOI or Pubmed ID) into the search
          box above.
        </v-card-text>
        <v-card-actions class="mx-auto full-width" style="max-width: 250px">
          <v-btn
            block
            color="primary"
            variant="elevated"
            @click="showEmptySearch = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { isEqual } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

import Alerts from "@/components/Editor/Alerts";
import PublicationClient from "@/lib/Client/ExternalClients.js";
import RestClient from "@/lib/Client/RESTClient.js";
import { isRequired } from "@/utils/rules.js";

const pubClient = new PublicationClient();
const restClient = new RestClient();

export default {
  name: "EditPublications",
  components: { Alerts },
  data() {
    return {
      headers: [
        {
          title: "Title",
          value: "title",
        },
        {
          title: "DOI",
          value: "doi",
        },
        {
          title: "Pubmed ID",
          value: "pubmedId",
        },
        {
          title: "Authors",
          value: "authors",
        },
        {
          title: "Journal",
          value: "journal",
        },
        {
          title: "Url",
          value: "url",
        },
        {
          title: "Year",
          value: "year",
        },
      ],
      search: null,
      loading: false,
      exitLoader: false,
      continueLoader: false,
      newPublication: {},
      errors: {
        doi: null,
        general: null,
        pmid: null,
      },
      loadingPub: false,
      openEditor: false,
      currentPublicationIndex: false,
      citations_ids: [],
      initialized: false,
      subFormValid: false,
      rules: {
        isRequired: function () {
          return isRequired();
        },
      },
      showEmptySearch: false,
      doiLoader: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("record", ["getSection", "getChanges"]),
    ...mapState("editor", ["availablePublications"]),
    section() {
      return this.getSection("publications");
    },
    message() {
      let error = this.getSection("publications").error;
      return {
        error: error,
        value: this.getSection("publications").message,
        type: function () {
          if (error) {
            return "error";
          } else {
            return "success";
          }
        },
      };
    },
    publications: {
      get() {
        return this.getSection("publications").data;
      },
      set(newValue) {
        this.$store.commit("record/setPublications", newValue);
      },
    },
    metadata() {
      return this.getSection("generalInformation").data.metadata;
    },
  },
  watch: {
    publications: {
      deep: true,
      handler() {
        let _module = this;
        if (_module.initialized) {
          let changes = 0;
          let initialPublications = this.getSection("publications").initialData;
          // DELETE
          initialPublications.forEach((pub) => {
            let isFound = this.publications.filter(
              (obj) => obj.id === pub.id,
            )[0];
            if (!isFound) {
              changes += 1;
            }
          });
          // UPDATE//ADD
          this.publications.forEach((pub) => {
            let isFound = initialPublications.filter(
              (obj) => obj.id === pub.id,
            )[0];
            if (!isFound) {
              changes += 1;
            } else {
              let copy = JSON.parse(JSON.stringify(pub));
              if (copy.tablePosition > -1) delete copy.tablePosition;
              if (!isEqual(isFound, copy)) changes += 1;
            }
          });
          this.$store.commit("record/setChanges", {
            section: "publications",
            value: changes,
          });
        }
      },
    },
    openEditor: function () {
      this.$nextTick(() => {
        this.$refs["editPublication"].validate();
      });
    },
  },
  mounted() {
    this.$nextTick(async function () {
      this.loading = true;
      this.initialized = false;
      await this.getAvailablePublications(this.publications);
      this.loading = false;
      this.initialized = true;
    });
  },
  methods: {
    ...mapActions("record", ["updatePublications"]),
    ...mapActions("editor", ["getAvailablePublications"]),
    toggleCitation(index) {
      let pub = this.publications[index];
      pub.isCitation = !pub.isCitation;
      this.publications.index = pub;
    },
    async getDOI() {
      if (!this.search) {
        this.showEmptySearch = true;
        return;
      }
      this.doiLoader = true;
      this.currentPublicationIndex = false;
      this.errors = {
        doi: null,
        general: null,
        pmid: null,
      };
      let doi = (" " + this.search).slice(1).trim(); // make a copy of the string and trim it
      let data = await pubClient.getDOI(doi);
      if (data.error) {
        let data = await restClient.getZenodoSearch(
          doi,
          this.user().credentials.token,
        );
        if (data.message || (Array.isArray(data) && data.length == 0)) {
          this.errors.doi = true;
        } else {
          let dataPublication;
          if (Array.isArray(data)) {
            dataPublication = data[0];
          } else {
            dataPublication = data;
          }
          if (dataPublication.metadata !== undefined) {
            if (
              dataPublication.metadata.upload_type === "publication" ||
              (dataPublication.metadata.resource_type &&
                dataPublication.metadata.resource_type.type &&
                dataPublication.metadata.resource_type.type === "publication")
            ) {
              this.newPublication = {
                journal: null,
                doi: null,
                title: null,
                url: null,
                year: null,
                authors: null,
              };
              if (dataPublication.metadata.journal_title) {
                this.newPublication.journal =
                  dataPublication.metadata.journal_title;
              } else {
                if (dataPublication.metadata.meeting) {
                  this.newPublication.journal =
                    dataPublication.metadata.meeting.title;
                }
              }
              this.newPublication.doi = dataPublication.doi;
              this.newPublication.title = dataPublication.metadata.title;
              this.newPublication.url = dataPublication.links.doi;
              this.newPublication.year = Number(
                dataPublication.metadata.publication_date.split("-")[0],
              );
              let authors = [];
              dataPublication.metadata.creators.forEach(function (a) {
                authors.push(a.name + "; ");
              });
              this.newPublication.authors = authors.join("");
              this.newPublication.isCitation = false;
              this.openEditor = true;
            } else {
              this.errors.doi = true;
            }
          } else {
            // TODO: Add a query to osf.io here:
            // TODO: https://developer.osf.io/
            this.errors.doi = true;
          }
        }
      } else {
        /* istanbul ignore next */
        this.newPublication.journal =
          data["container-title-short"] || data["container-title"];
        this.newPublication.doi = data["DOI"];
        this.newPublication.title = data.title;
        this.newPublication.url = data["URL"];
        if (data["created"]) {
          let dateParts;
          if (data["published-print"]) {
            dateParts = data["published-print"]["date-parts"][0].toString();
          } else {
            dateParts = data["created"]["date-parts"][0].toString();
          }
          this.newPublication.year = Number(dateParts.split(",")[0]);
        }
        let authors = [];
        data.author.forEach(function (a) {
          authors.push(a.family + ", " + a.given + "; ");
        });
        this.newPublication.authors = authors.join("");
        this.newPublication.isCitation = false;
        this.openEditor = true;
      }
      this.doiLoader = false;
    },
    async getPMID() {
      if (!this.search) {
        this.showEmptySearch = true;
        return;
      }
      this.currentPublicationIndex = false;
      this.loadingPub = true;
      this.errors = {
        doi: null,
        general: null,
        pmid: null,
      };
      let id = (" " + this.search).slice(1).trim(); // make a copy of the string and trim it
      let data = await pubClient.getPMID(id);
      if (data.error || data.result[id].error) {
        this.errors.pmid = true;
      } else {
        const pub = data.result[id];
        let pubDate = new Date(pub["sortpubdate"]);
        let doi = this.processIDs(pub["elocationid"]);
        this.newPublication = {
          title: pub.title,
          journal: pub["fulljournalname"],
          year: pubDate.getFullYear(),
          authors: pub["authors"]
            .map(function (elem) {
              return elem.name;
            })
            .join(", "),
          pubmed_id: pub["uid"],
          url: "https://pubmed.ncbi.nlm.nih.gov/" + id,
        };
        if (doi) {
          this.newPublication.doi = doi;
          this.newPublication.url = "https://doi.org/" + doi;
        }
        this.newPublication.isCitation = false;
        this.openEditor = true;
      }
      this.loadingPub = false;
    },
    processIDs(idsString) {
      let doi = null;
      if (idsString) {
        let IDsArray = idsString.split(". ");
        IDsArray.forEach((IDString) => {
          let IDArray = IDString.split(": ");
          if (IDArray[0] === "doi") {
            doi = IDArray[1];
          }
        });
      }
      return doi;
    },
    async addPublication() {
      const _module = this;
      let newPub = JSON.parse(JSON.stringify(_module.newPublication));

      // PUT/UPDATE
      if (_module.currentPublicationIndex !== false) {
        let editedPublication = await restClient.editPublication(
          newPub,
          _module.user().credentials.token,
        );
        if (editedPublication.error) {
          _module.errors.general = editedPublication.error;
        } else {
          editedPublication.isCitation = newPub.isCitation;
          //Commenting below code as it is causing the issue of undefined tablePosition
          // delete this.availablePublications[newPub.tablePosition];

          //Delete the old publication from the availablePublications array before adding the new one
          let editedPublicationIndex = this.availablePublications.findIndex(
            (e) => e.title === editedPublication.title,
          );
          if (editedPublicationIndex !== -1) {
            this.availablePublications.splice(editedPublicationIndex, 1);
          }
          editedPublication.tablePosition = this.availablePublications.length;
          this.availablePublications.push(editedPublication);
          this.publications[this.currentPublicationIndex] = editedPublication;
        }
      }

      // POST/CREATE
      else {
        let createdPublication = await restClient.createPublication(
          newPub,
          _module.user().credentials.token,
        );
        if (createdPublication.error) {
          _module.errors.general = createdPublication.error;
        } else {
          this.publications.push(createdPublication);
          createdPublication.tablePosition = this.availablePublications.length;
          this.availablePublications.push(createdPublication);
        }
      }

      if (!_module.errors.general) {
        if (!newPub.doi) {
          _module.search = newPub.title;
        } else {
          _module.search = newPub.doi;
        }
        _module.newPublication = {};
        _module.openEditor = false;
        _module.currentPublicationIndex = false;
      }
    },
    removePublication(pubIndex) {
      this.publications.splice(pubIndex, 1);
    },
    editPublication(publication, publicationIndex) {
      this.currentPublicationIndex = (" " + publicationIndex).slice(1);
      this.openEditor = true;
      this.newPublication = JSON.parse(JSON.stringify(publication));
    },
    async saveRecord(redirect, item) {
      this.openEditor = false; // what's this for?
      if (item.textContent.trim() === "Save and continue") {
        this.continueLoader = true;
        this.exitLoader = false;
      } else if (item.textContent.trim() === "Save and exit") {
        this.continueLoader = false;
        this.exitLoader = true;
      }
      await this.updatePublications({
        token: this.user().credentials.token,
        id: this.$route.params.id,
      });
      this.continueLoader = false;
      this.exitLoader = false;
      this.$store.commit("record/setChanges", {
        section: "publications",
        value: 0,
      });
      if (!redirect) {
        this.$scrollTo("#mainHeader");
      }
      if (redirect && !this.message.error) {
        await this.$router.push({ path: "/" + this.$route.params.id });
      }
    },
    createNewPublication() {
      this.errors = {
        doi: null,
        general: null,
        pmid: null,
      };
      this.newPublication = {
        doi: "",
        title: "",
        journal: "",
        year: "",
        authors: "",
        pubmed_id: "",
        isCitation: false,
      };
      this.openEditor = true;
    },
  },
};
</script>
