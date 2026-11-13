import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import sinon from "sinon";
import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";

// This is so the validation hacks work when testing.
// See: https://github.com/FAIRsharing/fairsharing.github.io/issues/1732
const VueFormStub = {
  name: "v-form",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  template: "<form><slot /></form>",
  methods: {
    validate: () => {},
  },
};

recordStore.state.sections = {
  generalInformation: {
    data: {
      countries: [
        { label: "France", id: 1 },
        { label: "UK", id: 2 },
      ],
      metadata: {},
      type: { name: "test" },
      logo: [],
    },
  },
};

recordStore.state.newRecord = false;
userStore.state.user().is_curator = false;
userStore.state.user().credentials.token = "a token";

const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
    users: userStore,
  },
});

const $route = {
  path: "/create",
};

const $router = {
  push: vi.fn(),
  currentRoute: {
    path: "/edit/123",
  },
};

let wrapper;

describe("Editor -> BaseFields.vue", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_ENDPOINT", "https://api.example.test");
    $store.state.record.newRecord = false;
    $store.state.users.user = function () {
      return { is_curator: false, credentials: { token: "a token" } };
    };
    wrapper = shallowMount(BaseFields, {
      global: {
        plugins: [$store],
        mocks: { $route, $router },
        stubs: {
          "v-form": VueFormStub,
          VForm: VueFormStub,
        },
      },
      props: {
        createMode: false,
        submitRecord: false,
        loading: false,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllEnvs();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("BaseFields");
    expect(wrapper.vm.$route.path).toEqual("/create");
  });

  it("can remove a country", () => {
    wrapper.vm.removeCountry({ id: 1, label: "France" });
    expect(wrapper.vm.fields.countries.length).toBe(1);
  });

  it("disables type field except for new records and curators", () => {
    $store.state.users.user = function () {
      return { is_curator: false, credentials: { token: "a token" } };
    };
    expect(wrapper.vm.typeChangeDisabled()).toBe(true);
    $store.state.record.newRecord = true;
    expect(wrapper.vm.typeChangeDisabled()).toBe(false);

    $store.state.users.user = function () {
      return { is_curator: true, credentials: { token: "a token" } };
    };
    $store.state.record.newRecord = false;
    expect(wrapper.vm.typeChangeDisabled()).toBe(false);
  });

  it("sets the submitAnyway flag", () => {
    expect(wrapper.vm.submitAnywayDisabled).toBe(false);
    wrapper.vm.submitAnyway();
    expect(wrapper.vm.submitAnywayDisabled).toBe(true);
  });

  it("runs the tryAgain method", () => {
    wrapper.vm.fields.metadata.homepage = "aaaa";
    wrapper.vm.fields.metadata.name = "aaaa";
    wrapper.vm.fields.metadata.abbreviation = "aaaa";
    wrapper.vm.tryAgain();
    expect(wrapper.vm.fields.metadata.homepage).toBe(null);
    expect(wrapper.vm.fields.metadata.name).toBe(null);
    expect(wrapper.vm.fields.metadata.abbreviation).toBe(null);
  });

  it("sets the disableSubmit variable correctly", async () => {
    $store.state.editor.possibleDuplicates = [{ record: "a record" }];
    wrapper.vm.formValid = false;
    await wrapper.setProps({ submitRecord: false });
    expect(wrapper.vm.disableSubmit()).toBe(true);
    wrapper.vm.formValid = true;
    expect(wrapper.vm.disableSubmit()).toBe(true);
    $store.state.editor.possibleDuplicates = [];
    wrapper.vm.formValid = true;
    await wrapper.setProps({ submitRecord: false });
    expect(wrapper.vm.disableSubmit()).toBe(false);
  });

  it("can delete the logo", async () => {
    const originalRecord = $store.state.record.currentRecord.fairsharingRecord;
    $store.state.record.currentRecord.fairsharingRecord = {
      ...originalRecord,
      id: 123,
      urlForLogo: "/logos/test.png",
    };
    const logoStub = sinon.stub(RestClient.prototype, "clearLogo");
    try {
      logoStub.resolves({ error: "error" });
      await wrapper.setData({ currentLogo: "placeholder" });
      expect(wrapper.findComponent({ name: "VImg" }).props("src")).toBe(
        "https://api.example.test/logos/test.png",
      );
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toEqual("placeholder");
      expect(logoStub.calledOnceWithExactly(123, "a token")).toBe(true);
      expect(wrapper.vm.logoLoading).toBe(false);

      logoStub.resolves({});
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toBeNull();
      expect(wrapper.findComponent({ name: "VImg" }).exists()).toBe(false);
      expect(logoStub.calledTwice).toBe(true);
      expect(wrapper.vm.logoLoading).toBe(false);
    }
    finally {
      logoStub.restore();
      $store.state.record.currentRecord.fairsharingRecord = originalRecord;
    }
  });

  it("can check isDatabase method", async () => {
    wrapper.vm.fields.type = { name: "repository" };
    expect(wrapper.vm.isDatabase()).toBe(true);
    // wrapper.vm.fields.type = { name: "test" };
    // expect(wrapper.vm.isDatabase()).toBe(false);
  });
});
