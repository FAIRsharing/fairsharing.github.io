export const VSelectStub = {
  name: "VSelect",
  inheritAttrs: false,
  props: {
    modelValue: {
      default: null,
    },
    items: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  template: `
    <select
      data-test="v-select"
      :value="modelValue"
      :aria-label="label"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="item in items"
        :key="item"
        :value="item"
      >
        {{ item }}
      </option>
    </select>
  `,
};
