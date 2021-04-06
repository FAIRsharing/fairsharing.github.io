<template>
  <div v-if="fieldName">
    <v-tooltip
      bottom
      class="d-inline-block mr-2"
    >
      <template #activator="{ on }">
        <v-icon v-on="on">
          fa-question-circle
        </v-icon>
      </template>
      {{ fieldProps.description }}
    </v-tooltip>

    <v-text-field
      v-if="!fieldProps.enum"
      :value="target()"
      :label="getName"
      outlined
      class="field"
      width="80%"
      :rules="rules"
      @input="setField($event)"
    />

    <v-autocomplete
      v-else-if="!isSwitch"
      :value="target()"
      :label="getName"
      :items="fieldProps.enum"
      outlined
      class="field"
      @input="setField($event)"
    />

    <v-switch
      v-if="isSwitch"
      :value="target()"
      inset
      class="field ml-3 switch"
      true-value="yes"
      false-value="no"
      @change="setField($event)"
    >
      <template #label>
        <!-- #TODO REWRITE THIS BIT -->
        {{ getName }}:
        <span
          v-if="fields[fieldName]"
          class="ml-1"
        >
          <span v-if="!subfieldName">{{ fields[fieldName] }}</span>
          <span v-else>{{ fields[fieldName][subfieldName] }}</span>
        </span>
        <span
          v-else
          class="ml-1"
        > no </span>
      </template>
    </v-switch>
  </div>
</template>

<script>
    import { mapGetters, mapMutations } from "vuex"
    import { isEqual } from 'lodash'
    import stringUtils from '@/utils/stringUtils'
    import { isUrl } from "@/utils/rules.js"

    export default {
        name: "StringField",
        mixins: [ stringUtils ],
        props: {
            fieldName: { default: null, type: String },
            fieldProps: { default: null, type: Object },
            id: {default: null, type: Number},
            subfieldName: { default: null, type: String },
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            fields() {
                return this.getSection("additionalInformation").data
            },
            field() {
                if (!this.subfieldName) return this.fields[this.fieldName] || null;
                return ''
            },
            getName() {
                if (!this.subfieldName) return this.cleanString(this.fieldName);
                return this.cleanString(this.subfieldName);
            },
            rules() {
              if (this.fieldProps.format === 'uri') {
                return [isUrl()]
              }
              return []
            },
            isSwitch(){
              const mySet = new Set(["yes", "no"]);
              const enumSet = new Set(this.fieldProps.enum);
              return !!(this.fieldProps.enum && isEqual(enumSet, mySet));
            }
        },
        methods: {
            ...mapMutations("record", ["setAdditionalInformation"]),
            setField(fieldValue) {
                this.setAdditionalInformation({
                    fieldName: this.fieldName,
                    fieldValue,
                    subfieldName: this.subfieldName
                })
            },
            target() {
                if (!this.subfieldName) return this.fields[this.fieldName];
                else {
                    if (!this.fields[this.fieldName]) {
                        this.fields[this.fieldName] = {}
                    }
                    return this.fields[this.fieldName][this.subfieldName]
                }
            }
        }
    }
</script>

<style scoped>
  .field.switch {
    position: relative;
    top:3px;
  }
</style>
