<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Cross References
    </v-card-title>
    <v-card-text>
      <p
        v-if="currentFields.cross_references.length === 0"
        class="my-0 mx-3"
      >
        No cross-references defined.
      </p>
      <v-row>
        <v-col
          v-for="(cr, index) in currentFields.cross_references"
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
              {{ cr.portal }}
            </v-card-title>

            <v-card-text
              class="pt-4 pb-4 grey lighten-3"
              style="flex-grow: 1;"
            >
              <div> {{ cr.name }}: {{ cr.url }} </div>
            </v-card-text>

            <v-card-actions
              class="pt-0 pb-0 grey lighten-3"
            >
              <v-btn
                text
                color="blue"
                @click="removeReference(cr)"
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
        @click="createReference"
      >
        Add cross reference
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
        id="addReference"
        ref="addReference"
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
                        v-model="newReference.portal"
                        :items="crossReferenceTypes"
                        menu-props="auto"
                        label="Portal"
                        :rules="[rules.isRequired()]"
                        outlined
                        return-object
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newReference.name"
                        label="Name"
                        :rules="[rules.isRequired()]"
                        outlined
                      />
                    </v-col>
                    <v-col class="col-6">
                      <v-text-field
                        v-model="newReference.url"
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
                  :disabled="!formValid"
                  @click="addReference()"
                >
                  Add Cross Reference
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
  name: "CrossReferences",
  data() {
    return {
      openEditor: false,
      formValid: false,
      newReference: {},
      rules: {
        isRequired: function(){return isRequired()},
        isUrl: function(){return isUrl()},
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection", "getChanges"]),
    ...mapState("editor", ["crossReferenceTypes"]),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      let data = this.getSection("additionalInformation").data
      if (!data.cross_references) data.cross_references = [];
      return data;
    }
  },
  watch: {
    currentFields: {
      deep: true,
      handler() {
        let _module = this;
        let changes = 0;

        let initialReferences = _module.getSection("additionalInformation").initialData.cross_references;
        let currentReferences = _module.currentFields.cross_references;

        let onlyInitial = initialReferences.filter(compareArray(currentReferences));
        let onlyCurrent = currentReferences.filter(compareArray(initialReferences));

        changes += (onlyInitial.length + onlyCurrent.length);

        _module.$emit("update-counts", {cross_references: changes});

      }
    }
  },
  methods: {
    createReference() {
      this.newReference = {
        portal: null,
        name: null,
        url: null
      };
      this.openEditor = true;
    },
    addReference() {
      const _module = this;
      let newRef = JSON.parse(JSON.stringify(_module.newReference));
      this.currentFields.cross_references.push(newRef);
      _module.newReference = {};
      _module.openEditor = false;
    },
    removeReference(ref){
      this.currentFields.cross_references = this.currentFields.cross_references.filter(obj =>
          obj.type !== ref.name && obj.url !== ref.url && obj.portal !== ref.portal
      );
    },
  }

}
</script>

<style scoped>

</style>
