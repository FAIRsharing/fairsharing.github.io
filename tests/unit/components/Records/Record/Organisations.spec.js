import {shallowMount, createLocalVue} from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Organisations from "@/components/Records/Record/Organisations.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    organisationLinks: [
        {
            relation: 'funds',
            organisation: {
                name: "Organisation One",
                types: ["exciting", "thrilling"]
            },
            grant: {
                name: "generous grant",
                id: 1
            }
        },
        {
            relation: 'maintains',
            organisation: {
                name: "Organisation Two",
                types: []
            }
        },
        {
            relation: 'funds',
            organisation: {
                name: "Organisation One",
                types: ["exciting", "thrilling"]
            },
            grant: {
                name: "generous grant 2",
                id: 2
            }
        }
    ],
    subjects: [],
    domains: [],
    taxonomies: [],
    userDefinedTags: [],
    organisations: [{"id": 1119}]
};
const $store = new Vuex.Store({
    modules: {
        record: Record
    }
});

describe("Organisations.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Organisations, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Organisations");
        expect(wrapper.vm.getField('organisationLinks')[0].organisation.name).toMatch("Organisation One");
        expect(wrapper.vm.getField('organisationLinks')[0].grant.name).toMatch("generous grant");
        expect(wrapper.vm.getField('organisationLinks')[1].organisation.name).toMatch("Organisation Two");
        expect(wrapper.vm.getField('organisationLinks')[1].grant).toBe(undefined);
    });

    it("counts relations correctly", () => {
        expect(wrapper.vm.getRelations('funds').length).toEqual(1);
    });


});
