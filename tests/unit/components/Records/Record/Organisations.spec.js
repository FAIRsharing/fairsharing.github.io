import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import Organisations from "@/components/Records/Record/Organisations.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
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
        }
    ]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Organisations.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Organisations, {
            localVue,
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