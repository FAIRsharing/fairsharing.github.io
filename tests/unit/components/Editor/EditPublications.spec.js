import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import editPublications from "@/components/Editor/EditPublications.vue"
import recordStore from "@/store/record.js";
import editorStore from "@/store/editor.js";
import userStore from "@/store/users.js";
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RestClient from "@/components/Client/RESTClient.js"
import ExternalClient from "@/components/Client/ExternalClients.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const VueScrollTo = require('vue-scrollto');
localVue.use(VueScrollTo);

let pubs = [
    {
        title: "Hello",
        id: 1
    },
    {
        title: "World",
        id: 2
    }
];

recordStore.state.sections = {
    publications: {
        data: pubs,
        error: false,
        changes: 0,
        initialData: JSON.parse(JSON.stringify(pubs))
    },
    generalInformation: {
        data: {
            metadata: {
                citations: [
                    {publication_id: 2}
                ]
            },
        }
    },
    record: {fairsharingRecord: {id: 1243}}
};
recordStore.state.sections.publications.data[0].tablePosition = 123;
editorStore.state.availablePublications = [{
    title: "World",
    id: 2
}];
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        users: userStore,
        record: recordStore,
        editor: editorStore
    }
});
let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
const $router = { push: jest.fn() };

let graphStub;
let restStub;
let fetchStub;

const article = {
    "container-title-short": "Science",
    "DOI": "10.1126/science.2781282",
    "title": "Contragestion and other clinical applications of {RU} 486, an antiprogesterone at the receptor",
    "URL": "https://doi.org/10.1126%2Fscience.2781282",
    "created": {
        "date-parts": [
            1989,3,2
        ]
    },
    "author": [
        {
            "given": "E.",
            "family": "Baulieu"
        }
    ],
}


describe("EditPublications.vue", function() {
    let wrapper;
    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchPublications: [
                { title: "Hello", id: 1 },
                { title: "title", doi: "123" },
                { title: "title"}
            ]
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
        expect(wrapper.name()).toMatch("EditPublications")
        expect(wrapper.vm.section.data).toStrictEqual(recordStore.state.sections.publications.data);
        expect(wrapper.vm.metadata).toStrictEqual(recordStore.state.sections.generalInformation.data.metadata);
        expect(wrapper.vm.message.type()).toBe("success");
        recordStore.state.sections.publications.error = true;
        expect(wrapper.vm.message.type()).toBe("error");
        recordStore.state.sections.publications.error = false;
    });

    it("can get a DOI and process related errors", async () => {
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data:article});
        const expectedArticle = {
            authors: 'Baulieu, E.; ',
            doi: '10.1126/science.2781282',
            title: 'Contragestion and other clinical applications of {RU} 486, an antiprogesterone at the receptor',
            journal: 'Science',
            url: 'https://doi.org/10.1126%2Fscience.2781282',
            year: 1989,
            isCitation: false,
        };
        wrapper.vm.search = 'amIaDoi?';
        await wrapper.vm.getDOI();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedArticle);
        fetchStub.restore();
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {error: {response: { data: 'Im an error'}}}});
        await wrapper.vm.getDOI();
        expect(wrapper.vm.errors.doi).toBe(true);
        fetchStub.restore();
    });

    it("can get a PMID and process related errors", async () => {
        let returnedData = {
            title: "title",
            fulljournalname: "journal",
            sortpubdate: "2002/10/10 00:00",
            authors: [
                {
                    name: "authorName"
                },
                {
                    name: "otherAuthor"
                }
            ],
            uid: "pmid",
            elocationid: "pii: S0092-8674(20)30740-6. doi: 10.1016/j.cell.2020.06.009",
        };
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {result: {test: returnedData}}});
        let expectedOutput = {
            title: "title",
            journal: "journal",
            year: 2002,
            authors: "authorName, otherAuthor",
            pubmed_id: "pmid",
            doi: '10.1016/j.cell.2020.06.009',
            url: 'https://doi.org/10.1016/j.cell.2020.06.009',
            isCitation: false
        };
        wrapper.vm.search = "test";
        await wrapper.vm.getPMID();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedOutput);
        fetchStub.restore();

        // NO PMID PROCESS
        returnedData.elocationid = null;
        delete expectedOutput.doi;
        delete expectedOutput.url;
        expectedOutput.url = "https://pubmed.ncbi.nlm.nih.gov/test";
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {result: {test: returnedData}}});
        wrapper.vm.search = "test";
        await wrapper.vm.getPMID();
        expect(wrapper.vm.newPublication).toStrictEqual(expectedOutput);
        fetchStub.restore();

        // ERROR PROCESS
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data: {error: {response: {data: 'Im an error'}}}});
        await wrapper.vm.getPMID();
        expect(wrapper.vm.errors.pmid).toBe(true);
        fetchStub.restore();
    });

    it("can add/remove a publication to the array of publications", async () => {
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({data: {id: 123, title: "Im a publication"}});
        wrapper.vm.newPublication = {title: "title"};
        await wrapper.vm.addPublication();
        expect(wrapper.vm.search).toBe("title");
        expect(wrapper.vm.publications[2]).toStrictEqual({id: 123, tablePosition: 3, title: "Im a publication"});
        expect(wrapper.vm.publications.length).toBe(3);
        restStub.restore();

        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({data: {id: 456}});
        wrapper.vm.currentPublicationIndex = 2;
        wrapper.vm.newPublication = {pubIndex: 3, title: "title", doi: "123", isCitation: true};
        await wrapper.vm.addPublication();
        expect(wrapper.vm.search).toBe("123");
        expect(wrapper.vm.publications.length).toBe(3);
        expect(wrapper.vm.publications[2]).toStrictEqual({id: 456, tablePosition: 4, isCitation: true});
        restStub.restore();

        expect(wrapper.vm.publications.length).toBe(3);
        wrapper.vm.removePublication(2);
        expect(wrapper.vm.publications.length).toBe(2);

        wrapper.vm.createNewPublication();
        expect(wrapper.vm.errors).toStrictEqual({
            doi: null,
            general: null,
            pmid: null
        });
        expect(wrapper.vm.newPublication ).toStrictEqual({
            doi: "",
            title: "",
            journal: "",
            year: "",
            authors: "",
            pubmed_id: "",
            isCitation: false
        });
        expect(wrapper.vm.openEditor).toBe(true);
    });

    it("can process errors", async () => {
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({data: {error: {response: {data: "Im an error"}}}});
        wrapper.vm.newPublication = {title: "title"};
        await wrapper.vm.addPublication();
        expect(wrapper.vm.errors.general.response.data).toBe("Im an error");
        restStub.restore();

        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({data: {error: {response: {data: "Im an error"}}}});
        wrapper.vm.currentPublicationIndex = 2;
        wrapper.vm.newPublication = {pubIndex: 3, title: "title", doi: "123", isCitation: true};
        await wrapper.vm.addPublication();
        expect(wrapper.vm.errors.general.response.data).toBe("Im an error");
        restStub.restore();
    });

    it("can edit an added publication", () => {
        let newPub = {};
        wrapper.vm.editPublication(newPub, 0);
        expect(wrapper.vm.newPublication).toStrictEqual({});
    });

    it("can update a record", async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        recordStore.state.sections.publications.changes = 0;
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({data: {id: 123}});
        wrapper.vm.publications = [];
        wrapper.vm.publications.push({ id: 3, isCitation: true });
        wrapper.vm.publications.push({ id: 4, isCitation: false });
        await wrapper.vm.saveRecord(true);
        expect($router.push).toHaveBeenCalledWith({path: "/123"});
        expect($router.push).toHaveBeenCalledTimes(1);
        await wrapper.vm.saveRecord(false);
        expect(recordStore.state.sections.publications.changes).toEqual(0);
        restStub.returns({data: {error: {response: {data: "error"}}}});
        await wrapper.vm.saveRecord(true);
        expect(recordStore.state.sections.publications.error).toBe(true);
        expect(recordStore.state.sections.publications.message).toStrictEqual({"response": {"data": "error"}});
        restStub.restore();
        jest.clearAllMocks();
    });

    it("can toggle a citation", () => {
        recordStore.state.sections = {
            publications: {
                data: pubs,
                error: false,
                changes: 0,
                initialData: JSON.parse(JSON.stringify(pubs))
            },
            generalInformation: {
                data: {
                    metadata: {
                        citations: [
                            {publication_id: 2}
                        ]
                    },
                }
            },
            record: {fairsharingRecord: {id: 1243}}
        };
        wrapper.vm.publications[0].isCitation = true;
        wrapper.vm.toggleCitation(0);
        expect(wrapper.vm.publications[0].isCitation).toBe(false);
        wrapper.vm.toggleCitation(0);
        expect(wrapper.vm.publications[0].isCitation).toBe(true);
    });


});
