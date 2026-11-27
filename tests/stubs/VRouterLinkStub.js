export const VRouterLinkStub = {
  name: "VRouterLink",
  props: ["to"],
  template: `
    <a :href="to">
      <slot />
    </a>
  `,
};
