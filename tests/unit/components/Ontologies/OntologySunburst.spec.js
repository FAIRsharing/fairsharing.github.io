import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Sunburst from 'highcharts/modules/sunburst'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import OntologySunburst from "@/components/Ontologies/OntologySunburst";
import ontologyBrowserStore from "@/store/ontologyBrowser";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json"
Sunburst(Highcharts)

const sinon = require("sinon"),
    localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(HighchartsVue)
const router = new VueRouter(),
    vuetify = new Vuetify(),
    $router = { push: jest.fn() },
    $store = new Vuex.Store({ modules: { ontologyBrowser: ontologyBrowserStore }});
let graphStub,
    wrapper,
    $route = {
        name: "Ontology Browser",
        path: "/browse/",
        params: { id: "subject" },
        query: {}
    };

describe("OntologyBrowser.vue", function() {

    beforeAll(async () => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns({ browseSubjects: { data: terms } });
        await $store.dispatch('ontologyBrowser/fetchTerms')
    });

    afterAll(() => { graphStub.restore(); });

    beforeEach(async () => {
        wrapper = await shallowMount(OntologySunburst, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    })

    it("can be mounted and get dynamic width", async() => {
        expect(wrapper.name()).toMatch("OntologySunburst");
        expect(wrapper.vm.getWidth()).toBe("100%")
        wrapper.vm.$vuetify.breakpoint.xlOnly = true
        expect(wrapper.vm.getWidth()).toBe("60%")
    })

    it("can get a tooltip", () => {
        expect(wrapper.vm.getTooltip({name: "Subjects"})).toBeFalsy()
        expect(wrapper.vm.getTooltip({name: "Biology"})).toBe('<div class="HC-tooltip">Biology</div>')
    })

    it("can process click events", () => {
        wrapper.vm.$route.query = {term: 'test'}
        const node = {
            name: "test",
            descendants_count: 0,
            identifier: 2,
            id: 1
        }
        wrapper.vm.processClickEvent(node);
        expect($router.push).not.toHaveBeenCalled()

        wrapper.vm.$route.query = {}
        wrapper.vm.processClickEvent(node)
        expect($router.push).toHaveBeenCalledWith({"path": "/browse/", "query": {"term": "test"}})

        node.descendants_count = 1
        wrapper.vm.$route.query = {term: 'test'}
        node.name = "Subject"
        wrapper.vm.processClickEvent(node)
        expect($store.state.ontologyBrowser.openedTerms).toEqual([])

        node.name = 'biology'
        wrapper.vm.processClickEvent(node)
        expect($store.state.ontologyBrowser.openedTerms).toEqual([
            ' - Natural Science',
            '287 - Life Science',
            '287245 - Biology',
            '287245351 - Botany'
        ])

        node.innerArcLength = 0
        wrapper.vm.processClickEvent(node)
        expect($store.state.ontologyBrowser.openedTerms).toEqual([
            ' - Natural Science',
            '287 - Life Science',
            '287245 - Biology',
            '287245351 - Botany',
            1
        ])

        node.descendants_count = 0
        wrapper.vm.processClickEvent(node)
        expect($router.push).toHaveBeenCalledWith({path: '/browse/', query: {term: 'biology'}})



    })
})
