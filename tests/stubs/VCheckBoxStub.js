export const VCheckBoxStub = {
  name: "VCheckbox",
  props: {
    modelValue: {
      type: Boolean,

      default: false,
    },
  },
  emits: ["update:modelValue"],
  template: `
      <input
          data-test="v-checkbox"
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
      />
    `,
};
