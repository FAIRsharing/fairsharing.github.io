import Vue from "vue"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import GeneralInfo from "@/components/Editor/GeneralInformation/GeneralInformation.vue"
import recordStore from "@/store/record.js"
import editorStore from "@/store/editor.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import recordQuery from "@/components/GraphClient/queries/getRecord.json"
import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/components/GraphClient/queries/geTags.json"
const sinon = require("sinon");
const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

// mock store ??

const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore
    }
});

let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };


describe("Edit -> GeneralInformation.vue", function() {
    let wrapper;
    let graphStub;

    beforeAll( async () => {
        recordQuery.queryParam = {id: 123};
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(recordQuery).returns({
            fairsharingRecord: {
                id: 123,
                metadata: {
                    contacts: []
                },
                type: 'abc',
                status: "ready",
                domains: [{
                    label: 'tester',
                    id: 2
                }]
            }
        });
        graphStub.withArgs(countriesQuery).returns({
            searchCountries: [
                {label: "france", id: 33}
            ]
        });
        graphStub.withArgs(typesQuery).returns({
            fairsharingRegistries: {
                records: [{
                    name: "Standard",
                    recordTypes: [{
                        name: "terminology",
                        id: 1,
                        description: "abc"
                    }]
                }],
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
    });

    it("can be instantiated", async () => {
        expect(wrapper.name()).toMatch("GeneralInformation");
        expect(wrapper.vm.fields.current).toStrictEqual(wrapper.vm.fields.initial);
        await Vue.nextTick();
        await wrapper.vm.getData();
        expect(wrapper.vm.fields.current.type).toBe("abc");
    });

    it("can react to changes to fields.current", () => {
        wrapper.vm.fields.current.type = {name: "abc"};
        expect(wrapper.vm.fields.current.status).toBe("ready");
        wrapper.vm.fields.current.type.name = "collection";
        expect(wrapper.vm.fields.current.status).toBe(null);
        wrapper.vm.fields.current.status = "ready";
        wrapper.vm.fields.current.type.name = "repository";
        expect(wrapper.vm.databaseWarning).toBe(true);
        wrapper.vm.fields.current.deprecation_reason = "abc";
        wrapper.vm.fields.current.status = "deprecated";
        expect(wrapper.vm.fields.current.deprecation_reason).toBe("");
        wrapper.vm.fields.current.deprecation_reason = "abc";
        expect(wrapper.vm.fields.current.deprecation_reason).toBe("abc");

        wrapper.vm.fields.current.type.name = "abc";
        wrapper.vm.fields.current.metadata.contacts.push({name: 'test'});
        expect(wrapper.vm.getChanges['generalInformation']).toBe(3);
        wrapper.vm.fields.current.domains.push({
            label: 'test',
            id: 1
        });
        expect(wrapper.vm.getChanges['generalInformation']).toBe(4);
        wrapper.vm.fields.current.domains.splice(1,1);
        expect(wrapper.vm.getChanges['generalInformation']).toBe(3);
        wrapper.vm.fields.current.domains = [{
            label: 'tester',
            id: 2,
            model: "wtf"
        }];
        expect(wrapper.vm.getChanges['generalInformation']).toBe(3);
    });

    it("can save record", async () => {
        let data = await wrapper.vm.saveRecord(true);
        expect(data).toBe(true);
    });

});
