import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import CuratorNotes from "@/components/Records/Record/CuratorNotes"
import Vuetify from "vuetify"
import users from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record,
        users: users
    }});

$store.state.users.user().is_curator = true
$store.state.record.currentRecord['fairsharingRecord'] = {curatorNotes: "some description"}

describe("CuratorNotes.vue", function(){
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(CuratorNotes, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("CuratorNotes");
    });

});
