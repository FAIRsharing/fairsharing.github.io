import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router";
import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();


recordStore.state.sections = {
    generalInformation: {
        data: {
            countries: [
                {label: 'France', id: 1},
                {label: 'UK', id: 2}
            ],
            metadata: {},
            type: {name: 'test'},
            logo:[]
        }
    }
};

recordStore.state.newRecord = false;
userStore.state.user().is_curator = false;
userStore.state.user().credentials.token = 'a token';

const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
    }
});

const $route = {
    path: "/create"
};
const router = new VueRouter();
const $router = { push: jest.fn() };

let wrapper;

describe('Editor -> BaseFields.vue', () => {

    beforeAll(() => {

        wrapper = shallowMount(BaseFields, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("BaseFields");
        expect(wrapper.vm.$route.path).toEqual('/create');
    });

    it("can remove a country", () => {
        wrapper.vm.removeCountry({id: 1, label: 'France'});
        expect(wrapper.vm.fields.countries.length).toBe(1);
    });

    it("disables type field except for new records and curators", () => {
        userStore.state.user = function(){
            return { is_curator: false, credentials:{token:'a token'} }
        };
        expect(wrapper.vm.typeChangeDisabled()).toBe(true);
        recordStore.state.newRecord = true;
        expect(wrapper.vm.typeChangeDisabled()).toBe(false);

        userStore.state.user = function(){
            return { is_curator: true, credentials:{token:'a token'} }
        };
        recordStore.state.newRecord = false;
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

    // TODO: More information needed about what this test is supposed to be doing.
    it("can call changeLogoData", async () => {
        let blob = new Blob(["alongstringofdata"], {type: 'text/plain'});
        let data = {
            filename: 'testfile.jpg',
            data: blob,
            content_type: "image/png"
        }
        await wrapper.vm.changeLogoData([data]);
        expect(wrapper.vm.fields.logo).toStrictEqual({
            filename: 'testfile.jpg',
            data: "alongstringofdata",
            content_type: "image/png"
        });
        await wrapper.vm.changeLogoData([]);
        expect(wrapper.vm.fields.logo).toStrictEqual({});
    });

});
