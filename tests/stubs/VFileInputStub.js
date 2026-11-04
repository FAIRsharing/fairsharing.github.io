export const VFileInputStub = {
  name: "VFileInput",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `<input data-test="v-file-input" type="file" />`,
};
