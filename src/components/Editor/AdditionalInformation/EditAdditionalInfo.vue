<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
  >
    <v-card>
      <v-card-title class="blue white--text">
        Edit Additional Information
      </v-card-title>
      <Alerts target="additionalInformation" />
      <v-card-text>
        <v-container
          fluid
        >
          <v-row v-if="Object.keys(getFields('string')).length > 0">
            <v-col cols="12">
              <b class="body-1 blue--text"> BASE FIELDS: </b>
            </v-col>
            <v-col
              xs="12"
              sm="12"
              md="12"
              lg="4"
              xl="3"
              class="pt-0"
            >
              <FieldInput
                v-for="(field, fieldName, fieldIndex) in getFields('enum')"
                :key="'switchField_' + fieldIndex"
                :field-name="fieldName"
                :field-props="field"
              />
            </v-col>
            <v-col
              v-for="(field, fieldName, fieldIndex) in getFields('string')"
              :key="'stringField_' + fieldIndex"
              cols="4"
              xs="12"
              sm="12"
              md="12"
              lg="8"
              xl="9"
            >
              <FieldInput
                :field-name="fieldName"
                :field-props="field"
              />
            </v-col>
          </v-row>
          <v-divider v-if="Object.keys(getFields('string')).length > 0" />
          <v-row>
            <v-col
              v-for="(field, fieldName, fieldIndex) in getFields('object')"
              :key="'objectField_' + fieldIndex"
              cols="4"
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
                  <b class="body-1 blue--text"> {{ cleanString(fieldName).toUpperCase() }}: </b>
                </v-card-title>
                <v-card-text>
                  <FieldInput
                    v-for="(prop, propName, propIndex) in field.properties"
                    :key="'prop_' + propIndex"
                    :field-name="fieldName"
                    :field-props="prop"
                    :subfield-name="propName"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider v-if="Object.keys(getFields('object')).length > 0" />
          <v-row
            v-for="(field, fieldName, fieldIndex) in getFields('array')"
            :key="'arrayFields_' + fieldIndex"
          >
            <v-col cols="12">
              <div>
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
                      @click="createItem(fieldName, allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].properties)"
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
                    cols="4"
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
                          @click="showOverlay(itemIndex, fieldName, item, allowedFields.definitions[field.items.$ref.replace('#/definitions/', '')].properties)"
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
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="info"
          :loading="loading"
          @click="saveRecord()"
        >
          Save and continue
        </v-btn>
        <v-btn
          class="info"
          :loading="loading"
          @click="saveRecord()"
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
          <v-card-title class="green white--text">
            Edit {{ cleanString(overlay.fieldName) }} {{ overlay.id + 1 }}
          </v-card-title>
          <v-card-text class="pt-4">
            <div
              v-for="(field, fieldName, fieldIndex) in overlay.template"
              :key="'templateField_' + fieldIndex"
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
                :rules="rules(fieldName)"
              />
              <v-autocomplete
                v-else
                v-model="overlay.fields[fieldName]"
                :label="fieldName"
                outlined
                :items="field.enum"
                class="field"
              />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="isDisabled()"
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
        </v-card>
      </v-overlay>
    </v-fade-transition>
  </v-form>
</template>

<script>
import Vue from "vue"
import { isEqual } from "lodash"
import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
import stringUtils from '@/utils/stringUtils'
import FieldInput from "./FieldInput";
import { isUrl } from "@/utils/rules.js"
import Alerts from "../Alerts";

export default {
  name: "EditAdditionalInfo",
  components: {Alerts, FieldInput },
  mixins: [ stringUtils ],
  data() {
    return {
      initialized: false,
      loading: false,
      overlay: {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        template: null
      },
      saving: false
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    ...mapState("editor", ["allowedFields"]),
    fields() {
      return this.getSection("additionalInformation").data
    },
    message(){
      let error = this.getSection("additionalInformation").error;
      return {
        error: error,
        value: this.getSection("additionalInformation").message,
        type: function(){if (error){return "error"} else {return "success"}}
      };
    }
  },
  methods: {
    ...mapActions("record", ["updateAdditionalInformation"]),
    ...mapMutations("record", ["setAdditionalInformationSubField", "removeAdditionalInformationSubField"]),
    getFields(type) {
      let output = {};
      if (this.allowedFields && this.allowedFields.properties){
        Object.keys(this.allowedFields.properties).forEach((fieldName) => {
          if (this.allowedFields.properties[fieldName].type === type
          && !this.allowedFields.properties[fieldName].enum) {
            output[fieldName] = this.allowedFields.properties[fieldName]
          }
          else if (type === 'enum' && this.allowedFields.properties[fieldName].enum){
              let expected = new Set(["yes", "no"]);
              let fieldEnum = new Set(this.allowedFields.properties[fieldName].enum);
              if (isEqual(expected, fieldEnum)) {
                output[fieldName] = this.allowedFields.properties[fieldName]
              }
          }
        });
      }
      return output;
    },
    showOverlay(id, fieldName, item, template){
      this.overlay = {
        show: true,
        id,
        fieldName,
        template,
        fields: JSON.parse(JSON.stringify(item))
      }
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
    createItem(fieldName, template){
      this.overlay = {
        show: true,
        id: null,
        fieldName,
        template,
        fields: {}
      };
      Object.keys(template).forEach(field => {
        Vue.set(this.overlay.fields, field, null)
      })
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
        template: null
      }
    },
    removeItem(fieldName, index){
      this.removeAdditionalInformationSubField({
        id: index,
        fieldName
      })
    },
    isDisabled(){
      let fieldsNull = 0;
      Object.values(this.overlay.fields).forEach(obj => {if (obj === null) {
        fieldsNull += 1;
      }});
      return fieldsNull === Object.entries(this.overlay.fields).length;
    },
    rules(fieldName){
      if (this.overlay.template[fieldName].format && this.overlay.template[fieldName].format === 'uri') {
        return [isUrl()]
      }
      return []
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
    }
  }
}
</script>

<style>
  .iconReposition {
    position: relative;
    top: -2px;
  }

  #editAdditionalInfo .field {
    display: inline-block;
    width: 90%;
  }

  .v-tooltip__content {
    max-width: 400px;
  }
</style>
