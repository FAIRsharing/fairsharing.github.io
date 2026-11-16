export const VTabsWindowStub = {
  name: "VTabsWindow",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `
      <div data-test="v-tabs-window">
        <slot />
      </div>
    `,
};
