import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import EditSupportLinks from "@/components/Editor/DataAccess/EditSupportLinks.vue";
import ExternalClients from "@/lib/Client/ExternalClients.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import {
  VAutocompleteStub,
  VBtnStub,
  VDialogStub,
  VFormStub,
  VSelectStub,
  VSwitchStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs/index.js";
import { VIconStub } from "../../../../stubs/VIconStub.js";

const sinon = require("sinon");

let $route = { path: "/123/edit", params: { id: 123 } };
recordStore.state.sections = {
  dataAccess: {
    data: {
      support_links: [
        { type: "Other", url: "https://example.com/test" },
        {
          type: "Mailing list",
          url: { url: "test@example.com" },
          name: "a test",
        },
      ],
    },
    initialData: {
      support_links: [
        { type: "Other", url: "https://example.com/test" },
        {
          type: "Mailing list",
          url: { url: "test@example.com" },
          name: "a test",
        },
      ],
    },
  },
};
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
  },
});

const VDataTableStub = {
  name: "VDataTable",
  props: ["items"],
  template: `
    <div data-test="v-data-table">
      <slot name="bottom" />
      <template v-for="(group, type) in grouped" :key="type">
        <slot
          name="group-header"
          :item="{
            value: type,
            items: group.map(raw => ({ raw }))
          }"
        />
      </template>
      <slot v-if="!items || items.length === 0" name="no-data" />
    </div>
  `,
  computed: {
    grouped() {
      return Object.groupBy(
        this.items || [],

        (item) => item.type,
      );
    },
  },
};

let wrapper;
let stub;

describe("Edit -> EditSupportLinks.vue", function () {
  beforeAll(() => {
    stub = sinon.stub(ExternalClients.prototype, "executeQuery");
    stub.returns({ data: [{ name: "ABC", url: "http://example.com" }] });
  });

  afterAll(() => {
    stub.restore();
  });

  beforeEach(async () => {
    wrapper = await shallowMount(EditSupportLinks, {
      global: {
        plugins: [$store],
        mocks: { $route },
        stubs: {
          VForm: VFormStub,
          VAutocomplete: VAutocompleteStub,
          VTextField: VTextFieldStub,
          VIcon: VIconStub,
          VTooltip: VTooltipStub,
          VDialog: VDialogStub,
          VBtn: VBtnStub,
          VSwitch: VSwitchStub,
          VSelect: VSelectStub,
          VDataTable: VDataTableStub,
          VChip: {
            name: "VChip",
            template: `
            <div v-bind="$attrs">
              <slot />
            </div>
          `,
          },
        },
      },
    });
  });

  it("can be mounted", () => {
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isUrl();
    wrapper.vm.rules.isEmail();
    wrapper.vm.rules.isEmailOrUrl();
    wrapper.vm.$options.watch.search.call(wrapper.vm);
    expect(wrapper.vm.$options.name).toMatch("EditSupportLinks");
    expect(wrapper.vm.isNew({ field: "test" })).toBe(true);
  });

  it("can open the new link menu", () => {
    wrapper.vm.newLink();
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      id: null,
      template: {
        type: null,
        url: { url: null },
        name: null,
      },
    });
  });

  it("can hide the overlay", () => {
    wrapper.vm.hideOverlay();
    expect(wrapper.vm.edit).toStrictEqual({
      show: false,
      id: null,
      template: null,
    });
  });

  it("can edit a support link", () => {
    wrapper.vm.editLink(0);
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      id: 0,
      template: {
        type: "Other",
        url: { url: "https://example.com/test" },
      },
    });
    expect(wrapper.vm.search).toBe(null);
    wrapper.vm.editLink(1);
    expect(wrapper.vm.search).toBe("a test");
    wrapper.vm.search = null;
  });

  it("can remove a link", () => {
    wrapper.vm.removeLink(0);
    expect(
      recordStore.state.sections.dataAccess.data.support_links,
    ).toStrictEqual([
      {
        type: "Mailing list",
        url: { url: "test@example.com" },
        name: "a test",
      },
    ]);
  });

  it("can create a new link", () => {
    wrapper.vm.edit.template = {
      type: "TeSS links to training materials",
      url: { url: "https://example.com/tess.json", title: "a tess test" },
    };
    wrapper.vm.submitLink();
    let supportLinks = recordStore.state.sections.dataAccess.data.support_links;
    expect(supportLinks[supportLinks.length - 1].url.url).toBe(
      "https://example.com/tess",
    );
    wrapper.vm.edit.template = {
      id: 0,
      type: "Support email",
      url: "tete.tt@ww.kds.ls",
    };
    wrapper.vm.edit.id = 0;
    wrapper.vm.submitLink();
    expect(supportLinks[0]).toStrictEqual({
      id: 0,
      type: "Support email",
      url: "tete.tt@ww.kds.ls",
    });
  });

  it("can find a TeSS record", async () => {
    let response = await wrapper.vm.findTessRecord("abc");
    expect(response).toStrictEqual([
      { name: "ABC", url: "http://example.com" },
    ]);
  });

  it("can react to type change", async () => {
    wrapper.vm.edit.template = {
      type: "TeSS links to training materials",
      url: "ABC",
    };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.edit.template.url).toStrictEqual("ABC");
  });

  it("can build an item name", () => {
    expect(wrapper.vm.getIconName("test (123)")).toBe("test_123");
  });

  it("can get the index of recordData items", () => {
    const object = { type: "Other", url: "https://example.com/test" };
    wrapper.vm.$store.state.record.sections["dataAccess"].data.support_links = [
      {
        type: "Other",
        url: "https://example.com/other",
      },
      object,
    ];
    expect(wrapper.vm.getLinkIndex(object)).toBe(1);
  });

  it("can check rule computed property", () => {
    wrapper.vm.edit.template = {};
    expect(wrapper.vm.rule).toBe(null);

    wrapper.vm.edit.template = {
      type: "Other",
      url: "https://example.com/test",
    };
    expect(wrapper.vm.rule).toBe("url");
  });

  it("covers Add support link click", async () => {
    const addButton = wrapper.get(".shadowChip");

    await addButton.trigger("click");

    expect(wrapper.vm.edit.show).toBe(true);
    expect(wrapper.vm.edit.id).toBeNull();

    expect(wrapper.vm.edit.template).toEqual({
      type: null,
      url: { url: null },
      name: null,
    });
  });

  it("covers editing support links through icon and text clicks", async () => {
    const existing = {
      type: "Other",
      url: "https://example.com/test",
    };

    $store.state.record.sections.dataAccess.data.support_links = [existing];

    await wrapper.vm.$nextTick();

    const table = wrapper.get('[data-test="v-data-table"]');

    const editIcon = table
      .findAllComponents({ name: "VIcon" })
      .find((icon) => icon.text().includes("fa-pen"));

    expect(editIcon).toBeDefined();

    // Cover @click="editLink(getLinkIndex(links.raw))"
    await editIcon.trigger("click");
    expect(wrapper.vm.edit.show).toBe(true);
    expect(wrapper.vm.edit.id).toBe(0);

    wrapper.vm.hideOverlay();

    await wrapper.vm.$nextTick();

    // Cover the same handler on the support link text
    const linkText = table
      .findAll("div")
      .find((element) => element.text().trim() === existing.url);
    expect(linkText).toBeDefined();

    await linkText.trigger("click");
    expect(wrapper.vm.edit.show).toBe(true);
    expect(wrapper.vm.edit.id).toBe(0);
  });

  it("covers removing support links through the icon", async () => {
    $store.state.record.sections.dataAccess.data.support_links = [
      {
        type: "Other",
        url: "https://example.com/test",
      },
    ];

    await wrapper.vm.$nextTick();

    const table = wrapper.get('[data-test="v-data-table"]');

    const removeIcon = table
      .findAllComponents({ name: "VIcon" })
      .find((icon) => icon.text().includes("fa-times-circle"));

    expect(removeIcon).toBeDefined();

    // Cover @click="removeLink(getLinkIndex(links.raw))"
    await removeIcon.trigger("click");

    expect(wrapper.vm.recordData).toHaveLength(0);

    await wrapper.vm.$nextTick();

    // Cover the #no-data slot
    expect(table.text()).toContain(
      "This record does not have any support links.",
    );
  });

  it("covers dialog v-model update", async () => {
    wrapper.vm.newLink();

    await wrapper.vm.$nextTick();

    const dialog = wrapper.findComponent({
      name: "VDialog",
    });

    expect(dialog.exists()).toBe(true);
    expect(dialog.props("modelValue")).toBe(true);

    // Cover v-model update handler
    dialog.vm.$emit("update:modelValue", false);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.show).toBe(false);
  });

  it("covers form validation and support link type v-model", async () => {
    wrapper.vm.newLink();
    await wrapper.vm.$nextTick();

    const form = wrapper.findComponent({ name: "VForm" });

    expect(form.exists()).toBe(true);

    form.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.formValid).toBe(true);

    const select = wrapper.findComponent({ name: "VSelect" });

    expect(select.exists()).toBe(true);

    select.vm.$emit("update:modelValue", "Other");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.edit.template.type).toBe("Other");
    expect(wrapper.vm.rule).toBe("url");
  });

  it("covers support link URL v-model", async () => {
    wrapper.vm.newLink();
    await wrapper.vm.$nextTick();
    const select = wrapper.findComponent({ name: "VSelect" });
    select.vm.$emit("update:modelValue", "Other");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.rule).toBe("url");

    const urlField = wrapper
      .findAllComponents({ name: "VTextField" })
      .find((field) => field.props("label") === "Support link URL");

    expect(urlField).toBeDefined();
    urlField.vm.$emit("update:modelValue", "https://example.com/support");

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.edit.template.url.url).toBe(
      "https://example.com/support",
    );
  });

  it.each([
    ["email", "Support link email", "support@example.com"],
    ["email/url", "Support link email or url", "https://example.com/support"],
  ])(
    "covers %s input and support link name v-model",
    async (rule, label, value) => {
      const supportType = Object.keys(wrapper.vm.supportLinksTypes).find(
        (type) => wrapper.vm.supportLinksTypes[type] === rule,
      );

      expect(supportType).toBeDefined();

      wrapper.vm.newLink();
      await wrapper.vm.$nextTick();

      const select = wrapper.findComponent({ name: "VSelect" });

      expect(select.exists()).toBe(true);

      select.vm.$emit("update:modelValue", supportType);

      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.rule).toBe(rule);

      const input = wrapper
        .findAllComponents({ name: "VTextField" })
        .find((field) => field.props("label") === label);

      expect(input).toBeDefined();

      input.vm.$emit("update:modelValue", value);

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.edit.template.url.url).toBe(value);

      const nameField = wrapper
        .findAllComponents({ name: "VTextField" })
        .find((field) => field.props("label") === "Support link name");

      expect(nameField).toBeDefined();

      nameField.vm.$emit("update:modelValue", "Example Support");

      await wrapper.vm.$nextTick();

      expect(wrapper.vm.edit.template.url.title).toBe("Example Support");
    },
  );

  it("covers API autocomplete selection and search input v-model", async () => {
    const apiType = Object.keys(wrapper.vm.supportLinksTypes).find(
      (type) => wrapper.vm.supportLinksTypes[type] === "api",
    );

    expect(apiType).toBeDefined();

    wrapper.vm.newLink();
    await wrapper.vm.$nextTick();
    const select = wrapper.findComponent({ name: "VSelect" });
    select.vm.$emit("update:modelValue", apiType);
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.rule).toBe("api");
    const autocomplete = wrapper.findComponent({
      name: "VAutocomplete",
    });
    expect(autocomplete.exists()).toBe(true);

    const selectedRecord = {
      title: "Example Training Material",
      url: "https://example.com/training.json",
    };
    autocomplete.vm.$emit("update:modelValue", selectedRecord);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.edit.template.url).toEqual(selectedRecord);
    autocomplete.vm.$emit("update:searchInput", "training");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.search).toBe("training");
  });

  it("covers Submit support link button click", async () => {
    wrapper.vm.newLink();
    await wrapper.vm.$nextTick();
    await wrapper.setData({
      formValid: true,
      edit: {
        show: true,
        id: null,
        template: {
          type: "Other",
          url: {
            url: "https://example.com/support",
            title: "Example Support",
          },
          name: "Example Support",
        },
      },
    });
    const submitButton = wrapper
      .findAll("button.bg-success")
      .find((button) => button.text().trim() === "Submit support link");
    expect(submitButton).toBeDefined();
    expect(submitButton.attributes("disabled")).toBeUndefined();

    const initialLength = wrapper.vm.recordData.length;
    await submitButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.recordData).toHaveLength(initialLength + 1);
    expect(wrapper.vm.recordData.at(-1)).toMatchObject({
      type: "Other",
      name: "Example Support",
      url: {
        url: "https://example.com/support",
        title: "Example Support",
      },
    });
    expect(wrapper.vm.edit.show).toBe(false);
  });

  it("covers Cancel button click in support link dialog", async () => {
    wrapper.vm.newLink();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.edit.show).toBe(true);

    const cancelButton = wrapper
      .findAll("button.bg-error")
      .find((button) => button.text().trim() === "Cancel");
    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.edit.show).toBe(false);
    expect(wrapper.vm.edit.id).toBeNull();
    expect(wrapper.vm.edit.template).toBeNull();
  });

  it("groups support links by type", () => {
    const links = [
      { type: "Other", url: "https://example.com/one" },
      { type: "Mailing list", url: "test@example.com" },
      { type: "Other", url: "https://example.com/two" },
    ];

    const result = wrapper.vm.displayGroupData(links);

    expect(result).toEqual({
      Other: [links[0], links[2]],
      "Mailing list": [links[1]],
    });
    expect(wrapper.vm.displayGroupData([])).toEqual({});
  });
});
