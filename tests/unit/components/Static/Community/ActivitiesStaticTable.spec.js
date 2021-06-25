import {shallowMount} from "@vue/test-utils";
import ActivitiesStaticTable from "@/components/Static/Community/ActivitiesStaticTable";
import Vuetify from "vuetify"

describe("ActivitiesStaticTable.vue", function () {
    let wrapper;
    const vuetify = new Vuetify();
    beforeEach(() => {
        wrapper = shallowMount(ActivitiesStaticTable,
            {
                vuetify,
            }
        );
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("ActivitiesStaticTable");
    });

});
