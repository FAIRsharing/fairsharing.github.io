<template>
  <div
    v-if="fieldName"
    class="d-flex flex-row"
    :class="{ reposition: !isSwitch }"
  >
    <v-tooltip
      v-if="fieldProps.description"
      location="bottom"
      class="d-inline-block mr-2"
    >
      <template #activator="{ props }">
        <v-icon v-bind="props"> fas fa-question-circle </v-icon>
      </template>
      {{ fieldProps.description }}
    </v-tooltip>

    <v-text-field
      v-if="!fieldProps.enum"
      :model-value="target()"
      :label="getName"
      variant="outlined"
      class="textField"
      width="80%"
      :rules="rules"
      @update:model-value="setField($event)"
    />

    <v-autocomplete
      v-else-if="!isSwitch"
      :model-value="target()"
      :label="getName"
      :items="fieldProps.enum"
      variant="outlined"
      class="field"
      @update:model-value="setField($event)"
    />

    <v-switch
      v-if="isSwitch && !subfieldName"
      v-model="fields[fieldName]"
      inset
      class="field ml-3 switch"
      true-value="yes"
      false-value="no"
      @update:model-value="setField($event)"
    >
      <template #label>
        {{ getName }}:
        <span v-if="!subfieldName">
          <span v-if="fields[fieldName]" class="ml-1">{{
            fields[fieldName]
          }}</span>
          <span v-else class="ml-1"> no </span>
        </span>

        <span v-else>
          <span v-if="fields[fieldName][subfieldName]" class="ml-1">{{
            fields[fieldName][subfieldName]
          }}</span>
          <span v-else class="ml-1"> no </span>
        </span>
      </template>
    </v-switch>

    <v-switch
      v-if="isSwitch && subfieldName"
      v-model="fieldCheck()[subfieldName]"
      inset
      class="field ml-3 switch"
      true-value="yes"
      false-value="no"
      @update:model-value="setField($event)"
    >
      <template #label>
        {{ getName }}:
        <span v-if="!subfieldName">
          <span v-if="fieldCheck()" class="ml-1">{{ fieldCheck() }}</span>
          <span v-else class="ml-1"> no </span>
        </span>

        <span v-else>
          <span v-if="fieldCheck()[subfieldName]" class="ml-1">
            {{ fieldCheck()[subfieldName] }}
          </span>
          <span v-else class="ml-1"> no </span>
        </span>
      </template>
    </v-switch>
  </div>
</template>

<script>
import { isEqual } from "lodash";
import { mapGetters, mapMutations } from "vuex";

import { isUrl } from "@/utils/rules.js";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "FieldInput",
  mixins: [stringUtils],
  props: {
    fieldName: { default: null, type: String },
    fieldProps: { default: null, type: Object },
    id: { default: null, type: Number },
    subfieldName: { default: null, type: String },
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    fields() {
      return this.getSection("additionalInformation").data;
    },
    getName() {
      if (!this.subfieldName) return this.cleanString(this.fieldName);
      return this.cleanString(this.subfieldName);
    },
    rules() {
      let rules = [];
      if (this.fieldProps.format === "uri") {
        rules.push(isUrl());
      }
      return rules;
    },
    isSwitch() {
      const mySet = new Set(["yes", "no"]);
      const enumSet = new Set(this.fieldProps.enum);
      return !!(this.fieldProps.enum && isEqual(enumSet, mySet));
    },
  },
  methods: {
    ...mapMutations("record", ["setAdditionalInformation"]),
    setField(fieldValue) {
      this.setAdditionalInformation({
        fieldName: this.fieldName,
        fieldValue,
        subfieldName: this.subfieldName,
      });
    },
    target() {
      if (!this.fields[this.fieldName]) {
        if (!this.subfieldName) {
          this.fields[this.fieldName] = null;
        }
        else {
          this.fields[this.fieldName] = {};
        }
      }
      if (!this.subfieldName) return this.fields[this.fieldName];
      else {
        return this.fields[this.fieldName][this.subfieldName];
      }
    },
    // For some annoying yes/no values which throw console errors.
    // See https://github.com/FAIRsharing/fairsharing.github.io/issues/1874
    fieldCheck() {
      let _module = this;
      if (_module.fields[_module.fieldName] !== undefined) {
        return _module.fields[_module.fieldName];
      }
      let retval = {
        [_module.fieldName]: {
          [_module.subfieldName]: "no",
        },
      };
      retval[_module.fieldName] = _module.subfieldName;
      return retval;
    },
  },
};
</script>

<style scoped>
.field.switch {
  position: relative;
  top: 3px;
}
</style>
