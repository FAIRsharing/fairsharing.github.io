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
              :items="uniqueSearchItems"
              :label="`Search ${selectedOntology}s`"
              clearable
              hide-details
              item-title="name"
              item-value="id"
              return-object
              variant="outlined"
            />
            <v-divider class="mb-2 opacity-100" />
          </div>

          <v-virtual-scroll
            ref="virtualScroll"
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
                >
                  <span
                    :class="[
                      'chip-mimic mr-2',
                      item.isTarget
                        ? `bg-${color} text-white font-weight-bold elevation-2 border-0`
                        : `text-${color} border-${color}`,
                    ]"
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
import { mapActions, mapState } from "vuex";
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
    ...mapState("editor", ["colors"]),
    // We do NOT map activeTerms/openedTerms directly to avoid undefined errors
    ...mapState("ontologyBrowser", [
      "tree",
      "records",
      "loadingData",
      "flattenedTree",
      "pagination",
      "selectedTerm",
    ]),
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
      const qTerm = this.$route.query["term"];
      if (!qTerm) return null;
      return this.flattenedTree.find(
        (node) =>
          node.name.toLowerCase() === decodeURIComponent(qTerm).toLowerCase(),
      );
    },
    // Manual State mapping with Safety Checks
    activeTerms() {
      return this.$store.state.ontologyBrowser.activeTerms || [];
    },
    openedTerms() {
      return this.$store.state.ontologyBrowser.openedTerms || [];
    },

    /**
     * VISIBLE NODES
     * Combines Pruning (Search) + Flattening (Expansion)
     */
    visibleNodes() {
      let sourceTree = this.tree || [];

      // 1. If Searching, use a Pruned Tree (Supports Multiple Instances)
      if (this.search && this.search.identifier) {
        const pruned = this.pruneTreeWithChildren(
          this.tree,
          this.search.identifier,
        );
        if (pruned.length > 0) sourceTree = pruned;
      }

      const result = [];
      const searchId = this.search?.identifier
        ? String(this.search.identifier)
        : null;

      // Safety: Ensure we have an array of Strings for comparison
      const currentOpenTerms = (this.openedTerms || []).map(String);

      const traverse = (nodes, depth = 0) => {
        if (!nodes || nodes.length === 0) return;

        for (const node of nodes) {
          const hasChildren = node.children && node.children.length > 0;
          const strId = String(node.identifier);
          const isTarget = strId === searchId;

          // Check if this node is Open
          const isOpen = currentOpenTerms.includes(strId);

          result.push({
            ...node,
            depth,
            hasChildren,
            isTarget,
          });

          // Expand logic:
          // We only descend if the node has children AND is marked as Open
          if (hasChildren && isOpen) {
            traverse(node.children, depth + 1);
          }
        }
      };

      traverse(sourceTree);
      return result;
    },

    /**
     * UNIQUE SEARCH ITEMS
     * Filters the flattenedTree to ensure each term ID appears only once
     * in the Autocomplete dropdown.
     */
    uniqueSearchItems() {
      const items = this.flattenedTree || [];
      const seen = new Set();

      return items.filter((item) => {
        const id = item.identifier;
        if (seen.has(id)) {
          return false; // Duplicate found, skip it
        }
        seen.add(id);
        return true; // New item, keep it
      });
    },
  },
  watch: {
    // URL Term Watcher
    async term(newVal) {
      if (newVal) {
        await this.activateTerms(newVal);

        // Find ALL paths to this term (in case it exists in multiple places)
        const allPaths = this.findAllPaths(this.tree, newVal.identifier);
        const parentsToOpen = new Set();

        allPaths.forEach((path) => {
          path.forEach((id) => {
            if (String(id) !== String(newVal.identifier)) {
              parentsToOpen.add(String(id));
            }
          });
        });

        this.openTerms(Array.from(parentsToOpen));
      }
      else {
        await this.activateTerms();
      }
    },

    // --- SEARCH WATCHER (Handles Multiple Instances) ---
    search(newTerm) {
      // CASE 1: Search Cleared
      if (!newTerm) {
        // Reset to full tree by clearing the "open" list
        this.openTerms([]);
        return;
      }

      // CASE 2: Active Search
      const targetId = newTerm.identifier || newTerm;
      const strTargetId = String(targetId);

      // 1. Find ALL paths to the target node
      const allPaths = this.findAllPaths(this.tree, targetId);

      // 2. Collect ALL parent IDs from ALL paths
      const allIdsToOpen = new Set();

      allPaths.forEach((path) => {
        path.forEach((id) => {
          // Add ID to open set ONLY if it is NOT the target itself
          // (We want the parents open, but the target closed)
          if (String(id) !== strTargetId) {
            allIdsToOpen.add(String(id));
          }
        });
      });

      // 3. Update Vuex State
      this.openTerms(Array.from(allIdsToOpen));

      // 4. Scroll to FIRST Instance
      setTimeout(() => {
        if (!this.$refs.virtualScroll) return;

        // Find index of the FIRST occurrence in the visible list
        const index = this.visibleNodes.findIndex(
          (x) => String(x.identifier) === strTargetId,
        );

        if (index !== -1) {
          if (this.$refs.virtualScroll.scrollToIndex) {
            this.$refs.virtualScroll.scrollToIndex(index);
          }
          else {
            // Fallback: 50px is the estimated item height
            this.$refs.virtualScroll.$el.scrollTop = index * 50;
          }
        }
      }, 300);
    },
  },
  async mounted() {
    await this.fetchTerms();
  },
  unmounted() {
    this.leavePage();
  },
  methods: {
    ...mapActions("ontologyBrowser", [
      "fetchTerms",
      "fetchRecords",
      "resetPagination",
      "activateTerms",
      "openTerms",
      "leavePage",
    ]),

    // --- UPDATED HELPER: Find ALL Paths ---
    // Returns Array of Arrays: [[Root, Child, Target], [Root, OtherChild, Target]]
    findAllPaths(nodes, targetId, currentPath = [], results = []) {
      const strTarget = String(targetId);

      for (const node of nodes) {
        const strNode = String(node.identifier);

        // Create a new path array for this branch
        const newPath = [...currentPath, node.identifier];

        // Match Found: Add this full path to results
        if (strNode === strTarget) {
          results.push(newPath);
        }

        // Continue searching deeper even if match found (in case of nested weirdness),
        // but primarily to find matches in OTHER branches.
        if (node.children && node.children.length > 0) {
          this.findAllPaths(node.children, targetId, newPath, results);
        }
      }

      return results;
    },

    toggleNode(item) {
      if (!item.hasChildren) return;

      const strId = String(item.identifier);
      const currentOpenTerms = (this.openedTerms || []).map(String);
      const isOpen = currentOpenTerms.includes(strId);

      let newOpened = [...(this.openedTerms || [])];

      if (isOpen) {
        // Close: Remove strict match
        newOpened = newOpened.filter((id) => String(id) !== strId);
      }
      else {
        // Open: Add original ID
        newOpened.push(item.identifier);
      }

      this.openTerms(newOpened);
    },

    // Prune logic that supports multiple matches
    pruneTreeWithChildren(nodes, targetId) {
      const filtered = [];
      const strTarget = String(targetId);

      for (const node of nodes) {
        const strNode = String(node.identifier);

        // CASE 1: Found the target
        if (strNode === strTarget) {
          filtered.push({
            ...node,
            children: node.children ? [...node.children] : [],
          });
          // We do NOT 'continue' here because a child might ALSO contain the target
          // (unlikely in standard ontology but possible in graph structures)
          // Actually, for standard tree display, if we found it, we show it.
          // If the term appears AGAIN inside itself, recursion handles it.
          continue;
        }

        // CASE 2: Look in children
        if (node.children && node.children.length > 0) {
          const matchingChildren = this.pruneTreeWithChildren(
            node.children,
            targetId,
          );
          if (matchingChildren.length > 0) {
            filtered.push({ ...node, children: matchingChildren });
          }
        }
      }
      return filtered;
    },
  },
};
</script>

<style lang="scss" scoped>
.subject_color--border {
  border: 1px solid #e67e22 !important;
}
.domain_color--border {
  border: 1px solid #712727 !important;
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
  /* overflow-y handled by virtual-scroll, but we keep this for flex layout */
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
.hover-bg:hover {
  background-color: rgba(0, 0, 0, 0.04);
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
</style>
