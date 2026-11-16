export const VDialogStub = {
  name: "VDialog",

  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  template: `
    <div v-if="modelValue" data-test="v-dialog">
      <slot />
    </div>
  `,
};
