import Vue from "vue"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import GeneralInfo from "@/components/Editor/GeneralInformation/GeneralInformation.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import RestClient from "@/components/Client/RESTClient.js"
import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/components/GraphClient/queries/geTags.json"
const sinon = require("sinon");
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);
const vuetify = new Vuetify();

let record = {
    id: 123,
    metadata: {
        contacts: [],
        support_links: []
    },
    countries: [{id: 1}],
    subjects: [{id: 2, label: "Abc"}],
    taxonomies: [{id: 2, label: "Nope"}],
    domains: [{label: 'tester', id: 2}],
    userDefinedTags: [],
    type: 'abc',
    status: "ready",
    name: "ok",
    registry: "test"
};
recordStore.state.sections = {
    generalInformation: {
        error: false,
        data: record,
        initialData: JSON.parse(JSON.stringify(record)),
        changes: 0,
        message: null
    }
};
userStore.state.user().credentials.token = 123;

const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
    }
});

let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };


describe("Edit -> GeneralInformation.vue", function() {
    let wrapper;
    let graphStub;

    beforeAll( async () => {
        Vue.config.silent = true;
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(countriesQuery).returns({
            searchCountries: [
                {label: "france", id: 33}
            ]
        });
        graphStub.withArgs(typesQuery).returns({
            fairsharingRegistries: {
                records: [
                    {
                        name: "Standard",
                        recordTypes: [{
                            name: "terminology",
                            id: 1,
                            description: "abc"
                        }]
                    },
                    {
                        name: "Collection",
                        recordTypes: [{
                            name: "collection",
                            id: 3,
                            description: "abc"
                        }]
                    }
                ],
            }
        });
        graphStub.withArgs(tagsQuery).returns({
            searchTags: [
                {label: "abc", id: 1, model: "domain"}
            ]
        });
        wrapper = await shallowMount(GeneralInfo, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterAll(() => {
        graphStub.restore();
        Vue.config.silent = false;
    });

    it("can be mounted", async () => {
        expect(wrapper.name()).toMatch("GeneralInformation");
        expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
        await wrapper.vm.getData();
        expect(wrapper.vm.currentFields.type).toBe("abc");
        expect(wrapper.vm.message.type()).toBe("success");
        recordStore.state.sections.generalInformation.error = true;
        expect(wrapper.vm.message.type()).toBe("error");
        recordStore.state.sections.generalInformation.error = false;
        expect(wrapper.vm.section).toStrictEqual(recordStore.state.sections.generalInformation);
    });

    it("can react to changes to currentFields", async () => {
        wrapper.vm.currentFields.type = {name: "abc"};
        expect(wrapper.vm.currentFields.status).toBe("ready");
        wrapper.vm.currentFields.deprecation_reason = "abc";
        wrapper.vm.currentFields.status = "deprecated";
        expect(wrapper.vm.currentFields.deprecation_reason).toBe("abc");
        wrapper.vm.currentFields.status = "uncertain";
        expect(wrapper.vm.currentFields.deprecation_reason).toBe("");
        wrapper.vm.currentFields.type.name = "collection";
        expect(wrapper.vm.currentFields.status).toBe(null);

        wrapper.vm.currentFields.type.name = "abc";
        wrapper.vm.currentFields.metadata.contacts.push({name: 'test'});
        expect(wrapper.vm.getChanges['generalInformation']).toBe(2);
        wrapper.vm.currentFields.domains.push({
            label: 'test',
            id: 1
        });
        expect(wrapper.vm.getChanges['generalInformation']).toBe(3);
        wrapper.vm.currentFields.domains.splice(1,1);
        expect(wrapper.vm.getChanges['generalInformation']).toBe(2);
        wrapper.vm.currentFields.domains = [{
            label: 'tester',
            id: 2,
            model: "wtf"
        }];
        expect(wrapper.vm.getChanges['generalInformation']).toBe(2);

        wrapper.vm.initialized = false;
        await Vue.nextTick();
        wrapper.vm.currentFields.name = "???";
        expect(wrapper.vm.getChanges['generalInformation']).toBe(2);
    });

    it("can save record", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.currentFields.userDefinedTags = [
            {label: "newUserDefinedTag"},
            {label: "existingUserDefinedTag", id:555}
        ];
        let tagStub = sinon.stub(RestClient.prototype, "createNewUserDefinedTag");
        tagStub.returns({
            id: 666,
            label: "newUserDefinedTag"
        });
        let postStub = sinon.stub(RestClient.prototype, "updateRecord");
        postStub.returns({
            registry: "test",
            name: "none"
        });
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
        wrapper.vm.currentFields.type = {id: 789};
        await wrapper.vm.saveRecord(false);
        expect($router.push).toHaveBeenCalledTimes(1);
        tagStub.restore();
        postStub.restore();
        jest.clearAllMocks();
        postStub = sinon.stub(RestClient.prototype, "updateRecord");
        postStub.returns({error: {response: {data: "error"}}});
        tagStub = sinon.stub(RestClient.prototype, "createNewUserDefinedTag");
        tagStub.returns({
            error: {response: {data: "error"}}
        });
        await wrapper.vm.saveRecord(false);
        expect(wrapper.vm.message.error).toBe(true);
        postStub.restore();
        tagStub.restore();
    });

    it("can raise a no species error", async () => {
        wrapper.vm.currentFields.taxonomies = [];
        await wrapper.vm.saveRecord(false);
        expect(wrapper.vm.message.error).toBe(true);
    });


});
