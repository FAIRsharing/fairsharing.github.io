export const VDataTableSlotsStub = {
  name: "VDataTable",
  props: {
    items: { type: Array, default: () => [] },
    headers: { type: Array, default: () => [] },
    loading: Boolean,
    search: { type: String, default: "" },
  },
  template: `
    <table data-test="v-data-table"><tbody>
      <tr v-for="(item, index) in items" :key="item.id ?? index">
        <td v-for="header in headers" :key="header.key || header.value">
          <slot :name="'item.' + (header.key || header.value)" :item="item" :index="index" />
        </td>
      </tr>
    </tbody></table>
  `,
};
