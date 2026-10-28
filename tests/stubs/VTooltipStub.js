export const VTooltipStub = {
  name: "VTooltip",
  template: `
    <div data-test="v-tooltip">
      <slot name="activator" :props="{}" />
      <slot />
    </div>
  `,
};
