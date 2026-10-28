export const VSwitchStub = {
  name: "VSwitch",
  props: ["modelValue", "label"],
  emits: ["update:modelValue"],
  template: `
    <label>
      <input
        data-test="v-switch"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      {{ label }}
    </label>

  `,
};
