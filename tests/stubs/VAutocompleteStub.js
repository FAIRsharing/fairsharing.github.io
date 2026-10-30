export const VAutocompleteStub = {
  name: "VAutocomplete",

  inheritAttrs: false,

  props: {
    modelValue: {
      type: [String, Number, Object, Array],
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    prefix: {
      type: String,
      default: "",
    },
    itemTitle: {
      type: String,
      default: "title",
    },
    itemValue: {
      type: String,
      default: "value",
    },
    returnObject: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  computed: {
    safeItems() {
      return Array.isArray(this.items) ? this.items : [];
    },

    selectedValue() {
      if (this.modelValue == null) {
        return "";
      }

      if (this.returnObject) {
        const index = this.safeItems.findIndex(
          (item) =>
            item === this.modelValue ||
                        item?.[this.itemValue] === this.modelValue?.[this.itemValue],
        );

        return index === -1 ? "" : String(index);
      }

      return this.modelValue;
    },
  },

  methods: {
    handleChange(event) {
      const value = event.target.value;

      if (this.returnObject) {
        const selectedItem =
                    value === "" ? null : this.safeItems[Number(value)];

        this.$emit("update:modelValue", selectedItem ?? null);
      }
      else {
        this.$emit("update:modelValue", value);
      }
    },
  },

  template: `
    <select
      data-test="v-autocomplete"
      :disabled="disabled"
      :aria-label="label"
      :value="selectedValue"
      @change="handleChange"
    >
      <option value="">Select relationship</option>

      <option
        v-for="(item, index) in safeItems"
        :key="index"
        :value="returnObject ? index : item[itemValue]"
      >
        {{ item[itemTitle] }}
      </option>
    </select>
  `,
};