<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
    v-model="formValid"
  >
    <v-card>
      <v-card-title class="grey lighten-4 blue--text">
        Edit Additional Information
      </v-card-title>
      <Alerts target="additionalInformation" />
      <v-card-text>
        <v-container
          fluid
        >
          <div
            v-if="isPolicy"
            class="d-flex full-width pb-3"
          >
            <b>
              For more information on how to complete these sections, please see our
              <a
                href="https://fairsharing.gitbook.io/fairsharing/additional-information/policy-content"
                target="_blank"
              >
                documentation.
              </a>
            </b>
          </div>

          <v-row
            v-for="(field, fieldName, fieldIndex) in getFields('array')"
            :key="'arrayFields_' + fieldIndex"
          >
            <v-col cols="12">
              <div>
                <v-tooltip
                  v-if="getFields('array')[fieldName]['description']"
                  class="d-inline-block mr-2"
                  bottom
                >
                  <template #activator="{ on }">
                    <v-icon v-on="on">
                      fa-question-circle
                    </v-icon>
                  </template>
                  {{ getFields('array')[fieldName]['description'] }}
                </v-tooltip>
                <b class="body-1 blue--text"> {{ cleanString(fieldName).toUpperCase() }} </b>

                <v-tooltip
                  bottom
                  class="d-inline-block mr-2"
                >
                  <template #activator="{ on }">
                    <v-icon
                      small
                      class="blue--text white ml-2 iconReposition"
                      v-on="on"
                      @click="createItem(fieldName,
                                         allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].properties,
                                         allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].required || []
                      )"
                    >
                      fas fa-plus-circle
                    </v-icon>
                  </template>
                  Add a new {{ cleanString(fieldName) }}
                </v-tooltip>
              </div>
              <v-container fluid>
                <v-row v-if="!fields[fieldName] || fields[fieldName].length === 0">
                  No {{ cleanString(fieldName) }} for this record.
                </v-row>
                <v-row>
                  <v-col
                    v-for="(item, itemIndex) in fields[fieldName]"
                    :key="'arrayField_' + itemIndex"
                    cols="12"
                    xs="12"
                    sm="12"
                    md="6"
                    lg="4"
                    xl="3"
                  >
                    <v-card
                      height="100%"
                      class="d-flex flex-column grey lighten-4"
                    >
                      <v-card-text
                        style="flex-grow: 1;"
                        class="pb-0"
                      >
                        <div
                          v-for="(subField, subfieldName, subfieldIndex) in item"
                          :key="'arrayFieldSubField_' + subfieldIndex"
                        >
                          <b>{{ cleanString(subfieldName).toUpperCase() }}: </b> {{ subField }}
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          class="success"
                          fab
                          x-small
                          @click="showOverlay(itemIndex,
                                              fieldName, item, allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].properties,
                                              allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].required || []
                          )"
                        >
                          <v-icon
                            x-small
                          >
                            fa-pen
                          </v-icon>
                        </v-btn>
                        <v-btn
                          class="error"
                          fab
                          x-small
                          @click="removeItem(fieldName, itemIndex)"
                        >
                          <v-icon x-small>
                            fa-trash
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
          <v-divider v-if="Object.keys(getFields('array')).length > 0" />
          <v-row>
            <v-col
              v-for="(field, fieldName, fieldIndex) in getFields('object')"
              :key="'objectField_' + fieldIndex"
              cols="12"
              xs="12"
              sm="12"
              md="12"
              lg="6"
              xl="3"
            >
              <v-card
                class="grey lighten-4"
                height="100%"
              >
                <v-card-title>
                  <v-tooltip
                    v-if="getFields('object')[fieldName]['description']"
                    bottom
                    class="d-inline-block mr-2"
                  >
                    <template #activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ getFields('object')[fieldName]['description'] }}
                  </v-tooltip>
                  <b class="body-1 blue--text"> {{ cleanString(fieldName).toUpperCase() }}: </b>
                </v-card-title>
                <v-card-text>
                  <FieldInput
                    v-for="(prop, propName, propIndex) in sortObject(field.properties)"
                    :key="'prop_' + propIndex"
                    :field-name="fieldName"
                    :field-props="prop"
                    :subfield-name="propName"
                  />
                  <!-- put required in the input above -->
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider v-if="Object.keys(getFields('object')).length > 0" />
          <v-row v-if="Object.keys(getFields('enum')).length > 0">
            <!-- there are currently no fields with type: enum -->
            <v-col cols="12">
              <b class="body-1 blue--text"> BASE FIELDS: </b>
            </v-col>
            <v-col
              xs="12"
              sm="12"
              md="12"
              lg="4"
              xl="2"
              class="pt-0"
            >
              <FieldInput
                v-for="(field, fieldName, fieldIndex) in getFields('enum')"
                :key="'switchField_' + fieldIndex"
                :field-name="fieldName"
                :field-props="field"
              />
            </v-col>
          </v-row>
          <v-divider v-if="Object.keys(getFields('enum')).length > 0" />
          <v-row v-if="Object.keys(getFields('string')).length > 0">
            <v-col
              v-for="(field, fieldName, fieldIndex) in getFields('string')"
              :key="'stringField_' + fieldIndex"
              cols="12"
              xs="12"
              sm="12"
              md="12"
              lg="8"
              xl="10"
            >
              <FieldInput
                :field-name="fieldName"
                :field-props="field"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!formValid"
          class="info"
          :loading="saving"
          @click="saveRecord(false)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :disabled="!formValid"
          class="info"
          :loading="saving"
          @click="saveRecord(true)"
        >
          Save And Exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-fade-transition>
      <v-overlay
        v-if="overlay.show"
        :absolute="false"
        opacity="0.8"
        :dark="false"
      >
        <v-card width="800px">
          <v-form
            id="editAdditionalInformationOverlay"
            ref="editAdditionalInformationOverlay"
            v-model="subFormValid"
          >
            <v-card-title class="green white--text">
              Edit {{ cleanString(overlay.fieldName) }} {{ overlay.id + 1 }}
            </v-card-title>
            <v-card-text class="pt-4">
              <div
                v-for="(field, fieldName, fieldIndex) in overlay.template"
                :key="'templateField_' + fieldIndex"
                class="d-flex flex-row reposition"
              >
                <v-tooltip
                  v-if="overlay.template[fieldName].description"
                  bottom
                  class="d-inline-block mr-2"
                >
                  <template #activator="{ on }">
                    <v-icon v-on="on">
                      fa-question-circle
                    </v-icon>
                  </template>
                  {{ overlay.template[fieldName].description }}
                </v-tooltip>
                <v-text-field
                  v-if="!field.enum"
                  v-model="overlay.fields[fieldName]"
                  :label="fieldName"
                  outlined
                  class="field"
                  :rules="rules(fieldName, overlay.required)"
                />
                <v-autocomplete
                  v-else
                  v-model="overlay.fields[fieldName]"
                  :label="fieldName"
                  outlined
                  :items="field.enum"
                  class="field"
                  :rules="rules(fieldName, overlay.required)"
                />
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!subFormValid"
                class="success"
                @click="addItem()"
              >
                Submit item
              </v-btn>
              <v-btn
                class="error"
                @click="hideOverlay()"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-overlay>
    </v-fade-transition>
  </v-form>
</template>

<script>
//import { isEqual } from "lodash"
import Vue from "vue"
import {mapActions, mapGetters, mapMutations,mapState} from "vuex";

import sortObj from "@/utils/generalUtils"
import { isRequired,isUrl } from "@/utils/rules.js"
import stringUtils from '@/utils/stringUtils'

import Alerts from "../Alerts";
import FieldInput from "./FieldInput";
const diff = require("deep-object-diff").diff;

export default {
  name: "EditAdditionalInfo",
  components: { Alerts, FieldInput },
  mixins: [ stringUtils, sortObj ],
  data() {
    return {
      isPolicy: false,
      initialized: false,
      overlay: {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        template: null
      },
      saving: false,
      subFormValid: false,
      formValid: false
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    ...mapState("editor", ["allowedFields"]),
    fields() {
      return this.getSection("additionalInformation").data
    },
    initialData(){
      return this.getSection("additionalInformation").initialData;
    },
    message(){
      let error = this.getSection("additionalInformation").error;
      return {
        error: error,
        value: this.getSection("additionalInformation").message
      };
    }
  },
  watch: {
    fields: {
      deep: true,
      /* istanbul ignore next */
      handler(newVal) {
        this.submitChanges(newVal);
      }
    }
  },
  mounted(){
    if (this.allowedFields.id && this.allowedFields.id.includes('policy')) {
      this.isPolicy = true;
    }
    this.$nextTick(() => {this.$refs['editAdditionalInfo'].validate()});
  },
  methods: {
    ...mapActions("record", ["updateAdditionalInformation"]),
    ...mapMutations("record", ["setAdditionalInformationSubField", "removeAdditionalInformationSubField"]),
    getFields(type) {
      let output = {};
      if (this.allowedFields && this.allowedFields.properties){
        Object.keys(this.sortObj(this.allowedFields.properties)).forEach((fieldName) => {
          if (this.allowedFields.properties[fieldName].type === type
          && !this.allowedFields.properties[fieldName].enum) {
            output[fieldName] = this.allowedFields.properties[fieldName]
          }
          else if (type === 'string' && this.allowedFields.properties[fieldName].enum){
            // Previous TODO message:
            // TODO: These types must be checked, or perhaps this check removed, if the schema is modified
            // TODO: to add additional properties.
            // New TODO message:
            // TODO: These parts have been commented out as part of:
            // TODO: https://github.com/FAIRsharing/fairsharing.github.io/issues/2526
            // TODO: Due to the presence of an enum field that isn't yes/no etc.
            // TODO: Further changes may be required for new fields.
            //let expected = new Set(["yes", "no", "not found"]);
            //let fieldEnum = new Set(this.allowedFields.properties[fieldName].enum);
            //if (isEqual(expected, fieldEnum)) {
              output[fieldName] = this.allowedFields.properties[fieldName]
            //}
          }
        });
      }
      return output;
    },
    showOverlay(id, fieldName, item, template, required){
      this.overlay = {
        show: true,
        id,
        fieldName,
        template,
        required,
        fields: JSON.parse(JSON.stringify(item))
      };
      /* istanbul ignore next */
      this.$nextTick(() => {
        if(this.$refs['editAdditionalInformationOverlay']) this.$refs['editAdditionalInformationOverlay'].validate()}
      );
    },
    hideOverlay(){
      this.overlay = {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        template: null
      }
    },
    createItem(fieldName, template, required){
      this.overlay = {
        show: true,
        id: null,
        fieldName,
        template,
        required,
        fields: {}
      };
      Object.keys(template).forEach(field => {
        Vue.set(this.overlay.fields, field, null)
      });
      /* istanbul ignore next */
      this.$nextTick(() => {
        if(this.$refs['editAdditionalInformationOverlay']) this.$refs['editAdditionalInformationOverlay'].validate()}
      );
    },
    addItem(){
      this.setAdditionalInformationSubField({
        fieldName: this.overlay.fieldName,
        id: this.overlay.id,
        fieldValue: this.overlay.fields
      });
      this.overlay = {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        required: null,
        template: null
      }
      // It appears that this isn't called when a field is edited; it's not clear why the watcher doesn't
      // detect the change. So, it is explicitly called here.
      // https://github.com/FAIRsharing/fairsharing.github.io/issues/1718
      this.submitChanges(this.fields);
    },
    removeItem(fieldName, index){
      this.removeAdditionalInformationSubField({
        id: index,
        fieldName
      })
    },
    rules(fieldName, required){
      let rules = [];
      if (this.overlay.template[fieldName].format && this.overlay.template[fieldName].format === 'uri') {
        rules.push(isUrl());
      }
      if (required && required.indexOf(fieldName) > -1) {
        rules.push(isRequired());
      }
      return rules;
    },
    async saveRecord(redirect){
      this.saving = true;
      await this.updateAdditionalInformation({
        fields: Object.keys(this.allowedFields.properties),
        id: this.$route.params.id,
        token: this.user().credentials.token
      });
      this.saving = false;
      if (this.message.error || !redirect){
        this.$scrollTo("#mainHeader");
      }
      else {
        await this.$router.push({path: '/' + this.$route.params.id})
      }
    },
    submitChanges(newVal){
      let delta = 0;
      let changes = diff(this.initialData, newVal);
      Object.keys(changes).forEach(change => {
        if (changes[change] !== null && Object.keys(changes[change]).length > 0) delta += 1
      });
      this.$store.commit("record/setChanges", {
        section: "additionalInformation",
        value: delta
      });
      this.overlay = {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        template: null
      }
    },
    sortObject(obj) {
      return Object.keys(obj).sort().reduce((res, key) => (res[key] = obj[key], res), {});
    }
  }
}
</script>

<style>
  .iconReposition {
    position: relative;
    top: -2px;
  }

  .v-tooltip__content {
    max-width: 400px;
  }

  #editAdditionalInfo .reposition .fa{
    position: relative;
    top: -14px;
  }

</style>
