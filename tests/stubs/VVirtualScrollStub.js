export const VVirtualScrollStub = {
  name: "VVirtualScroll",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    scrollToIndex() {},
  },
  template: `
    <div data-test="v-virtual-scroll">
      <template
        v-for="(item, index) in items"
        :key="item.identifier ?? index"
      >
        <slot :item="item" :index="index" />
      </template>
    </div>
  `,
};
