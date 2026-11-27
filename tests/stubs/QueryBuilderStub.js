export const QueryBuilderStub = {
  name: "QueryBuilder",
  props: {
    modelValue: { type: Object, required: true },
    config: { type: Object, required: true },
  },
  emits: ["update:modelValue"],
  methods: {
    updateCurrentOperator(operatorIdentifier) {
      this.$emit("update:modelValue", {
        ...this.modelValue,
        operatorIdentifier,
      });
    },
  },
  template: `<div data-test="query-builder">
    <slot name="groupOperator" :currentOperator="modelValue.operatorIdentifier" :operators="config.operators" :updateCurrentOperator="updateCurrentOperator" />
    <slot name="groupControl" :group="modelValue" />
  </div>`,
};
