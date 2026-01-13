<template>
  <main>
    <v-container class="py-0 mb-10" fluid>
      <NotFound v-if="error" />
      <v-row v-else no-gutters>
        <v-col
          id="ontologyBrowser"
          class="border-e"
          cols="12"
          lg="4"
          md="12"
          sm="12"
          xl="3"
          xs="12"
        >
          <div v-if="tree.length > 0" id="searchOntology" class="pr-2 mt-6">
            <v-autocomplete
              v-model="search"
              :color="color"
              :items="flattenedTree"
              :label="`Search ${selectedOntology}s`"
              clearable
              hide-details
              item-title="name"
              variant="outlined"
            />
            <v-divider class="mb-2 opacity-100" />
          </div>
          <v-treeview
            v-model:opened="open"
            :color="color"
            :items="tree"
            :search="search"
            activatable
            class="tree pb-3 px-3"
            item-title="name"
            item-value="name_identifier"
          >
            <template #prepend="{ item }">
              <!-- If no children, add a spacer to maintain alignment -->
              <v-list-item-action
                v-if="!item.children || !item.children.length"
              >
                <div class="noArrow"></div>
              </v-list-item-action>
            </template>
            <template #title="{ item }">
              <!-- Check if the item has children -->
              <div
                class="d-flex flex-row justify-center align-center cursor-pointer"
                @click="searchTerm(item)"
              >
                <v-chip
                  :class="
                    !activeTerms.includes((item.raw || item).identifier)
                      ? `text-${color} border-${color}`
                      : `bg-${color} text-white`
                  "
                  :variant="
                    !activeTerms.includes((item.raw || item).identifier)
                      ? 'outlined'
                      : 'flat'
                  "
                  class="cursor-pointer rounded-xl"
                  label
                >
                  {{ (item.raw || item).name }}
                </v-chip>
                <v-spacer />
                <div
                  :class="
                    activeTerms.includes((item.raw || item).identifier)
                      ? `bg-${color} text-white`
                      : `bg-white text-${color} border-${color} border border-solid border-opacity-100`
                  "
                  class="d-flex justify-center align-center hits"
                >
                  {{
                    (item.raw || item).records_count
                      ? (item.raw || item).records_count
                      : 0
                  }}
                </div>
              </div>
            </template>
          </v-treeview>
        </v-col>
        <v-col
          id="termDisplay"
          class="py-0 my-0"
          cols="12"
          lg="8"
          md="12"
          sm="12"
          xl="9"
          xs="12"
        >
          <div v-if="!loadingData && tree.length > 0">
            <TermDetails
              v-if="records && selectedTerm"
              :selected-ontology="selectedOntology"
            />
            <v-card v-else class="pa-0" flat>
              <v-card-text class="pa-0">
                <OntologySunburst />
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-fade-transition>
      <div>
        <v-overlay
          v-model="loadingData"
          :absolute="false"
          class="align-center justify-center"
          opacity="0.8"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
  </main>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import OntologySunburst from "@/components/Ontologies/OntologySunburst";
import TermDetails from "@/components/Ontologies/TermDetails";
import NotFound from "@/views/Errors/404";

export default {
  name: "OntologyBrowser",
  components: { Loaders, NotFound, TermDetails, OntologySunburst },
  data() {
    return {
      allowedOntologies: ["domain", "subject"],
      search: null,
    };
  },
  computed: {
    selectedOntology() {
      return this.$route.params.id;
    },
    error() {
      return !this.allowedOntologies.includes(this.selectedOntology);
    },
    color() {
      return this.colors[this.selectedOntology];
    },
    term() {
      return this.flattenedTree.find((currentNode) => {
        if (this.$route.query["term"]) {
          return (
            currentNode.name.toLowerCase() ===
            decodeURIComponent(this.$route.query["term"]).toLowerCase()
          );
        }
      });
    },
    open: {
      get() {
        return this.openedTerms;
      },
      set(val) {
        this.openTerms(val);
      },
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
      "openedTerms",
    ]),
  },
  watch: {
    async term(newVal) {
      /* istanbul ignore else */
      if (newVal) {
        let parents = [...new Set(this.getAncestors()(newVal.identifier))];
        await this.activateTerms(newVal);
        this.open = parents;
      } else await this.activateTerms();
    },
    search(newTerm) {
      this.openTerms(this.getAncestors()(newTerm, "id", "name"));
    },
  },
  async mounted() {
    await this.fetchTerms();
  },
  unmounted() {
    this.leavePage();
  },
  methods: {
    searchTerm(term) {
      this.resetPagination();
      if (this.activeTerms.includes(term.identifier))
        this.$router.push({ path: this.$route.path });
      else
        this.$router.push({
          path: this.$route.path,
          query: { term: encodeURIComponent(term.name) },
        });
    },
    ...mapActions("ontologyBrowser", [
      "fetchTerms",
      "fetchRecords",
      "resetPagination",
      "activateTerms",
      "openTerms",
      "leavePage",
    ]),
    ...mapGetters("ontologyBrowser", ["getAncestors"]),
  },
};
</script>

<style lang="scss" scoped>
.subject_color--border {
  border: 1px solid;
  border-color: #e67e22 !important;
}

.domain_color--border {
  border: 1px solid;
  border-color: #712727 !important;
}

.hits {
  width: 45px;
  height: 45px;
  border-radius: 50%;
}

#ontologyBrowser,
#termDisplay {
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

//Hide the list arrow if that item has no children using child class 'noArrow' and targeting the parent class
:deep(.v-list-item__prepend) {
  &:has(.noArrow) {
    visibility: hidden;
  }
}
</style>
