<template>
  <v-card id="editKeywords">
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
      <b> EDIT KEYWORDS </b>
    </v-card-title>
    <v-alert
      v-if="error"
      type="error"
    >
      {{ error.message }}
    </v-alert>
    <v-card-text class="pb-0 pt-3">
      <v-container
        fluid
        class="selectedTermsSection"
      >
        <v-row>
          <v-col
            v-for="(itemVal, itemName) in getSelectedTerms"
            :key="'term_' + itemName"
            class="col-3"
          >
            <v-card
              height="100%"
              style="display:flex; flex-direction: column"
            >
              <v-card-title
                :class="colors[itemName]"
                class="white--text"
              >
                <v-tooltip
                  bottom
                  max-width="300px"
                >
                  <template v-slot:activator="{ on }">
                    <v-icon
                      class="white--text mr-3"
                      v-on="on"
                    >
                      fa-question-circle
                    </v-icon>
                  </template>
                  {{ descriptions[itemName] }}
                </v-tooltip>

                <h4>Selected {{ itemName }}</h4>
              </v-card-title>
              <v-card-text
                :class="colors[itemName] + ' lighten-3'"
                class="pt-3"
                style="flex:1"
              >
                <v-chip
                  v-for="item in itemVal"
                  :key="'item_' + item.id + '_' + item.label"
                  :color="'white ' + colors[item.type] + '--text'"
                  close
                  class="mr-3 mb-2"
                  @click:close="removeKeyword(item)"
                >
                  {{ item.label }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search names and alternative names"
        outlined
        hide-details
      />
      <v-container
        fluid
        class="mt-3 pb-0"
      >
        <v-row>
          <h4 class="pl-2">
            <u>Show selected ontologies: </u>
          </h4>
        </v-row>
        <v-row>
          <v-col class="col-1 py-0">
            <v-switch
              v-model="showTypes"
              label="Domains"
              value="domains"
            />
          </v-col>
          <v-col class="col-1 py-0">
            <v-switch
              v-model="showTypes"
              label="Subjects"
              value="subjects"
              :color="colors['subjects']"
            />
          </v-col>
          <v-col class="col-1 py-0">
            <v-switch
              v-model="showTypes"
              label="Species"
              value="species"
              :color="colors['species']"
            />
          </v-col>
          <v-col class="col-2 py-0">
            <v-switch
              v-model="showTypes"
              label="User defined tags"
              value="userDefinedTags"
              :color="colors['userDefinedTags']"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-divider />
      <v-data-table
        v-model="selectedKeywords"
        :headers="headers"
        :items="getKeywords"
        :items-per-page="5"
        item-key="label"
        class="elevation-1"
        show-select
        :search="search"
        :loading="!initialized"
        loading-text="Loading... Please wait"
        calculate-widths
      >
        <template slot="no-results">
          <div v-if="showTypes.length === 4">
            <div class="noTerm mt-3">
              No terms where found, do you want to create a new user defined tag?
            </div>
            <v-btn
              class="green white--text my-3"
              @click="createNewTerm()"
            >
              Create new term
            </v-btn>
          </div>

          <div v-else>
            <div class="noTerm mt-3">
              No term found. To create a new term please activate all ontology's switches above the table.
            </div>
          </div>
        </template>

        <template
          v-slot:item="props"
          class="alTerm"
        >
          <tr v-if="initialized">
            <td class="selectTerm">
              <v-checkbox
                :color="colors[props.item.type]"
                :input-value="props.isSelected"
                @change="props.select($event)"
              />
            </td>
            <td
              :class="colors[props.item.type] + '--text'"
              class="termType"
            >
              <b>{{ props.item.type.toUpperCase() }}</b>
            </td>
            <td class="termLabel">
              {{ props.item.label }}
            </td>
            <td class="termDef">
              <div v-if="props.item.definitions">
                {{ props.item.definitions[0] }}
              </div>
            </td>
            <td class="termSynonyms">
              <v-chip-group>
                <v-chip
                  v-for="name in props.item.synonyms"
                  :key="'subName_' + name"
                  :color="colors[props.item.type]"
                  dark
                >
                  {{ name }}
                </v-chip>
              </v-chip-group>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
    <v-card-actions class="p-5">
      <v-btn
        class="primary"
        @click="submitRecord()"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions, mapState } from "vuex"
  import GraphClient from "@/components/GraphClient/GraphClient.js"
  import RestClient from "@/components/Client/RESTClient.js"
  import domainsQuery from "@/components/GraphClient/queries/getDomains.json"
  import taxonomiesQuery from "@/components/GraphClient/queries/getTaxonomies.json"
  import subjectsQuery from "@/components/GraphClient/queries/getSubjects.json"
  import userTagQuery from "@/components/GraphClient/queries/getUserDefinedTags.json"
  import desc from './data/fieldsDescription.json'
  import routerUtils from "@/utils/routerUtils";

  let graphClient = new GraphClient();
  let restClient = new RestClient();
  export default {
    name: "EditKeywords",
    mixins: [routerUtils],
    data(){
      return {
        fields: [
          "domains",
          "taxonomies",
          "subjects",
          "userDefinedTags"
        ],
        keywords: [],
        headers: [
          {
            text: "Type of keyword",
            sortable: true,
            value: "type"
          },
          {
            text: "Name",
            sortable: true,
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
            sortable: true,
            value: "synonyms"
          }
        ],
        selectedKeywords: [],
        recordKeywords: [],
        initialized: false,
        search: "",
        showTypes: [
          "domains",
          "subjects",
          "species",
          "userDefinedTags"
        ],
        colors: {
          "domains": "blue",
          "subjects": "orange",
          "species": "green",
          "taxonomies": "green",
          "userDefinedTags": "grey"
        },
        error: null
      }
    },
    computed: {
      ...mapGetters("record", ["getField"]),
      ...mapState("users", ["user"]),
      ...mapState("record", ["recordUpdate"]),
      getKeywords(){
        const _module = this;
        let keywords = [];
        _module.keywords.forEach(function(keyword){
          if (_module.showTypes.indexOf(keyword.type) > -1){
            keywords.push(keyword);
          }
        });
        return keywords;
      },
      getSelectedTerms(){
        const _module = this;
        let added = false;
        let terms = {
          domains: [],
          subjects: [],
          species: [],
          userDefinedTags: []
        };
        if (_module.recordKeywords.length > 0){
          added = true;
          _module.recordKeywords.forEach(function(keyword){
            if (keyword.type === "taxonomies"){
              terms["species"].push(keyword)
            }
            else {
              terms[keyword.type].push(keyword)
            }
          });
        }
        return (added) ? terms : null;
      },
      descriptions(){
        return desc.descriptions;
      }
    },
    watch: {
      selectedKeywords: {
        deep: true,
        handler: function(after){
          const _module = this;
          if (_module.initialized){
            _module.recordKeywords = after;
          }
        }
      },
      recordKeywords: {
        deep: true,
        handler: function(after){
          const _module = this;
          if (_module.initialized){
            _module.selectedKeywords = after;
          }
        }
      }
    },
    async mounted(){
      await this.$nextTick(async function () {
        let _module = this;
        await _module.getData();
        _module.initialized = true;
      })
    },
    methods: {
      ...mapActions("record", ["updateRecord"]),
      getFields: function(){
        let currentKeywords = [];
        const _module = this;
        _module.fields.forEach(function(field){
          let values = _module.getField(field);
          if (values){
            values.forEach(function(val){
              val.type = field;
              currentKeywords.push(val)
            })
          }
        });
        return currentKeywords;
      },
      getDomains: async function(){
        let domains = await graphClient.executeQuery(domainsQuery);
        domains = domains['searchDomains'].filter(obj => obj['inFairsharing'] === true);
        return domains
      },
      getTaxonomies: async function(){
        let taxonomies = await graphClient.executeQuery(taxonomiesQuery);
        return taxonomies["searchTaxonomies"]
      },
      getSubjects: async function(){
        let subjects = await graphClient.executeQuery(subjectsQuery);
        return subjects["searchSubjects"]
      },
      getUserTags: async function(){
        let userTag = await graphClient.executeQuery(userTagQuery);
        return userTag["searchUserDefinedTags"]
      },
      getData: async function(){
        const _module = this;
        _module.addToKeywords(await _module.getDomains(), "domains");
        _module.addToKeywords(await _module.getTaxonomies(), "species");
        _module.addToKeywords(await _module.getSubjects(), "subjects");
        _module.addToKeywords(await _module.getUserTags(), "userDefinedTags");
        _module.recordKeywords = _module.getFields();
        _module.recordKeywords.forEach(function(field){
          let keyword = _module.keywords.filter(obj => obj.label === field.label);
          _module.selectedKeywords.push(keyword[0]);
        });
        _module.keywords.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
      },
      addToKeywords(data, type){
        const _module = this;
        data.forEach(function(val){
          val.type = type;
          _module.keywords.push(val);
        })
      },
      removeKeyword(keyword){
        const _module = this;
        _module.recordKeywords = _module.recordKeywords.filter(obj => obj.label !== keyword.label && obj.id !== keyword.id);
      },
      async submitRecord(){
        const _module = this;
        let preparedRecord = {
          domain_ids: [],
          subject_ids: [],
          taxonomy_ids: [],
          user_defined_tag_ids: []
        };
        const types = {
          domains: "domain_ids",
          subjects: "subject_ids",
          taxonomies: "taxonomy_ids",
          species: "taxonomy_ids",
          userDefinedTags: "user_defined_tag_ids"
        };
        _module.recordKeywords.forEach(function(keyword){
          preparedRecord[types[keyword.type]].push(keyword.id)
        });
        let data = {
          record: preparedRecord,
          id: _module.$route.params.id,
          token: _module.user().credentials.token
        };
        // POST THE DATA AND REACT THE RESPONSE
        await _module.updateRecord(data);
        if (!_module.recordUpdate.error){
          let ID = _module.recordUpdate.id.data.id;
          _module.goto({Path:"/" + ID});
        }
        else {
          _module.error = _module.recordUpdate;
        }
      },
      async createNewTerm(){
        const _module = this;
        let newTerm = await restClient.createNewUserDefinedTag(_module.search, _module.user().credentials.token);
        let addTerm = {
          label: newTerm.label,
          id: newTerm.id,
          type: "userDefinedTags"
        };
        _module.selectedKeywords.push(addTerm);
        _module.keywords.push(addTerm);
      }
    }
  }
</script>

<style>
  table td.selectTerm{
    width: 70px;
  }
  table td.termType{
    width: 200px;
  }
  table td.termLabel{
    width: 250px;
  }
  table td.termSynonyms {
    max-width: 900px;
  }
</style>
