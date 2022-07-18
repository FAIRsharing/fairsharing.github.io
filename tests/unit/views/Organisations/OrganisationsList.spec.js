import { createLocalVue, shallowMount } from "@vue/test-utils";
import OrganisationsList from "@/views/Organisations/OrganisationsList"
import Vuetify from "vuetify"
import Vuex from "vuex";
import sinon from "sinon";
import allOrganisationsQuery from "@/lib/GraphClient/queries/getAllOrganisations.json";
import GraphClient from "@/lib/GraphClient/GraphClient";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(Vuex);

describe("OrganisationsList.vue",
    function () {
        let wrapper;

        let graphStub;

        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(allOrganisationsQuery).returns({
            allUsers: [
                {id: 1, name: 'one', homepage: 'http://abc.com', types: ['xyz']}
            ]
        })

        afterAll(() => {
            graphStub.restore();
        })


        beforeEach(() => {
            wrapper = shallowMount(OrganisationsList, {
                vuetify,
                localVue,
            })
        });

        afterEach(() => {
            wrapper.destroy();
        });

        afterAll(() => {
            graphStub.restore();
        })

        it("can be instantiated", () => {
            expect(wrapper.name()).toMatch("OrganisationsList");
        });

    });
