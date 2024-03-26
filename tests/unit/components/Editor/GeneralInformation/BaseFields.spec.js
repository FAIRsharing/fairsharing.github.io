import { createLocalVue, shallowMount } from '@vue/test-utils'
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuetify from "vuetify"
import Vuex from "vuex"

import BaseFields from "@/components/Editor/GeneralInformation/BaseFields.vue"
import RestClient from "@/lib/Client/RESTClient.js"
import editorStore from "@/store/editor.js"
import recordStore from "@/store/recordData.js"
import userStore from "@/store/users.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

// This is so the validation hacks work when testing.
// See: https://github.com/FAIRsharing/fairsharing.github.io/issues/1732
const VueFormStub = {
    render: () => {},
    methods: {
        validate: () => {}
    }
}


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
            mocks: {$store, $route, $router},
            stubs: { 'v-form': VueFormStub },
            propsData: {
                createMode: false,
                submitRecord:false,
                loading:false
            },
        });
    });

    it("can be mounted", () => {
        expect(wrapper.vm.$options.name).toMatch("BaseFields");
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


    it("sets the disableSubmit variable correctly", () => {
        editorStore.state.possibleDuplicates = [{record: "a record"}];
        wrapper.vm.formValid = false;
        wrapper.vm.submitRecord = false;
        expect(wrapper.vm.disableSubmit()).toBe(true);
        wrapper.vm.formValid = true;
        expect(wrapper.vm.disableSubmit()).toBe(true);
        editorStore.state.possibleDuplicates = [];
        wrapper.vm.formValid = true;
        wrapper.vm.submitRecord = false;
        expect(wrapper.vm.disableSubmit()).toBe(false);
    });

    it("can delete the logo", async () => {
      let logoStub = sinon.stub(RestClient.prototype, "clearLogo");
      logoStub.returns({error: "error"});
      wrapper.vm.currentLogo = "placeholder";
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toEqual("placeholder");
      logoStub.returns({});
      await wrapper.vm.deleteLogo();
      expect(wrapper.vm.currentLogo).toBeNull();
    });

});
