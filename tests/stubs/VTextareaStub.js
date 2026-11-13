export const VTextareaStub = {
  name: "VTextarea",

  props: {
    modelValue: {
      type: String,
      default: "",
    },

    label: {
      type: String,
      default: "",
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  template: `
      <textarea
          data-test="v-textarea"
          :value="modelValue"
          :aria-label="label"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
      />
    `,
};
