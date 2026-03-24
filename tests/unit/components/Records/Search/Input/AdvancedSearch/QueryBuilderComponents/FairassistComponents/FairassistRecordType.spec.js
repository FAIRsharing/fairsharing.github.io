import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import FairassistRecordType from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/FairassistComponents/FairassistRecordType.vue";

describe("FairassistRecordType.vue", () => {
  let wrapper;
  let actions;
  let store;
  const mockFilteredList = ["Database Type A", "Database Type B"];

  beforeEach(() => {
    actions = {
      fetchAllRecordTypes: vi.fn(),
    };

    store = createStore({
      modules: {
        recordTypes: {
          namespaced: true,
          actions,
        },
      },
    });

    wrapper = shallowMount(FairassistRecordType, {
      global: {
        plugins: [store],
        stubs: { SelectComponent: true },
        mocks: {
          filteredRecordTypes: vi.fn(() => mockFilteredList),
        },
      },
      props: {
        value: ["Existing Value"],
      },
    });
  });

  it('emits "input" when the model computed property is set', () => {
    wrapper.vm.model = ["Updated via Model"];

    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toEqual([["Updated via Model"]]);
  });

  it("updates itemSelected when selectedValue method is called", () => {
    wrapper.vm.selectedValue(["Method Selection"]);
    expect(wrapper.vm.itemSelected).toStrictEqual(["Method Selection"]);
  });
  it("can check v-model integration with SelectComponent", async () => {
    const selectStub = wrapper.findComponent({ name: "SelectComponent" });
    await selectStub.vm.$emit("update:modelValue", ["FTP", "SPARQL"]);
    expect(wrapper.emitted().input).toBeTruthy();
    expect(wrapper.emitted().input[0]).toStrictEqual([["FTP", "SPARQL"]]);
  });
});
