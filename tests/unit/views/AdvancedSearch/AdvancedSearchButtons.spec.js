import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdvancedSearchButtons from "@/views/AdvancedSearch/AdvancedSearchButtons.vue";
import advancedSearch from "@/store";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("AdvancedSearchButtons.vue", () => {
  let wrapper;
  const mockRouter = {
    replace: vi.fn(),
  };

  const createComponent = (displayOverrides = {}) => {
    return mount(AdvancedSearchButtons, {
      global: {
        plugins: [vuetify],
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
    const editBtn = wrapper.findAllComponents({ name: "v-btn" })[0];
    await editBtn.trigger("click");
    expect(advancedSearch.commit).toHaveBeenCalledWith(
      "advancedSearch/setEditDialogStatus",
      true,
    );
  });

  it("applies 'full-width' class when smAndDown is true", async () => {
    wrapper.vm.$vuetify.display.smAndDown = true;
    const editBtn = wrapper.findAllComponents({ name: "v-btn" })[0];
    await editBtn.trigger("click");

    expect(editBtn.classes()).toContain("full-width");
  });

  it('clears query and commits to store when "Restart" button is clicked', async () => {
    const restartBtn = wrapper.findAllComponents({ name: "v-btn" })[1];
    await restartBtn.trigger("click");
    expect(mockRouter.replace).toHaveBeenCalledWith({ query: null });
    expect(advancedSearch.commit).toHaveBeenCalledWith(
      "advancedSearch/setAdvancedSearchDialogStatus",
      true,
    );
  });
});
