export const VTabStub = {
  name: "VTab",
  props: { disabled: Boolean },
  emits: ["group:selected"],
  template: '<button :disabled="disabled"><slot /></button>',
};
