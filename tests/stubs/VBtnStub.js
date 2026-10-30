export const VBtnStub = {
  name: "VBtn",
  props: ["disabled"],
  template: `
      <button
          :disabled="disabled"
          v-bind="$attrs"
      >
        <slot />
      </button>
    `,
};
