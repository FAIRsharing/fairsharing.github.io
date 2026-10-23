export const VDataTableStub = {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
    search: {
      type: String,
      default: "",
    },
  },

  template: `
    <table data-test="v-data-table">
      <tbody>
        <slot
          v-for="(item, index) in items"
          :key="item.id ?? index"
          name="item"
          :item="item"
          :index="index"
        />
      </tbody>
    </table>
  `,
};