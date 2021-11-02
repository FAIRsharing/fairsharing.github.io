<template>
  <main>
    <v-container
      fluid
      class="py-0 mb-10"
    >
      <NotFound v-if="error" />
      <v-row
        v-else
        no-gutters
      >
        <v-col
          id="ontologyBrowser"
          xs="12"
          sm="12"
          md="12"
          lg="4"
          xl="3"
          col="12"
          class="border-right"
        >
          <div
            v-if="tree.length > 0"
            id="searchOntology"
            class="pr-2"
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
          lg="8"
          xl="9"
          col="12"
          class="py-0 my-0"
        >
          <div v-if="!loadingData && tree.length > 0">
            <TermDetails
              v-if="records && selectedTerm"
              :selected-ontology="selectedOntology"
            />
            <v-card
              v-else
              class="pa-0"
              flat
            >
              <v-card-text class="pa-0">
                <OntologySunburst />
              </v-card-text>
            </v-card>
          </div>
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
import TermDetails from "@/components/Ontologies/TermDetails"
import OntologySunburst from "@/components/Ontologies/OntologySunburst"

export default {
  name: "OntologyBrowser",
  components: {Loaders, NotFound, TermDetails, OntologySunburst},
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
  destroyed() { this.leavePage() },
  methods: {
    searchTerm(term){
      this.resetPagination()
      if (this.activeTerms.includes(term.identifier)) this.$router.push({path: this.$route.path})
      else this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(term.name)}})
    },
    ...mapActions("ontologyBrowser", [
      "fetchTerms",
      "fetchRecords",
      "resetPagination",
      "activateTerms",
      "openTerms",
      "leavePage"
    ]),
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
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

#ontologyBrowser, #termDisplay {
  display: flex;
  flex-direction: column;
}

.tree {
  overflow-y: scroll;
  flex-grow: 1;
  height: 70vh;
}

@media (max-width: 1263px) {
  #ontologyBrowser {
    height: auto;
  }
  .tree {
    max-height: 40vh;
    border-bottom: 1px solid #ccc;
  }
}

.col {
  flex-basis: initial !important;
}

.cursor-pointer {
  cursor: pointer !important;
}

</style>
