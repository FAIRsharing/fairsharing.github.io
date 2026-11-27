export const VCheckboxSlotsStub = {
  name: "VCheckbox",
  props: {
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: "" },
  },
  emits: ["update:modelValue"],
  template: `<label><slot name="prepend" />
    <input type="checkbox" :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)" />
    <slot name="label">{{ label }}</slot>
  </label>`,
};
