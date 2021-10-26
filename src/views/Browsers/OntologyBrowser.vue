<template>
  <main>
    <v-container fluid>
      <NotFound v-if="error" />
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-text class="pa-0 ma-0">
              <v-container
                fluid
                class="pa-0 ma-0"
              >
                <v-row no-gutters>
                  <v-col
                    xs="12"
                    sm="12"
                    md="12"
                    lg="5"
                    xl="3"
                    col="12"
                    class="border-right"
                  >
                    <div
                      v-if="tree.length > 0"
                      id="searchOntology"
                      class="px-2 mt-2"
                    >
                      <v-autocomplete
                        v-model="search"
                        :items="flattenedTree"
                        :label="`Search ${selectedOntology}s`"
                        outlined
                        hide-details
                        :color="color"
                        item-text="name"
                        clearable
                      />
                      <v-divider class="mb-2" />
                    </div>
                    <v-treeview
                      :items="tree"
                      :color="color"
                      :search="search"
                      :open.sync="open"
                      class="tree pb-3 px-3"
                      hoverable
                    >
                      <template #label="{ item }">
                        <div
                          class="d-flex flex-row justify-center align-center cursor-pointer"
                          @click="searchTerm(item)"
                        >
                          <v-chip
                            :class="!activeTerms.includes(item.identifier) ? `white ${color}--text ${color}--border` : `${color} white--text`"
                            class="cursor-pointer"
                          >
                            {{ item.name }}
                          </v-chip>
                          <v-spacer />
                          <div
                            :class="activeTerms.includes(item.identifier) ? `white ${color}--text ${color}--border` : `${color} white--text`"
                            class="d-flex justify-center align-center hits"
                          >
                            {{ item.records_count ? item.records_count : 0 }}
                          </div>
                        </div>
                      </template>
                    </v-treeview>
                  </v-col>
                  <v-col
                    id="termDisplay"
                    xs="12"
                    sm="12"
                    md="12"
                    lg="7"
                    xl="9"
                    col="12"
                    class="py-0 my-0"
                  >
                    <div v-if="!loadingData && tree.length > 0">
                      <v-card
                        v-if="selectedTerm"
                        class="pa-5"
                        flat
                      >
                        <v-card-title
                          class="justify-center"
                          :class="$vuetify.breakpoint.smAndDown ? `d-grid` : `d-flex`"
                        >
                          <v-chip
                            class="white--text text-h4 largeChips mb-2"
                            :class="color"
                          >
                            {{ selectedTerm.name }}
                          </v-chip>
                          <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
                          <br v-else>
                          <div
                            :class="`${color} white--text`"
                            class="d-flex justify-center align-center hits largeHits"
                          >
                            {{ selectedTerm.records_count ? selectedTerm.records_count : 0 }}
                          </div>
                        </v-card-title>
                        <v-card-text>
                          {{ selectedTerm.description }}
                          It contains {{ selectedTerm.descendants_count }} descendants terms.
                          <div
                            v-if="ancestors.length > 0"
                            class="mt-3"
                          >
                            <b class="text-decoration-underline">Ancestors:</b> <br>
                            <v-chip
                              v-for="(ancestor, ancestorKey) in ancestors"
                              :key="'ancestor_' + ancestorKey"
                              :class="`${color}--text ${color}--border`"
                              class="white mr-2 mt-1"
                              @click="goToTerm(ancestor)"
                            >
                              {{ ancestor }}
                            </v-chip>
                          </div>
                        </v-card-text>
                        <v-divider />
                        <v-card-text>
                          <h4 :class="`${color}--text mb-4 text-decoration-underline text-h4`">
                            Records with this {{ selectedOntology }}:
                          </h4>
                          <BrowserDisplay
                            v-if="records"
                            :selected-ontology="selectedOntology"
                          />
                        </v-card-text>
                      </v-card>
                      <v-card
                        v-else
                        class="pa-0"
                        flat
                      >
                        <v-card-text class="pa-0">
                          <OntologyStats />
                        </v-card-text>
                      </v-card>
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-fade-transition>
      <v-overlay
        v-if="loadingData"
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
  </main>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import NotFound from "@/views/Errors/404";
import Loaders from "@/components/Navigation/Loaders";
import BrowserDisplay from "@/components/Ontologies/BrowserDisplay"
import OntologyStats from "@/components/Ontologies/OntologyStats"

export default {
  name: "OntologyBrowser",
  components: {Loaders, NotFound, BrowserDisplay, OntologyStats},
  data(){
    return {
      allowedOntologies: ['domain', 'subject'],
      search: null
    }
  },
  computed: {
    selectedOntology () { return this.$route.params.id },
    error () { return !this.allowedOntologies.includes(this.selectedOntology) },
    color () { return this.colors[this.selectedOntology] },
    term () {
      return this.flattenedTree.find((currentNode) => {
        if (this.$route.query['term']) {
          let term = decodeURIComponent(this.$route.query['term']) || null
          if (term) return currentNode.name.toLowerCase() === term.toLowerCase()
        }
      })
    },
    open: {
      get() { return this.openedTerms },
      set(val) { this.openTerms(val) }
    },
    ancestors() { return this.getAncestors()(this.selectedTerm.identifier, 'name') },
    ...mapState("editor", ["colors"]),
    ...mapState("ontologyBrowser", [
      "tree",
      "records",
      "loadingData",
      "flattenedTree",
      "pagination",
      "activeTerms",
      "selectedTerm",
      "openedTerms"
    ]),
  },
  watch: {
    async term(newVal) {
      if (newVal) {
        let parents = [...new Set(this.getAncestors()(newVal.identifier))];
        await this.activateTerms(newVal)
        this.open = parents
      }
      else await this.activateTerms()
    },
    search(newTerm) { this.openTerms(this.getAncestors()(newTerm, "id", "name")) }
  },
  async mounted() { await this.fetchTerms() },
  methods: {
    searchTerm(term){
      this.resetPagination()
      if (this.activeTerms.includes(term.identifier)) this.$router.push({path: this.$route.path})
      else this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(term.name)}})
    },
    goToTerm(term) {
      this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(term)}})
    },
    ...mapActions("ontologyBrowser", ["fetchTerms", "fetchRecords", "resetPagination", "activateTerms", "openTerms"]),
    ...mapGetters("ontologyBrowser", ["getAncestors"])
  },
  metaInfo: {
    meta: [
      { property: 'og:image', content: `${window.location.origin}/assets/openGraph/ontologyBrowser.png` },
      { name: 'description', content: 'Subjects Ontology Browser (SRAO)' },
      { name: 'keywords', content: "SRAO, Subjects, Ontology, Browser, FAIRsharing"},
      { name: 'author', content: 'https://github.com/terazus'}
    ]
  }
}
</script>

<style scoped>
.subject_color--border {
  border: 1px solid ;
  border-color: #E67E22 !important
}

.domain_color--border {
  border: 1px solid ;
  border-color: #712727 !important
}

.hits {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.largeHits {
  width: 70px;
  height: 70px;
  font-size: 22px;
}

.tree {
  overflow-y: scroll;
}

@media (min-width: 1264px) {
  .tree {
    height: 78.8vh;
  }
  .border-right {
    border-right: 1px solid #ccc;
  }
}

@media (max-width: 1263px) {
  .tree {
    max-height: 40vh;
    border-bottom: 1px solid #ccc;
  }
}

.largeChips {
  height: 75px;
  border-radius: 40px;
  padding-left: 40px;
  padding-right: 40px;
}

.col {
  flex-basis: initial !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

</style>
