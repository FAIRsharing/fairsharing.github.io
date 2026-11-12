import { vi } from "vitest";

export const VTextFieldStub = {
  name: "VTextField",

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue", "click:append-inner"],

  methods: {
    reset: vi.fn(function () {
      this.$emit("update:modelValue", "");
    }),
  },
  template: `
    <input
      data-test="v-text-field"
      :value="modelValue"
      :aria-label="label"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `,
};
