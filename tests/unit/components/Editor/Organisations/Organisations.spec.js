import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import RestClient from "@/components/Client/RESTClient.js"
import getOrganisationsTypesQuery from "@/components/GraphClient/queries/Organisations/getOrganisationTypes.json"
import getOrganisationsQuery from "@/components/GraphClient/queries/Organisations/getOrganisations.json"
import getGrantsQuery from "@/components/GraphClient/queries/Organisations/getGrants.json"
import Organisations from "@/components/Editor/Organisations/Organisations.vue"
import recordStore from "@/store/record.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
const sinon = require("sinon");
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);
const vuetify = new Vuetify();

let organisation = {
    organisation: {
        name: "tester"
    },
    id: 1
};
recordStore.state.sections = {
    organisations: {
        error: false,
        data: [organisation],
        initialData: [JSON.parse(JSON.stringify(organisation))],
        changes: 0,
        message: null
    }
};
recordStore.state.currentRecord = {fairsharingRecord: { id: 123 }};
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

describe("Edit -> Organisations.vue", function() {
    let wrapper;
    let graphStub;
    let restStub;

    beforeAll(async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            fairsharingRecord: {
                organisationLinks: []
            }
        });
        graphStub.withArgs(getOrganisationsTypesQuery).returns({
            searchOrganisationTypes: [{id: 1, name: "Government body"}]
        });
        graphStub.withArgs(getOrganisationsQuery).returns({
            searchOrganisations: [{homepage: "test", id: 1, name: "anOrganisation", types: ["Government body"], urlForLogo: null}]});
        graphStub.withArgs(getGrantsQuery).returns({
            searchGrants: [{id: 1, name: "aGrant", description: null}]
        });
    });

    beforeEach(async () => {
        wrapper = await shallowMount(Organisations, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterAll(async() => {
        graphStub.restore();
    });

    it("can be mounted", async () => {
        expect(wrapper.name()).toMatch("Organisations");
    });

    it("can compute changes when adding, editing or removing a link", () => {
        wrapper.vm.organisationLinks.push({
            organisation: {
                name: "test"
            }
        });
        expect(wrapper.vm.sections.organisations.changes).toBe(1);
        wrapper.vm.organisationLinks[0].organisation.name = "another name";
        expect(wrapper.vm.sections.organisations.changes).toBe(2);
        wrapper.vm.removeRelation(0);
        expect(wrapper.vm.sections.organisations.changes).toBe(2);
    });

    it("can open the overlay", async () => {
        await wrapper.vm.showEditOverlay(null);
        expect(recordStore.state.editOrganisationLink.showOverlay).toBe(true);
        expect(recordStore.state.editOrganisationLink.data).toStrictEqual({});
        expect(editorStore.state.organisationsTypes).toStrictEqual([{id: 1, name: "Government body"}]);
        expect(editorStore.state.organisations).toStrictEqual([{homepage: "test", id: 1, name: "anOrganisation", types: ["Government body"], urlForLogo: null}]);
        expect(editorStore.state.grants).toStrictEqual([{id: 1, name: "aGrant", description: null}]);
        await wrapper.vm.showEditOverlay(0);
        expect(recordStore.state.editOrganisationLink).toStrictEqual({
            showOverlay: true,
            id: 0,
            data: {organisation: {name: "test"}}
        });
    });

    it("can save the current data", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: {}});
        recordStore.state.sections.organisations = {
            error: false,
            data: [organisation, {
                organisation: {
                    name: "another name"
                },
                grant: {id: 123},
                id: 2
            }],
            initialData: [JSON.parse(JSON.stringify(organisation)), {
                organisation: {
                    name: "another name"
                },
                id: 2
            }],
            changes: 0,
            message: null
        };
        wrapper.vm.removeRelation(0);
        wrapper.vm.organisationLinks[0].organisation.name = "changing name";
        wrapper.vm.organisationLinks.push({organisation: {name: "a third organisation"}});
        await wrapper.vm.saveRecord(false);
        expect($router.push).toHaveBeenCalledTimes(0);
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        recordStore.state.sections = {
            organisations: {
                error: false,
                data: [organisation],
                initialData: [JSON.parse(JSON.stringify(organisation))],
                changes: 0,
                message: null
            }
        };
        restStub.restore();
        jest.clearAllMocks();

    });

    it("can handle error upon saving the data", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        wrapper.vm.removeRelation(0);
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data: {error: "I am an error"}});
        await wrapper.vm.saveRecord(false);
        expect(recordStore.state.sections.organisations.error).toBe(true);
        restStub.restore();
        jest.clearAllMocks();
    });

});
