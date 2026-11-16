export const VFormStub = {
  name: "VForm",
  props: ["modelValue"],

  emits: ["update:modelValue"],
  methods: {
    validate: vi.fn(),
  },
  template: `
    <form class="v-form-stub">
      <slot />
    </form>
  `,
};
