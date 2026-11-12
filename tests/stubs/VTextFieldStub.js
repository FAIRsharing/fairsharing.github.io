export const VTextFieldStub = {
  name: "VTextField",

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue", "click:append-inner"],

  template: `
    <input
      data-test="v-text-field"
      :value="modelValue"
      :aria-label="label"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `,
};
