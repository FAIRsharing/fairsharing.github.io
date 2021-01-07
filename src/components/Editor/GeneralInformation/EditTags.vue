<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editTags"
    ref="editTags"
    v-model="formValid"
  >
    <v-container fluid>
      <v-row>
        <table id="tagsTable">
          <tbody>
            <tr
              v-for="(section, sectionName, sectionIndex) in sections"
              :key="'edit_keywords_' + sectionIndex"
              class="mb-3"
            >
              <td
                class="white--text py-2 px-4 titleCell"
                :class="section.color"
              >
                <v-tooltip right>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      small
                      class="white--text mr-1"
                      v-on="on"
                    >
                      fa-question-circle
                    </v-icon>
                  </template>
                  <span> {{ section.tooltip }} </span>
                </v-tooltip>
                {{ sectionName.toUpperCase() }}
              </td>
              <td :class="section.color + ' lighten-2'">
                <v-chip-group
                  class="pl-2"
                  column
                >
                  <v-chip
                    v-for="(tag, tagIndex) in section.items"
                    :key="'section_' + sectionIndex + '_tag_' + tagIndex"
                    class="white"
                    :class="section.color + '--text'"
                  >
                    <KeywordTooltip :keyword="tag" />
                    <v-tooltip bottom>
                      <template #activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          small
                          class="ml-1"
                          :class="section.color + '--text'"
                          v-on="on"
                          @click="removeTag(section.items, tagIndex)"
                        >
                          fa-times-circle
                        </v-icon>
                      </template>
                      <span> Remove term </span>
                    </v-tooltip>
                  </v-chip>
                </v-chip-group>
              </td>
            </tr>
          </tbody>
        </table>
      </v-row>
      <v-row class="pr-5">
        <v-spacer />
        <v-chip
          class="white--text green pr-5 ml-3 shadowChip"
          :disabled="loading"
          @click="showMenu()"
        >
          <v-icon
            small
            class="mr-3"
          >
            {{ buttonIcon }}
          </v-icon>
          {{ buttonLabel }}
        </v-chip>
      </v-row>
    </v-container>

    <v-expand-transition class="ma-5">
      <v-container
        v-if="menu.show"
        fluid
        class="py-0"
      >
        <v-row
          justify="center"
          no-gutters
        >
          <v-col cols="12">
            <v-text-field
              id="searchString"
              v-model="searchString"
              append-icon="fa-search"
              label="Search names and synonyms"
              outlined
              hide-details
            >
              <template #prepend>
                <v-menu
                  offset-y
                  :close-on-content-click="false"
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      class="blue--text ml-3 mr-1"
                      v-on="on"
                    >
                      fa-cog
                    </v-icon>
                  </template>
                  <v-list class="">
                    <v-list-item>
                      <v-list-item-action>
                        <v-switch
                          v-model="showTypes.domain"
                          inset
                          :color="colors.domain"
                        />
                      </v-list-item-action>
                      <v-list-item-title>Show domains</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1" />
                    <v-list-item>
                      <v-list-item-action>
                        <v-switch
                          v-model="showTypes.subject"
                          inset
                          :color="colors.subject"
                        />
                      </v-list-item-action>
                      <v-list-item-title>Show subjects</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1" />
                    <v-list-item>
                      <v-list-item-action>
                        <v-switch
                          v-model="showTypes.taxonomy"
                          inset
                          :color="colors.taxonomy"
                        />
                      </v-list-item-action>
                      <v-list-item-title>Show taxonomic range</v-list-item-title>
                    </v-list-item>
                    <v-divider class="my-1" />
                    <v-list-item>
                      <v-list-item-action>
                        <v-switch
                          v-model="showTypes.user_defined_tag"
                          inset
                          :color="colors.user_defined_tag"
                        />
                      </v-list-item-action>
                      <v-list-item-title>Show user defined tags</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
            <v-data-table
              v-model="recordTags"
              :headers="headers"
              :items="tags"
              :items-per-page="10"
              :footer-props="{'items-per-page-options': [10, 20, 30, 40, 50]}"
              item-key="label"
              class="elevation-1"
              show-select
              calculate-widths
              mobile-breakpoint="900"
              :loading="loading"
              loading-text="Please wait, tags are loading"
              :search-input.sync="searchString"
            >
              <template #[`item.model`]="{ item }">
                <div
                  :class="colors[item.model] + '--text'"
                  class="noBreak"
                >
                  {{ item.model.toUpperCase().replace(/_/g, " ") }}
                </div>
              </template>
              <template #[`item.label`]="{ item }">
                <v-chip
                  :class="colors[item.model]"
                  class="white--text noBreak"
                >
                  {{ item.label }}
                </v-chip>
              </template>
              <template #[`item.synonyms`]="{ item }">
                <div
                  v-if="item.synonyms"
                  class="font-italic limitWidth"
                >
                  {{ item.synonyms.join(", ") }}
                </div>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12">
            <new-tags />
          </v-col>
        </v-row>
      </v-container>
    </v-expand-transition>
  </v-form>
</template>

<script>
    import { mapGetters, mapState, mapActions } from "vuex"
    import KeywordTooltip from "@/components/Records/Shared/KeywordTooltip.vue";
    import NewTags from "./NewTags";

    export default {
        name: "EditTags",
        components: {NewTags, KeywordTooltip},
        data(){
            return {
                formValid: false,
                menu: {
                  content: null,
                  show: false,
                  label: "Edit record's tags"
                },
                headers: [
                  {
                    text: "Type of keyword",
                    sortable: false,
                    value: "model"
                  },
                  {
                    text: "Name",
                    sortable: false,
                    value: "label"
                  },
                  {
                    text: "Definition",
                    sortable: false,
                    value: "definitions",
                    filterable: false
                  },
                  {
                  text: "Alternative names",
                  sortable: false,
                  value: "synonyms"
                }
                ],
                searchString: null,
                initialized: false,
                showTypes: {
                  domain: true,
                  taxonomy: true,
                  subject: true,
                  user_defined_tag: true
                },
                tags: [],
                loading: false,
                showAddTagOverlay: false,
                lastQuery: null
            }
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            ...mapState("editor", ["tooltips", "colors"]),
            ...mapGetters("editor", ["getPartialTags"]),
            ...mapState("record", ["sections"]),
            sections() {
                return {
                    domains: {
                        items: this.getSection("generalInformation").data.domains,
                        color: this.colors["domain"],
                        tooltip: this.tooltips.domains
                    },
                    "taxonomic range": {
                        items:this.getSection("generalInformation").data.taxonomies,
                        color: this.colors["taxonomy"],
                        tooltip: this.tooltips.species
                    },
                    subjects: {
                        items: this.getSection("generalInformation").data.subjects,
                        color: this.colors["subject"],
                        tooltip: this.tooltips.subjects
                    },
                    "user defined tags": {
                        items: this.getSection("generalInformation").data.userDefinedTags,
                        color: this.colors["user_defined_tag"],
                        tooltip: this.tooltips.userDefinedTags
                    }
                }
            },
            buttonLabel(){
              if (this.menu.show) return "Hide table";
              return "Add new term(s)";
            },
            buttonIcon(){
              if (this.menu.show) return "fa-minus-circle";
              return "fa-plus-circle";
            },
            recordTags: {
              get() {
                return this.getSection("generalInformation").data.taxonomies.map(term => {
                  term.model = 'taxonomy';
                  return term;
                }).concat(this.getSection("generalInformation").data.domains.map(term => {
                  term.model = 'domain';
                  return term;
                })).concat(this.getSection("generalInformation").data.subjects.map(term => {
                  term.model = 'subject';
                  return term;
                })).concat(this.getSection("generalInformation").data.userDefinedTags.map(term => {
                  term.model = 'user_defined_tag';
                  return term;
                }));
              },
              set(val) {
                if (this.initialized) {
                  let tags = {
                    domain: [],
                    taxonomy: [],
                    subject: [],
                    user_defined_tag: []
                  };
                  for (let selectedTag of val) tags[selectedTag.model].push(selectedTag);
                  this.$store.commit("record/setTags", {
                    value: tags.domain,
                    target: "domains"
                  });
                  this.$store.commit("record/setTags", {
                    value: tags.taxonomy,
                    target: "taxonomies"
                  });
                  this.$store.commit("record/setTags", {
                    value: tags.subject,
                    target: "subjects"
                  });
                  this.$store.commit("record/setTags", {
                    value: tags.user_defined_tag,
                    target: "userDefinedTags"
                  })
                }
              }
            }
        },
        watch: {
          async searchString(val){
            this.loading = true;
            this.tags = [];
            val = val.trim();
            this.lastQuery = val;
            await this.getTags(val);
            /* istanbul ignore else */
            if (val === this.lastQuery) {
              this.partialTags();
              this.loading = false;
              this.$scrollTo("#editTags");
            }
          },
          showTypes: {
            deep: true,
            handler(){
              this.partialTags();
            }
          }
        },
        mounted(){
          this.$nextTick(async function () {
            this.loading = true;
            this.initialized = false;
            this.partialTags();
            this.loading = false;
            this.initialized = true;
          })
        },
        methods: {
          ...mapActions('editor', ["getTags"]),
          showMenu(){
            if (!this.menu.show) { this.$scrollTo("#editTags") }
            this.menu.show = !this.menu.show;
          },
          removeTag(sectionItems, termIndex){
            sectionItems.splice(termIndex, 1)
          },
          partialTags(){
            let sections = [];
            Object.keys(this.showTypes).forEach(type => {
              if (this.showTypes[type]) sections.push(type);
            });
            this.tags = this.getPartialTags(sections);
          }
        },
    }
</script>

<style scoped>
    table#tagsTable {
        border-collapse: collapse;
        width: 100%
    }

    table#tagsTable td.titleCell {
      width: 100px;
      white-space: nowrap;
      text-align: center;
      font-size: 16px;
      font-weight: bolder
    }

    table#tagsTable tr {
        border-collapse: collapse;
        border-bottom: 10px solid white;
    }

    .noBreak {
      white-space: nowrap;
    }

    .limitWidth {
      max-width: 800px;
    }

</style>
