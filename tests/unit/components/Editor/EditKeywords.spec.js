import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editKeywords from "@/components/Editor/EditKeywords.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";

import GraphClient from "@/components/GraphClient/GraphClient.js";
import RestClient from "@/components/Client/RESTClient.js"
import domainsQuery from "@/components/GraphClient/queries/getDomains.json"
import subjectsQuery from "@/components/GraphClient/queries/getSubjects.json"
import taxonomiesQuery from "@/components/GraphClient/queries/getTaxonomies.json"
import userTagsQuery from "@/components/GraphClient/queries/getUserDefinedTags.json"

import keywordsFixture from "../../../fixtures/getKeywords.json"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

userStore.state.user().credentials.token = "thisisatoken";
recordStore.state.currentRecord = {
    fairsharingRecord: {
        domains: null,
        subjects: [
            {
                "label": "subjectTest",
                "id": 1,
                "type": "subjects"
            }
        ],
        taxonomies: [
            {
                "label": "speciesTest",
                "id": 2,
                "type": "species"
            }
        ],
        userDefinedTags: null
    }
};
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore
    }
});
let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };

let graphStub;

describe("EditKeywords.vue", function() {
    let wrapper;

    beforeEach( async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(domainsQuery).returns(keywordsFixture.keywords['domains']);
        graphStub.withArgs(subjectsQuery).returns(keywordsFixture.keywords['subjects']);
        graphStub.withArgs(taxonomiesQuery).returns(keywordsFixture.keywords['taxonomies']);
        graphStub.withArgs(userTagsQuery).returns(keywordsFixture.keywords['userDefinedTags']);
        wrapper = await shallowMount(editKeywords, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        // I don't know why but without triple nextTick the component doesn't want to async mount.
        delete wrapper.vm.showTypes[3];
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
        await wrapper.vm.$nextTick();
    });

    afterEach(() => {
        graphStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditKeywords");
    });

    it("can react to keywords changes", () => {
        const newDomain = {
            "label": "domainTest",
            "id": 1,
            "type": "domains"
        };
        wrapper.vm.selectedKeywords.push(newDomain);
        expect(wrapper.vm.recordKeywords[2]).toStrictEqual(newDomain);
        expect(wrapper.vm.recordKeywords).toStrictEqual(wrapper.vm.selectedKeywords);
    });

    it("can remove a keyword from the selected ones", () => {
        wrapper.vm.removeKeyword({
            label: 'speciesTest',
            id: 2,
        });
        expect(wrapper.vm.recordKeywords).toStrictEqual(wrapper.vm.selectedKeywords);
        expect(wrapper.vm.recordKeywords).toStrictEqual([{
            label: "subjectTest",
            id: 1,
            type: "subjects"
        }])
    });

    it("can create a new term", async () => {
        let restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                label: "anotherTerm",
                id: 1
            }
        });
        wrapper.vm.selectedKeywords = [];
        wrapper.vm.search = "anotherTerm";
        await wrapper.vm.createNewTerm();
        expect(wrapper.vm.selectedKeywords[0]).toStrictEqual({
            label: "anotherTerm",
            id: 1,
            type: "userDefinedTags"
        });
        restStub.restore();
    });

    it("can create a new record", async () => {
        let restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                data: {
                    id: 123
                }
            }
        });
        await wrapper.vm.submitRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
        restStub.restore();
    });

    it("can process errors", async () => {
        let restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data:{
                error: {
                    response: {
                        statusText: "I am an error"
                    }
                }
            }
        });
        await wrapper.vm.submitRecord();
        expect($router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.error).toMatch("I am an error");
        restStub.restore();
    });

});
