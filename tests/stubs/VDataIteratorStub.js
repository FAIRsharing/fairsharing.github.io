import { vi } from "vitest";

const updateOptions = vi.fn();
export const VDataIteratorStub = {
  name: "VDataIterator",
  props: ["items", "itemsPerPage", "loading", "page", "search", "sortBy"],
  methods: { updateOptions },
  template: `<div data-test="iterator"><slot name="header" :pagination="{page: 1}" :options="{page: 1}" :updateOptions="updateOptions" /><slot v-if="items.length" :items="items.map(raw => ({raw}))" /><slot v-else name="no-data" /><slot name="footer" :pagination="{page: 1}" :options="{page: 1}" :updateOptions="updateOptions" /></div>`,
};
