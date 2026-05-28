import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdvancedSearchButtons from "@/views/AdvancedSearch/AdvancedSearchButtons.vue";
import { createVuetify } from "vuetify";
import { createStore } from "vuex";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

describe("AdvancedSearchButtons.vue", () => {
  let wrapper;
  let store;

  const mockRouter = {
    replace: vi.fn(),
  };

  const createComponent = (displayOverrides = {}) => {
    store = createStore({
      modules: {
        advancedSearch: {
          namespaced: true,
          mutations: {
            setEditDialogStatus: vi.fn(),
            setAdvancedSearchDialogStatus: vi.fn(),
          },
        },
      },
    });

    vi.spyOn(store, "commit");

    return mount(AdvancedSearchButtons, {
      global: {
        plugins: [vuetify, store],
        mocks: {
          $router: mockRouter,
          $vuetify: {
            display: {
              smAndDown: false,
              mdAndDown: false,
              lgAndUp: true,
              ...displayOverrides,
            },
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createComponent();
  });

  it('calls store commit when "Edit" button is clicked', async () => {
    const editBtn = wrapper.findAllComponents(components.VBtn)[0];
    await editBtn.trigger("click");
    expect(store.commit).toHaveBeenCalledWith(
      "advancedSearch/setEditDialogStatus",
      true,
    );
  });

  it('clears query and commits to store when "Restart" button is clicked', async () => {
    const restartBtn = wrapper.findAllComponents(components.VBtn)[1];
    await restartBtn.trigger("click");

    expect(mockRouter.replace).toHaveBeenCalledWith({ query: null });
    expect(store.commit).toHaveBeenCalledWith(
      "advancedSearch/setAdvancedSearchDialogStatus",
      true,
    );
  });
});
