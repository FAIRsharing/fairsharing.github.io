export const VBtnToggleStub = {
  name: "VBtnToggle",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: '<div data-test="sort-toggle"><slot /></div>',
};
