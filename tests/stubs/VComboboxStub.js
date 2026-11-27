export const VComboboxStub = {
  name: "VCombobox",
  props: {
    modelValue: { type: Array, default: () => [] },
    items: { type: Array, default: () => [] },
    itemTitle: { type: String, default: "title" },
    returnObject: { type: Boolean, default: false },
  },
  emits: ["update:modelValue", "focus", "click:clear"],
  methods: {
    title(item) {
      return typeof item === "object"
        ? item[this.itemTitle] || ""
        : String(item);
    },
  },
  template: `<div data-test="v-combobox">
    <input aria-label="Search options" @focus="$emit('focus')" />
    <button type="button" data-test="clear-combobox" @click="$emit('update:modelValue', []); $emit('click:clear')">Clear</button>
    <slot name="prepend" />
    <slot v-for="(selected, index) in modelValue" :key="'chip_' + index" name="chip" :props="{}" :item="{ raw: selected, title: title(selected) }" />
    <slot v-for="(item, index) in items" :key="'item_' + index" name="item" :props="{}" :item="{ raw: item, title: title(item) }" />
  </div>`,
};
