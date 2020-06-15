import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editPublications from "@/components/Editor/EditPublications.vue"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
// import RestClient from "../../../../src/components/Client/RESTClient.js"
import ExternalClient from "../../../../src/components/Client/ExternalClients.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        publications: [
            {
                name: "Hello",
                id: 1
            }
        ]
    }
};
userStore.state.user().credentials.token = "thisisatoken";
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
//let restStub;
let fetchStub;

const article = '@article{Culliton_1989,' +
    'doi = {10.1126/science.2781281},' +
    'url = {https://doi.org/10.1126%2Fscience.2781281},' +
    'year = 1989,' +
    'month = {sep},' +
    'publisher = {American Association for the Advancement of Science ({AAAS})},' +
    'volume = {245},' +
    'number = {4924},' +
    'pages = {1325--1325},' +
    'author = {B. Culliton},' +
    'title = {Gene transfer test: so far, so good},' +
    'journal = {Science} }';


describe("EditLicences.vue", function() {
    let wrapper;

    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchLicences: []
        });
        wrapper = shallowMount(editPublications, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    afterEach( () => {
        graphStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditPublications");
    });

    it("can get a DOI and process related errors", async () => {
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data:article});
        const expectedArticle = {
            authors: 'B. Culliton',
            doi: '10.1126/science.2781281',
            title: 'Gene transfer test: so far, so good',
            journal: 'Science',
            url: 'https://doi.org/10.1126/science.2781281',
            year: 1989
        };
        wrapper.vm.search = 'amIaDoi?';
        await wrapper.vm.getDOI();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedArticle);
        fetchStub.restore();
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {error: 'Im an error'}});
        await wrapper.vm.getDOI();
        expect(wrapper.vm.errors.doi).toBe(true);
        fetchStub.restore();
    });

    it("can get a PMID and process related errors", async () => {
        let returnedData = {
            title: "title",
            fulljournalname: "journal",
            pubdate: "year",
            authors: [
                {
                    name: "authorName"
                },
                {
                    name: "otherAuthor"
                }
            ],
            uid: "pmid",
            elocationid: "pii: S0092-8674(20)30740-6. doi: 10.1016/j.cell.2020.06.009"
        };
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {result: {test: returnedData}}});
        let expectedOutput = {
            title: "title",
            journal: "journal",
            year: "year",
            authors: "authorName, otherAuthor",
            pubmed_id: "pmid",
            doi: '10.1016/j.cell.2020.06.009',
            url: 'https://doi.org/10.1016/j.cell.2020.06.009'
        };
        wrapper.vm.search = "test";
        await wrapper.vm.getPMID();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedOutput);
        fetchStub.restore();

        // NO PMID PROCESS
        returnedData.elocationid = null;
        delete expectedOutput.doi;
        delete expectedOutput.url;
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {result: {test: returnedData}}});
        wrapper.vm.search = "test";
        await wrapper.vm.getPMID();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedOutput);
        fetchStub.restore();

        // ERROR PROCESS
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {error: 'Im an error'}});
        await wrapper.vm.getPMID();
        expect(wrapper.vm.errors.pmid).toBe(true);
        fetchStub.restore();
    });

    it("can add/remove a publication to the array of publications", () => {
        wrapper.vm.newPublication = {}
    });


});
