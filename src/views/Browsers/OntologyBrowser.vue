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
          <!--Replacing v-tree-view with v-virtual-scroll for smooth behavior and performance-->
          <v-virtual-scroll
            :height="'70vh'"
            :items="visibleNodes"
            class="tree pb-3 px-3"
          >
            <template #default="{ item }">
              <div
                :style="{ paddingLeft: `${item.depth * 24}px` }"
                class="d-flex align-center py-1 cursor-pointer hover-bg"
                @click="toggleNode(item)"
              >
                <div class="d-flex justify-center" style="width: 24px">
                  <v-icon
                    v-if="item.hasChildren"
                    :icon="
                      openedTerms.includes(item.identifier)
                        ? 'fas fa-caret-down'
                        : 'fas fa-caret-right'
                    "
                    size="small"
                    @click.stop="toggleNode(item)"
                  />
                </div>

                <div
                  class="d-flex flex-row justify-center align-center flex-grow-1"
                  @click.stop="searchTerm(item)"
                >
                  <span
                    :class="
                      !activeTerms.includes(item.identifier)
                        ? `text-${color} border-${color}`
                        : `bg-${color} text-white`
                    "
                    class="chip-mimic mr-2"
                  >
                    {{ item.name }}
                  </span>

                  <v-spacer />

                  <div
                    :class="
                      activeTerms.includes(item.identifier)
                        ? `bg-${color} text-white`
                        : `bg-white text-${color} border-${color} border border-solid border-opacity-100`
                    "
                    class="hits d-flex justify-center align-center"
                  >
                    {{ item.records_count || 0 }}
                  </div>
                </div>
              </div>
            </template>
          </v-virtual-scroll>
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
    visibleNodes() {
      const result = [];

      // Recursive function to flatten visible parts of tree
      const traverse = (nodes, depth = 0) => {
        for (const node of nodes) {
          // Add basic metadata for the UI
          const hasChildren = node.children && node.children.length > 0;

          result.push({
            ...node, // copy node data
            depth, // add depth for indentation
            hasChildren,
          });

          // Only traverse children if this node's ID is in 'openedTerms'
          if (hasChildren && this.openedTerms.includes(node.identifier)) {
            traverse(node.children, depth + 1);
          }
        }
      };

      traverse(this.tree);
      return result;
    },
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
    toggleNode(item) {
      if (!item.hasChildren) return;

      const isOpen = this.openedTerms.includes(item.identifier);
      let newOpened = [...this.openedTerms];

      if (isOpen) {
        // Close: Remove ID from array
        newOpened = newOpened.filter((id) => id !== item.identifier);
      } else {
        // Open: Add ID to array
        newOpened.push(item.identifier);
      }

      // Sync with your Vuex or local state
      this.openTerms(newOpened);
    },
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

.chip-mimic {
  border: 1px solid;
  border-radius: 18px;
  padding: 4px 12px;
  font-size: 0.9rem;
  line-height: 1.8;
  display: inline-block;
  white-space: nowrap;
}

/* Hover effect for the row */
.hover-bg:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
</style>
