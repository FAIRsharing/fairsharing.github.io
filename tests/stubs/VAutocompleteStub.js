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
    multiple: {
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
      if (this.modelValue == null || this.multiple) {
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
      if (this.multiple) {
        const existing = Array.isArray(this.modelValue) ? this.modelValue : [];
        if (value === "") {
          this.$emit("update:modelValue", []);
          return;
        }
        const selectedItem = this.safeItems[Number(value)];
        if (!selectedItem) {
          return;
        }
        const mapped = this.returnObject
          ? selectedItem
          : selectedItem?.[this.itemValue];
        const alreadySelected = existing.some(
          (item) =>
            item === mapped ||
            (this.returnObject &&
              item?.[this.itemValue] === mapped?.[this.itemValue]),
        );
        if (!alreadySelected) {
          this.$emit("update:modelValue", [...existing, mapped]);
        }
        return;
      }
      if (this.returnObject) {
        const selectedItem =
          value === "" ? null : this.safeItems[Number(value)];
        this.$emit("update:modelValue", selectedItem ?? null);
      }
      else {
        this.$emit("update:modelValue", value);
      }
    },
    removeSelectedItem(item) {
      const existing = Array.isArray(this.modelValue) ? this.modelValue : [];
      const updated = existing.filter(
        (selected) =>
          selected !== item &&
          selected?.[this.itemValue] !== item?.[this.itemValue],
      );
      this.$emit("update:modelValue", updated);
    },
  },
  template: `
      <div data-test="v-autocomplete-wrapper">
        <!-- Prepend slot -->
        <div
            v-if="$slots.prepend"
            data-test="v-autocomplete-prepend"
        >
          <slot name="prepend" />
        </div>
        <!-- Selected chips -->
        <div
            v-if="$slots.chip"
            data-test="v-autocomplete-chips"
        >
          <template
              v-for="(selected, index) in (
            Array.isArray(modelValue)
              ? modelValue
              : modelValue == null
                ? []
                : [modelValue]
          )"
              :key="index"
          >
            <slot
                name="chip"
                :props="{
              onClickClose: () => removeSelectedItem(selected)
            }"
                :item="{ raw: selected }"
            />
          </template>
        </div>
        <!-- Select input -->
        <select
            data-test="v-autocomplete"
            :disabled="disabled"
            :aria-label="label"
            :value="selectedValue"
            @change="handleChange"
        >
          <option value="">
            Select relationship
          </option>
          <option
              v-for="(item, index) in safeItems"
              :key="index"
              :value="
            returnObject || multiple
              ? index
              : item[itemValue]
          "
          >
            {{ item[itemTitle] }}
          </option>
        </select>
        <!-- Item scoped slot -->
        <div
            v-if="$slots.item"
            data-test="v-autocomplete-items"
        >
          <template
              v-for="(item, index) in safeItems"
              :key="index"
          >
            <slot
                name="item"
                :props="{}"
                :item="{ raw: item }"
            />
          </template>
        </div>
      </div>
    `,
};
