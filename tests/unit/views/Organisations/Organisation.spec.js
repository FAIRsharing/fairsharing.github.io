import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import { RouterLinkStub } from '@vue/test-utils';
import Organisation from "@/views/Organisations/Organisation";
import GraphClient from "@/lib/GraphClient/GraphClient.js"

const localVue = createLocalVue();
localVue.use(Vuex);

let $route = {
    path: "/organisations/1",
    params: {id: 1}
};
const router = new VueRouter();
const $router = { push: jest.fn() };

describe("Organisation", () => {

    let wrapper;
    let graphStub;

    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            organisation: {
                id: 1,
                name: "4DN Data Coordination and Integration Center",
                alternativeNames: [],
                homepage: "http://dcic.4dnucleome.org/",
                types: [
                    "Consortium"
                ],
                urlForLogo: "/logo12345678",
                childOrganisations: [],
                parentOrganisations: [],
                organisationLinks: [
                    {
                        id: 6057,
                        isLead: true,
                        relation: "maintains",
                        fairsharingRecord: {
                            id: 872,
                            name: "Pairs file format",
                            abbreviation: ".pairs",
                            type: "model_and_format",
                            registry: "Standard",
                            status: "ready"
                        },
                        "grant": null
                    }
                ]
            }
        });
    });

    afterAll(() => {
        graphStub.restore();
    });

    it("can be instantiated", async () => {
        wrapper = await shallowMount(Organisation, {
            localVue,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        const title = "Organisation";
        expect(wrapper.name()).toMatch(title);
        expect(wrapper.vm.organisation.id).toEqual(1);
        expect(wrapper.vm.currentRoute).toEqual(1);
    });

    it("doesn't display if the organistion is not set in the response", async () => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            error: "error"
        });
        wrapper = await shallowMount(Organisation, {
            localVue,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.organisation).toStrictEqual({});
    });

    it("can show and hide the overlay", () => {
        wrapper.vm.previewRecord(12);
        expect(wrapper.vm.targetID).toBe(12);
        expect(wrapper.vm.showOverlay ).toBe(true);
        wrapper.vm.hideOverlay(12);
        expect(wrapper.vm.targetID).toBe(null);
        expect(wrapper.vm.showOverlay ).toBe(false);
        wrapper.vm.goToEdit(12);
        expect($router.push).toHaveBeenCalledWith({path: "/12/edit"})
    });

    it("can generate the correct URL for the logo", async () => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            organisation: {
                urlForLogo: "/logo12345678",
                alternativeNames: [],
                types: []
            }
        });
        wrapper = await shallowMount(Organisation, {
            localVue,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.logoUrl).toEqual(process.env.VUE_APP_API_ENDPOINT + '/logo12345678');
    });

    it("watches the current route", async () => {
        graphStub.restore();
        wrapper = await shallowMount(Organisation, {
            localVue,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.currentRoute).toEqual(1);
        $route.params.id = 10;
        expect(wrapper.vm.currentRoute).toEqual(10);
    });
});
