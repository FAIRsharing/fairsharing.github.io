export const VCheckboxArrayStub = {
  name: "VCheckbox",
  props: {
    modelValue: { type: Array, default: () => [] },
    value: { type: Object, required: true },
    label: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  computed: {
    checked() {
      return this.modelValue.some((item) => item.value === this.value.value);
    },
  },
  methods: {
    change(event) {
      this.$emit(
        "update:modelValue",
        event.target.checked
          ? [...this.modelValue, this.value]
          : this.modelValue.filter((item) => item.value !== this.value.value),
      );
    },
  },
  template: `<label><input type="checkbox" :aria-label="label" :checked="checked" @change="change" /><slot name="label">{{ label }}</slot></label>`,
};
