export const VMenuStub = {
  name: "VMenu",
  props: ["modelValue"],
  template: `
    <div data-test="v-menu">
      <slot
        name="activator"
        :props="{
          'data-test': 'menu-activator'
        }"
      />
      <slot
        :isActive="{ value: true }"
      />
    </div>
  `,
};
