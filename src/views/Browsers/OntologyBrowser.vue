<template>
  <main>
    <v-container fluid>
      <NotFound v-if="error" />
      <v-row v-else>
        <v-col cols="12">
          <v-card>
            <v-card-title class="primary white--text">
              Welcome to the {{ selectedOntology }}s browser
            </v-card-title>
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
                    xl="4"
                    col="12"
                    class="border-right"
                  >
                    <div
                      id="searchOntology"
                      class="px-2 mt-2"
                    >
                      <v-autocomplete
                        v-model="search"
                        :items="flattenTree(tree)"
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
                      activatable
                      :color="color"
                      :search="search"
                      :open.sync="open"
                      :active.sync="activeItem"
                      class="tree pb-3 px-3"
                      hoverable
                    >
                      <template #label="{ item, active }">
                        <div class="d-flex flex-row justify-center align-center">
                          <v-chip
                            :class="!active ? `white ${color}--text ${color}--border` : `${color} white--text`"
                          >
                            {{ item.name }}
                          </v-chip>
                          <v-spacer />
                          <div
                            :class="active ? `white ${color}--text ${color}--border` : `${color} white--text`"
                            class="d-flex justify-center align-center hits"
                          >
                            {{ item.hits ? item.hits : 0 }}
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
                    xl="8"
                    col="12"
                  >
                    <div v-if="!loadingItem">
                      <v-card
                        v-if="activeItem.length > 0 && getItem(activeItem[0])"
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
                            {{ selectedItem.name }}
                          </v-chip>
                          <v-spacer v-if="$vuetify.breakpoint.smAndUp" />
                          <br v-else>
                          <div
                            :class="`${color} white--text`"
                            class="d-flex justify-center align-center hits largeHits"
                          >
                            {{ selectedItem.hits ? selectedItem.hits : 0 }}
                          </div>
                        </v-card-title>
                        <v-divider />
                        <v-card-text>
                          <h4 :class="`${color}--text mb-4 text-decoration-underline text-h4`">
                            Records with this {{ selectedOntology }}:
                          </h4>
                          <div class="inputGroup">
                            <v-select
                              v-model="pagination.perPage"
                              :items="[10, 20, 50, 100]"
                              outlined
                              label="Records per page"
                            />
                          </div>
                          <BrowserDisplay
                            v-if="content"
                            :records="content.records"
                            :selected-ontology="selectedOntology"
                          />
                        </v-card-text>
                      </v-card>
                      <v-card
                        v-else
                        class="pa-5"
                        flat
                      >
                        <v-card-text>Select a term to display the details</v-card-text>
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
        v-if="loadingItem"
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
  </main>
</template>

<script>
import { mapState } from "vuex";
import NotFound from "@/views/Errors/404";
import Loaders from "@/components/Navigation/Loaders";
import BrowserDisplay from "@/components/Ontologies/BrowserDisplay"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import query from "@/lib/GraphClient/queries/ontologyBrowser.json";
import fakeItems from "./mockItems.json"

const client = new GraphClient()

export default {
  name: "OntologyBrowser",
  components: {Loaders, NotFound, BrowserDisplay},
  data(){
    return {
      allowedOntologies: ['domain', 'subject'],
      tree: fakeItems,
      search: null,
      open: [],
      activeItem: [],
      flattenedTree: [],
      selectedItem: null,
      loadingItem: false,
      content: null,
      pagination: {
        perPage: 50,
        page: 1
      }
    }
  },
  computed: {
    selectedOntology () { return this.$route.params.id },
    error () { return !this.allowedOntologies.includes(this.selectedOntology) },
    color () { return this.colors[this.selectedOntology] },
    ...mapState("editor", ["colors"]),
  },
  watch: {
    async selectedItem(newTerm) {
      if (newTerm) {
        this.loadingItem = true;
        this.pagination = {
          perPage: 50,
          page: 1
        }
        await this.findRecords(newTerm.name.trim())
        this.loadingItem = false
        this.$scrollTo("#termDisplay")
      }
    },
    async 'pagination.perPage'(){
      this.loadingItem = true;
      await this.findRecords(this.selectedItem.name.trim());
      this.loadingItem = false
    }
  },
  mounted() { this.flattenedTree = this.flattenTree(this.tree) },
  methods: {
    flattenTree(tree) {
      let termArray = [];
      for (const term of tree) {
        termArray.push({
          id: term.id,
          name: term.name,
          hits: term.hits
        })
        if (term.children) termArray = termArray.concat(this.flattenTree(term.children))
      }
      return termArray
    },
    getItem(id) {
      let term = this.flattenedTree.filter( obj => obj.id === id)[0]
      if (term) this.selectedItem = term
      return !!term
    },
    async findRecords(term){
      query.queryParam = { subjects: term, ...this.pagination }
      const response = await client.executeQuery(query)
      this.content = response.searchFairsharingRecords
    }
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
    height: 73vh;
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

.inputGroup .v-input {
  width: 130px;
}

</style>
