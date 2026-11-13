export const VBtnStub = {
  name: "VBtn",
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <button
      type="button"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <slot />
    </button>
  `,
};
