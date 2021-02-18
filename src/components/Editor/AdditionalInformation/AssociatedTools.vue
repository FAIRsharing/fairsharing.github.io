<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Associated Tools
    </v-card-title>
    <v-card-text>
      <p
        v-if="currentFields.associated_tools.length === 0"
        class="my-0 mx-3"
      >
        No Associated tools defined.
      </p>
      <v-row>
        <v-col
          v-for="(at, index) in currentFields.associated_tools"
          :key="'selected_' + index"
          class="col-3"
          cols="12"
          sm="12"
          xs="12"
          md="6"
          lg="4"
          xl="3"
        >
          <!-- card for individual access point -->
          <v-card
            class="d-flex flex-column ml-1"
          >
            <v-card-title
              class="grey white--text"
            >
              {{ at.name }}
            </v-card-title>

            <v-card-text
              class="pt-4 pb-4 grey lighten-3"
              style="flex-grow: 1;"
            >
              <div> {{ at.url }} </div>
            </v-card-text>

            <v-card-actions
              class="pt-0 pb-0 grey lighten-3"
            >
              <v-btn
                text
                color="blue"
                @click="removeTool(at)"
              >
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
          <!-- end of card for individual access point -->
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        @click="createTool"
      >
        Add associated tool
      </v-btn>
    </v-card-actions>

    <!-- new access point dialogue begins -->

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
              Add an access point
            </v-card-title>
            <v-card-text>
              <v-container fluid>
                <v-row justify="start">
                  <v-col class="col-6">
                    <v-text-field
                      v-model="newTool.name"
                      label="Name"
                      :rules="[rules.isRequired()]"
                      outlined
                    />
                  </v-col>
                  <v-col class="col-6">
                    <v-text-field
                      v-model="newTool.url"
                      label="URL"
                      :rules="[rules.isRequired(), rules.isUrl()]"
                      outlined
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="green white--text"
                @click="addTool()"
              >
                Add Associated Tool
              </v-btn>
              <v-btn
                class="red white--text"
                @click="openEditor = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- new access point dialogue ends -->
        </v-row>
      </v-container>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex"
import {isRequired, isUrl} from "@/utils/rules.js"


export default {
  name: "AssociatedTools",
  data() {
    return {
      openEditor: false,
      newTool: {},
      rules: {
        isRequired: function(){return isRequired()},
        isUrl: function(){return isUrl()},
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection", "getChanges"]),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      let data = this.getSection("additionalInformation").data
      if (!data.associated_tools) data.associated_tools = [];
      return data;
    }
  },
  watch: {
    currentFields: {
      deep: true,
      handler() {
        let _module = this;
        let changes = 0;

        let initialTools = _module.getSection("additionalInformation").initialData.associated_tools;
        let currentTools = _module.currentFields.associated_tools;

        let onlyInitial = initialTools.filter(_module.compare(currentTools));
        let onlyCurrent = currentTools.filter(_module.compare(initialTools));

        changes += (onlyInitial.length + onlyCurrent.length);

        _module.$emit("update-counts", {associated_tools: changes});

      }
    }
  },
  methods: {
    compare(array) {
      return function(current){
        return array.filter(function(other){
          return other.type === current.type && other.url === current.url
        }).length === 0;
      }
    },
    createTool() {
      this.newTool = {
        name: null,
        url: null
      };
      this.openEditor = true;
    },
    addTool() {
      const _module = this;
      let newAt = JSON.parse(JSON.stringify(_module.newTool));
      this.currentFields.associated_tools.push(newAt);
      _module.newTool = {};
      _module.openEditor = false;
    },
    removeTool(tool){
      this.currentFields.associated_tools = this.currentFields.associated_tools.filter(obj =>
          obj.type !== tool.name && obj.url !== tool.url
      );
    },
  }

}
</script>

<style scoped>

</style>
