<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
  >
    <v-card>
      <v-card-title class="blue white--text">
        Edit Additional Information
      </v-card-title>
      <v-card-text>
        <v-container
          fluid
        >
          <v-row v-if="Object.keys(getFields('string')).length > 0">
            <v-col cols="12">
              <b class="body-1 blue--text"> BASE FIELDS: </b>
            </v-col>
            <v-col
              v-for="(field, fieldName, fieldIndex) in getFields('string')"
              :key="'stringField_' + fieldIndex"
              cols="4"
              xs="12"
              sm="12"
              md="12"
              lg="6"
              xl="4"
            >
              <StringField
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
              <v-card class="grey lighten-4">
                <v-card-title>
                  <b class="body-1 blue--text"> {{ cleanString(fieldName).toUpperCase() }}: </b>
                </v-card-title>
                <v-card-text>
                  <StringField
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
import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
import stringUtils from '@/utils/stringUtils'
import StringField from "./StringField";

export default {
  name: "EditAdditionalInfo",
  components: {StringField },
  mixins: [ stringUtils ],
  data() {
    return {
      initialized: false,
      loading: true,
      overlay: {
        show: false,
        id: null,
        fieldName: null,
        fields: null,
        template: null
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    ...mapState("editor", ["allowedFields"]),
    fields() {
      return this.getSection("additionalInformation").data
    }
  },
  methods: {
    ...mapActions("record", ["updateAdditionalInformation"]),
    ...mapMutations("record", ["setAdditionalInformationSubField", "removeAdditionalInformationSubField"]),
    getFields(type) {
      let output = {};
      if (this.allowedFields && this.allowedFields.properties){
        Object.keys(this.allowedFields.properties).forEach((fieldName) => {
          if (this.allowedFields.properties[fieldName].type === type) {
            output[fieldName] = this.allowedFields.properties[fieldName]
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
      Object.keys(template).forEach(fieldName => {
        Vue.set(this.overlay.fields, fieldName, null)
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
    width: 92%;
  }
  
  .v-tooltip__content {
    max-width: 400px;
  }
</style>