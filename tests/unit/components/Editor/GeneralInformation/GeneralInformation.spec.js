import Vue from "vue"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import GeneralInfo from "@/components/Editor/GeneralInformation/GeneralInformation.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import RestClient from "@/lib/Client/RESTClient.js"
import countriesQuery from "@/lib/GraphClient/queries/getCountries.json"
import typesQuery from "@/lib/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/lib/GraphClient/queries/geTags.json"
const sinon = require("sinon");
const VueScrollTo = require('vue-scrollto');
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);
const vuetify = new Vuetify();
const blob = new Blob(['image/jpg']);
const mFile = new File([blob], 'img.jpeg', {
    type: 'image/jpeg',
});


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
    maintainers: [{username: 'bod', id: 100, orcid: 'abc-123'}],
    watchers: [{username: 'bod', id: 100, orcid: 'abc-123'}],
    userDefinedTags: [],
    type: 'abc',
    status: "ready",
    name: "ok",
    registry: "test",
    logo:[{filename: "SMALLER_for_1.9mb.jpg",content_type: "image/jpeg",data: mFile},{filename: "SMALLER_for_2mb.jpg",content_type: "image/jpeg",data: mFile}]
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

        const fileContents       = 'data:image/png;base64,TEST1';
        const readAsDataURL      = jest.fn();
        const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
            target: {result: fileContents}} )});
        const dummyFileReader    = {addEventListener, readAsDataURL, result: fileContents};
        window.FileReader        = jest.fn(() => dummyFileReader);

        // jest.mock('toBase64', () => Promise.resolve('value'))

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
        expect(wrapper.vm.$options.name).toMatch("GeneralInformation");
        // expect(wrapper.vm.currentFields).toStrictEqual(wrapper.vm.initialFields);
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
        wrapper.vm.currentFields.deprecation_reason = null;
        wrapper.vm.currentFields.status = "uncertain";
        expect(wrapper.vm.currentFields.deprecation_reason).toBeFalsy();
        wrapper.vm.currentFields.type.name = "collection";
        expect(wrapper.vm.currentFields.status).toBe("uncertain");
        wrapper.vm.currentFields.type.name = "collection"; // For coverage purposes...

        wrapper.vm.currentFields.type.name = "abc";
        await wrapper.vm.currentFields.metadata.contacts.push({name: 'test'});
        expect(wrapper.vm.getChanges['generalInformation']).toBe(2);
        await wrapper.vm.currentFields.domains.push({
            label: 'test',
            id: 1
        });
        expect(wrapper.vm.getChanges['generalInformation']).toBe(3);
        await wrapper.vm.currentFields.domains.splice(1,1);
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
            name: "none",
        });
        wrapper.vm.currentFields.metadata.deprecation_reason = "should be deleted" // non-deprecated records should delete this
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.currentFields.metadata.deprecation_reason).toBeFalsy();
        wrapper.vm.currentFields.status = "deprecated"
        wrapper.vm.currentFields.metadata.deprecation_reason = "should not be deleted" // now it's deprecated this should remain
        await wrapper.vm.saveRecord(true, true);
        expect(wrapper.vm.currentFields.metadata.deprecation_reason).toEqual("should not be deleted");
        wrapper.vm.currentFields.type = {id: 789};
        await wrapper.vm.saveRecord(false, false);
        expect($router.push).toHaveBeenCalledTimes(2);
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

    it("deals with type changes", async () => {
        expect(wrapper.vm.formatType({name: 'wibble'})).toEqual('wibble');
        expect(wrapper.vm.formatType('wibble')).toEqual('wibble');
        wrapper.vm.currentFields.type = 'xyz';
        await wrapper.vm.checkTypeChange();
        expect(wrapper.vm.showTypeChanged).toBe(true);
    });


});
