import { createLocalVue,shallowMount } from "@vue/test-utils"
import { RouterLinkStub } from '@vue/test-utils';
import sinon from "sinon"
import VueRouter from "vue-router"
import Vuex from "vuex"
import Vuetify from "vuetify";
import light from "@/plugins/theme";

import GraphClient from "@/lib/GraphClient/GraphClient.js"
import Organisation from "@/views/Organisations/Organisation";

const localVue = createLocalVue();
localVue.use(Vuex);

let vuetify = new Vuetify({
    theme: {
        themes: {light}
    }
});

let $route = {
    path: "/organisations/1",
    params: {id: 1}
};
const router = new VueRouter();
const $router = { push: jest.fn() };

describe("Organisation", () => {

    let wrapper;
    let graphStub;
    let organisation = {
        id: 1,
        name: "4DN Data Coordination and Integration Center",
        alternativeNames: [],
        homepage: "http://dcic.4dnucleome.org/",
        rorLink: "https://roro.roror.ror",
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
        ],
        users: [],
        countries: []
    }

    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            organisation: organisation
        });
    });

    afterAll(() => {
        graphStub.restore();
    });

    it("can be instantiated", async () => {
        wrapper = await shallowMount(Organisation, {
            localVue,
            router,
            vuetify,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        const title = "Organisation";
        expect(wrapper.vm.$options.name).toMatch(title);
        expect(wrapper.vm.organisation.id).toEqual(1);
        expect(wrapper.vm.currentRoute).toEqual(1);
    });

    it("redirects to the search page for filtering", async() => {
        graphStub.restore();
        wrapper = await shallowMount(Organisation, {
            localVue,
            vuetify,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        await wrapper.vm.getOrganisation();
        wrapper.vm.organisation = organisation;
        wrapper.vm.filterRecords();
        expect($router.push).toHaveBeenCalledWith({
            name: "search",
            query: {organisations: encodeURIComponent(organisation.name.toLowerCase())}
        });
    });

    it("doesn't display if the organistion is not set in the response", async () => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            error: "error"
        });
        wrapper = await shallowMount(Organisation, {
            localVue,
            vuetify,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.organisation).toStrictEqual({
            alternativeNames: [],
            types: [],
            users: [],
            parentOrganisations: [],
            childOrganisations: [],
            countries: []
        });
    });

    it("can generate the correct URL for the logo", async () => {
        graphStub.restore();
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
            organisation: {
                urlForLogo: "/logo12345678",
                alternativeNames: [],
                types: [],
                users: [],
                parentOrganisations: [],
                childOrganisations: []
            }
        });
        wrapper = await shallowMount(Organisation, {
            localVue,
            vuetify,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.logoUrl).toEqual(process.env.VUE_APP_API_ENDPOINT + '/logo12345678');
        wrapper.vm.testEnvironment = true;
    });

    it("watches the current route", async () => {
        graphStub.restore();
        wrapper = await shallowMount(Organisation, {
            localVue,
            vuetify,
            router,
            mocks: {$route, $router},
            stubs: {RouterLink: RouterLinkStub}
        });
        expect(wrapper.vm.currentRoute).toEqual(1);
        $route.params.id = 10;
        expect(wrapper.vm.currentRoute).toEqual(10);
    });

});