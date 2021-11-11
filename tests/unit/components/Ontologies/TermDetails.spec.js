import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import TermDetails from "@/components/Ontologies/TermDetails";
import ontologyBrowserStore from "@/store/ontologyBrowser";
import editorStore from "@/store/editor"
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import ontologyQuery from "@/lib/GraphClient/queries/ontologies/subjectBrowser.json"
import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json"

const sinon = require("sinon"),
    localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter(),
    vuetify = new Vuetify(),
    $router = { push: jest.fn() },
    $store = new Vuex.Store({ modules: {
        ontologyBrowser: ontologyBrowserStore,
        editor: editorStore
    }});
let graphStub,
    wrapper,
    $route = {
        name: "Ontology Browser",
        path: "/browse/",
        params: { id: "subject" },
        query: {}
    };

describe("TermDetails.vue", () => {

    beforeAll(async () => {
        $store.state.ontologyBrowser.records = []
        $store.state.ontologyBrowser.selectedTerm = { name: "Biology" }
        $store.state.currentPage = 1
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchFairsharingRecords: {
                totalPages: 1,
                records: ["test"]
            }
        })
        graphStub.withArgs(ontologyQuery).returns({ browseSubjects: { data: terms } });
        await $store.dispatch('ontologyBrowser/fetchTerms')
    });

    afterAll(() => { graphStub.restore() });

    beforeEach(async () => {
        wrapper = await shallowMount(TermDetails, {
            localVue,
            vuetify,
            router,
            mocks: { $store, $route, $router },
            propsData: { selectedOntology: "Subject" }
        });
    })

    it("can be mounted", async() => {
        expect(wrapper.name()).toMatch("TermDetails");
        expect(wrapper.vm.perPage).toBe(50)
        expect(wrapper.vm.currentPage).toBe(1)
        expect(wrapper.vm.selectedOntology).toBe("Subject")
        expect(wrapper.vm.selectedTerm.name).toBe("Biology")
        wrapper.vm.perPage = 10
        expect(wrapper.vm.perPage).toBe(10)
        expect(wrapper.vm.currentPage).toBe(1)
    })

    it("can get a new page", async() => {
        await wrapper.vm.setPage(1)
        expect(wrapper.vm.currentPage).toBe(2)
        await wrapper.vm.setPage(-1)
        expect(wrapper.vm.currentPage).toBe(1)
    });

    it("can open a search page", () => {
        wrapper.vm.goToSearch()
        expect($router.push).toHaveBeenLastCalledWith({ name: "search", query: {subjects: "Biology"} })
    })

    it("cam open a term page", () => {
        wrapper.vm.goToTerm("test")
        expect($router.push).toHaveBeenLastCalledWith({ path: "/browse/", query: { term: "test" } })
    })
})
