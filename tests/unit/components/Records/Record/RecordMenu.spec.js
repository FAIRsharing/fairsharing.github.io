import { shallowMount } from "@vue/test-utils";

import RecordMenu from "@/components/Records/Record/RecordMenu.vue";
import { VBtnStub, VIconStub, VMenuStub } from "../../../../stubs/index.js";

describe("RecordMenu.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RecordMenu, {
      global: {
        stubs: {
          VMenu: VMenuStub,
          VBtn: VBtnStub,
          VListItem: VBtnStub,
          VIcon: VIconStub,
        },
      },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordMenu");
  });

  it("renders the activator and invokes enabled actions without invoking disabled ones", async () => {
    const edit = {
      name: () => "Edit record",
      isDisabled: () => false,
      method: vi.fn(),
    };
    const remove = {
      name: () => "Delete record",
      isDisabled: () => true,
      method: vi.fn(),
    };
    await wrapper.setProps({ buttons: [edit, remove] });
    const buttons = wrapper.findAll("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0].text()).toContain("Actions");
    expect(buttons[0].attributes("data-test")).toBe("menu-activator");
    expect(buttons[1].text()).toBe("Edit record");
    expect(buttons[1].attributes("disabled")).toBeUndefined();
    expect(buttons[2].text()).toBe("Delete record");
    expect(buttons[2].attributes("disabled")).toBeDefined();
    await buttons[1].trigger("click");
    await buttons[2].trigger("click");
    expect(edit.method).toHaveBeenCalledTimes(1);
    expect(remove.method).not.toHaveBeenCalled();
  });

  it("passes read-only mode to the menu and updates it when the prop changes", async () => {
    expect(wrapper.findComponent(VMenuStub).attributes("disabled")).toBe(
      "false",
    );
    await wrapper.setProps({ readOnlyMode: true });
    expect(wrapper.findComponent(VMenuStub).attributes("disabled")).toBe(
      "true",
    );
    await wrapper.setProps({ readOnlyMode: false });
    expect(wrapper.findComponent(VMenuStub).attributes("disabled")).toBe(
      "false",
    );
  });

  it("updates action labels and availability when the buttons change", async () => {
    await wrapper.setProps({
      buttons: [
        { name: () => "Disabled", isDisabled: () => true, method: vi.fn() },
      ],
    });
    expect(wrapper.findAll("button")[1].attributes("disabled")).toBeDefined();
    const run = vi.fn();
    await wrapper.setProps({
      buttons: [
        { name: () => "Enabled", isDisabled: () => false, method: run },
      ],
    });
    const action = wrapper.findAll("button")[1];
    expect(action.text()).toBe("Enabled");
    expect(action.attributes("disabled")).toBeUndefined();
    await action.trigger("click");
    expect(run).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ buttons: [] });
    expect(wrapper.findAll("button")).toHaveLength(1);
  });
});
