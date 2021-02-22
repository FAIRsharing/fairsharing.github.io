<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Access Points
    </v-card-title>
    <v-card-text>
      <v-row>
        <p
          v-if="currentFields.access_points.length === 0"
          class="my-0 mx-3"
        >
          No access points defined.
        </p>
        <v-col
          v-for="(ap, index) in currentFields.access_points"
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
              {{ ap.type }} access point
            </v-card-title>

            <v-card-text
              class="pt-4 pb-4 grey lighten-3"
              style="flex-grow: 1;"
            >
              <div> <b>URL:</b> {{ ap.url }} </div>
              <div> <b>Documentation:</b> {{ ap.documentation_url || "N/A" }} </div>
              <div> <b>Example:</b> {{ ap.example_url || "N/A" }}</div>
            </v-card-text>

            <v-card-actions
              class="pt-0 pb-0 grey lighten-3"
            >
              <v-btn
                text
                color="blue"
                @click="removeAccessPoint(ap)"
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
        @click="createAccessPoint"
      >
        Add access point
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
      <v-form
        id="addAccessPoint"
        ref="addAccessPoint"
        v-model="formValid"
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
                      <v-select
                        v-model="newAccessPoint.type"
                        :items="accessPointTypes"
                        menu-props="auto"
                        label="Type"
                        :rules="[rules.isRequired()]"
                        outlined
                        return-object
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newAccessPoint.url"
                        label="URL"
                        :rules="[rules.isRequired(), rules.isUrl()]"
                        outlined
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newAccessPoint.documentation_url"
                        label="Documentation URL"
                        :rules="[rules.isUrl()]"
                        outlined
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newAccessPoint.example_url"
                        label="Example URL"
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
                  @click="addAccessPoint()"
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

          <!-- new access point dialogue ends -->
          </v-row>
        </v-container>
      </v-form>
    </v-dialog>
  </v-card>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import {isRequired, isUrl} from "@/utils/rules.js"
import {compareArray} from "@/utils/utils.js";


export default {
  name: "AccessPoints",
  data() {
    return {
      openEditor: false,
      formValid: false,
      newAccessPoint: {},
      rules: {
        isRequired: function(){return isRequired()},
        isUrl: function(){return isUrl()},
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection", "getChanges"]),
    ...mapState("editor", ["accessPointTypes"]),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      let data = this.getSection("additionalInformation").data
      if (!data.access_points) data.access_points = [];
      return data;
    }
  },
  watch: {
    currentFields: {
      deep: true,
      handler() {
        let _module = this;
        let changes = 0;

        let initialAps = _module.getSection("additionalInformation").initialData.access_points;
        let currentAps = _module.currentFields.access_points;

        let onlyInitial = initialAps.filter(compareArray(currentAps));
        let onlyCurrent = currentAps.filter(compareArray(initialAps));

        changes += (onlyInitial.length + onlyCurrent.length);

        _module.$emit("update-counts", {access_points: changes});

      }
    }
  },
  methods: {
    createAccessPoint() {
      this.newAccessPoint = {
        type: null,
        url: null,
        documentation_url: null,
        example_url: null,
      };
      this.openEditor = true;
    },
    addAccessPoint() {
      const _module = this;
      let newAp = JSON.parse(JSON.stringify(_module.newAccessPoint));
      this.currentFields.access_points.push(newAp);
      _module.newAccessPoint = {};
      _module.openEditor = false;
    },
    removeAccessPoint(point){
      this.currentFields.access_points = this.currentFields.access_points.filter(obj =>
          obj.type !== point.name && obj.url !== point.url
      );
    },
  }

}
</script>

<style scoped>

</style>