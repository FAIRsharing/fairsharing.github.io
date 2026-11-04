export const VTabsStub = {
  name: "VTabs",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `
      <div data-test="v-tabs">
        <slot />
      </div>
    `,
};
