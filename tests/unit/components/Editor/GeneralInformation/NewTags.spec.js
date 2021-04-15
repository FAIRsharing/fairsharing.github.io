import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import NewTags from "@/components/Editor/GeneralInformation/NewTags.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);
const vuetify = new Vuetify();

editorStore.state.allTags = [
    {label: "not abc", model: "subject"}
];
recordStore.state.sections = {
    generalInformation: {data: {userDefinedTags: []}}
};
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore
    }
});

let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();

let wrapper;

describe('Editor -> NewTags.vue', () => {

    beforeAll(() => {
        wrapper = shallowMount(NewTags, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("NewTags");
    });

    it("can add a term to the add list", () => {
        wrapper.vm.addTerm();
        expect(wrapper.vm.error).toBe(false);
        wrapper.vm.newTerm = " abc ";
        wrapper.vm.addTerm();
        expect(wrapper.vm.newTags).toStrictEqual(["abc"]);
        expect(wrapper.vm.newTerm).toBe(null);
        wrapper.vm.newTerm = "not abc";
        wrapper.vm.addTerm();
        expect(wrapper.vm.error).toBe('Term not abc already declared as a subject');
        wrapper.vm.newTerm = "abc";
        wrapper.vm.addTerm();
        expect(wrapper.vm.error).toBe("Term abc is already in creation list");
    });

    it("can remove a term from add list", () => {
        wrapper.vm.newTags = ["def", "ijk"];
        wrapper.vm.removeItem('def');
        expect(wrapper.vm.newTags).toStrictEqual(["ijk"]);
        wrapper.vm.removeItem("test");
        expect(wrapper.vm.newTags).toStrictEqual(["ijk"]);
    });

    it('can add the add list to the record', () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.newTags = ["def", "ijk"];
        wrapper.vm.createTerms();
        expect(wrapper.vm.newTags).toStrictEqual([]);
        expect(wrapper.vm.loading).toStrictEqual(false);
        expect(wrapper.vm.showOverlay).toStrictEqual(false);
        jest.clearAllMocks();
    });
});
