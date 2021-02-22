<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Data Processes
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col
          v-for="(dp, index) in currentFields.data_processes"
          :key="'selected_' + index"
          class="col-3"
          cols="12"
          sm="12"
          xs="12"
          md="6"
          lg="4"
          xl="3"
        >
          <!-- card for individual data process -->
          <v-card
            class="d-flex flex-column ml-1"
          >
            <v-card-title
              class="grey white--text"
            >
              {{ dp.type }} data process
            </v-card-title>

            <v-card-text
              class="pt-4 pb-4 grey lighten-3"
              style="flex-grow: 1;"
            >
              <div> <b>Name:</b> {{ dp.name }} </div>
              <div> <b>URL:</b> {{ dp.url || "N/A" }} </div>
            </v-card-text>

            <v-card-actions
              class="pt-0 pb-0 grey lighten-3"
            >
              <v-btn
                text
                color="blue"
                @click="removeDataProcess(dp)"
              >
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
          <!-- end of card for individual data process -->
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        @click="createDataProcess"
      >
        Add data process
      </v-btn>
    </v-card-actions>

    <!-- new data process dialogue begins -->

    <v-dialog
      v-model="openEditor"
      max-width="1000px"
      class="pa-0"
      persistent
      no-click-animation
    >
      <v-form
        id="addAssociatedTool"
        ref="addAssociatedTool"
        v-model="formValid"
      >
        <v-container
          fluid
          class="py-0"
        >
          <v-row justify="center">
            <v-card width="100%">
              <v-card-title class="green white--text">
                Add a data process
              </v-card-title>
              <v-card-text>
                <v-container fluid>
                  <v-row justify="start">
                    <v-col class="col-6">
                      <v-select
                        v-model="newDataProcess.type"
                        :items="dataProcessTypes"
                        menu-props="auto"
                        label="Type"
                        :rules="[rules.isRequired()]"
                        outlined
                        return-object
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newDataProcess.name"
                        label="Name"
                        :rules="[rules.isRequired()]"
                        outlined
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newDataProcess.url"
                        label="URL"
                        :rules="[rules.isUrl()]"
                        outlined
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  class="green white--text"
                  :disabled="!formValid"
                  @click="addDataProcess()"
                >
                  Add Access Point
                </v-btn>
                <v-btn
                  class="red white--text"
                  @click="openEditor = false"
                >
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>

          <!-- new data process dialogue ends -->
          </v-row>
        </v-container>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import {isRequired, isUrl} from "@/utils/rules.js";
import {compareArray} from "@/utils/utils.js";

export default {
  name: "DataProcesses",
  data() {
    return {
      openEditor: false,
      formValid: false,
      newDataProcess: {},
      rules: {
        isRequired: function(){return isRequired()},
        isUrl: function(){return isUrl()},
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection", "getChanges"]),
    ...mapState("editor", ["dataProcessTypes"]),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      let data = this.getSection("additionalInformation").data
      if (!data.data_processes) data.data_processes = [];
      return data;
    }
  },
  watch: {
    currentFields: {
      deep: true,
      handler() {
        let _module = this;
        let changes = 0;

        let initialAps = _module.getSection("additionalInformation").initialData.data_processes;
        let currentAps = _module.currentFields.data_processes;

        let onlyInitial = initialAps.filter(compareArray(currentAps));
        let onlyCurrent = currentAps.filter(compareArray(initialAps));

        changes += (onlyInitial.length + onlyCurrent.length);

        _module.$emit("update-counts", {data_processes: changes});

      }
    }
  },
  methods: {
    createDataProcess() {
      this.newDataProcess = {
        type: null,
        url: null,
        name: null
      };
      this.openEditor = true;
    },
    addDataProcess() {
      const _module = this;
      let newDp = JSON.parse(JSON.stringify(_module.newDataProcess));
      this.currentFields.data_processes.push(newDp);
      _module.newDataProcess = {};
      _module.openEditor = false;
    },
    removeDataProcess(point){
      this.currentFields.data_processes = this.currentFields.data_processes.filter(obj =>
          obj.type !== point.name && obj.url !== point.url
      );
    },
  }

}
</script>

<style scoped>

</style>