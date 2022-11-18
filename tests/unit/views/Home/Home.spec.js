import { shallowMount, createLocalVue } from "@vue/test-utils";
import Home from "@/views/Home/Home"
import Vuetify from "vuetify"
import VueScrollTo from "vue-scrollto";
import RestClient from "@/lib/Client/RESTClient.js"
const sinon = require("sinon");

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueScrollTo,{});

describe("Home.vue", function(){
    let wrapper;
    let restStub;

    beforeEach(() => {
        wrapper = shallowMount(Home, {
            vuetify,
            localVue
        })
    });
    afterEach(() => {
        wrapper.destroy();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Home");
    });

    it("can get JSON+LD from API", async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns(
            {
                data: {
                    "@context": "http://schema.org",
                    "@type": "DataCatalog",
                    "identifier": "https://identifiers.org/MIR:00000364",
                    "name": "FAIRsharing.org",
                    "description": "A manually curated, informative and educational resource on data and metadata standards, inter-related to databases/data repositories and funder and journal publisher data policies from across disciplines. FAIRsharing is an ELIXIR-UK node resource and has an active role in the RDA and Force11 data initiatives.",
                    "url": "https://fairsharing.org/",
                    "dataset": []
                }
            }
        );
        await wrapper.vm.getJsonld();
        expect(wrapper.vm.JSONLD['@context']).toEqual("http://schema.org");
    });

});
