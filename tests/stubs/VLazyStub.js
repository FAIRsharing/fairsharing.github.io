export const VLazyStub = {
  name: "VLazy",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: `
      <div data-test="v-lazy">
        <button
            type="button"
            data-test="activate-lazy"
            @click="$emit('update:modelValue', !modelValue)"
        >
          Toggle lazy
        </button>
        <slot />
      </div>
    `,
};
