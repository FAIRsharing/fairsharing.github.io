import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex"
import OutputGrid from "@/components/Records/SearchOutputGrid.vue";
import records from "@/store/records";

const localVue = createLocalVue();
localVue.use(Vuex);

records.state.records = [
    {
        name: "test",
        type: "Just_a_Type",
        recordAssociations: [
            {
                linkedRecord: {
                    registry: "database"
                }
            }
        ],
        reverseRecordAssociations: [
            {
                fairsharingRecord: {
                    registry: "collection"
                }
            }
        ]
    }
];

const $store = new Vuex.Store({
    modules: {
        records: records
    },
});

describe("SearchOutputGrid.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(OutputGrid, {
            mocks: {$store},
            localVue
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("SearchOutputGrid");
    });

    it("can get the associated records of a record", async () =>{
        let associatedRecords = wrapper.vm.associatedRecords(wrapper.vm.records[0]);
        expect(associatedRecords['database'].val).toBe(1);
        expect(associatedRecords['collection'].val).toBe(1);
        let color = wrapper.vm.getColor("uncertain", "collection");
        expect(color).toBe("primary");
        color = wrapper.vm.getColor("uncertain", "standard");
        expect(color).toBe("blue-grey lighten-3");
        let string = wrapper.vm.cleanString("abc_dev");
        expect(string).toBe("ABC DEV");
    });

});

