import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import OntologyBrowser from "@/views/Browsers/OntologyBrowser.vue"
import editorStore from "@/store/editor.js";
import ontologyBrowserStore from "@/store/ontologyBrowser";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import ontologyQuery from "@/lib/GraphClient/queries/ontologies/subjectBrowser.json";
import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json"
const sinon = require("sinon"),
    localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter(),
    vuetify = new Vuetify(),
    $router = { push: jest.fn() },
    $store = new Vuex.Store({modules: {
        editor: editorStore,
        ontologyBrowser: ontologyBrowserStore
    }});
let graphStub,
    wrapper,
    $route = {
        name: "Ontology Browser",
        path: "/browse/",
        params: { id: "subject" },
        query: {}
    };



describe("OntologyBrowser.vue", function() {

    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({
            searchFairsharingRecords: {
                records: []
            }
        });
        graphStub.withArgs(ontologyQuery).returns({
            browseSubjects: {
                data: terms
            }
        });
    });

    afterAll(() => { graphStub.restore(); });

    it("can be mounted with a query", async () => {
        $route.query.term = "Biology"
        wrapper = await shallowMount(OntologyBrowser, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.name()).toMatch("OntologyBrowser");
        expect(wrapper.vm.term.id).toBe("287245 - Biology");
        wrapper.vm.search = "Biology"
        expect(wrapper.vm.open).toEqual([' - Natural Science', '287 - Life Science'])
        wrapper.destroy();
    })

    it("can be mounted without a query", async () => {
        $route.query = {};
        wrapper = await shallowMount(OntologyBrowser, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
        expect(wrapper.name()).toMatch("OntologyBrowser");
        expect(wrapper.vm.term).toBeUndefined();
        await wrapper.vm.activateTerms()
        wrapper.vm.searchTerm({identifier: 351, name: 'biology'})
        expect($router.push).toHaveBeenCalledWith({
            path: '/browse/',
            query: { term: 'biology'}
        })

        await wrapper.vm.activateTerms({
            name: "Biology",
            identifier: 351
        })
        wrapper.vm.searchTerm({identifier: 351, name: 'biology'})
        expect($router.push).toHaveBeenCalledWith({
            path: '/browse/'
        })

        wrapper.destroy();
    });


});
