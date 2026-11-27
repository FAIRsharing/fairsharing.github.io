export const VOverlayStub = {
  name: "VOverlay",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `
    <div data-test="v-overlay">
      <slot v-if="modelValue" />
    </div>

  `,
};
