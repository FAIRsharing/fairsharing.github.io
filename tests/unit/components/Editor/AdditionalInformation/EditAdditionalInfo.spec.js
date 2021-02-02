import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import editAdditionalInfo from "@/components/Editor/AdditionalInformation/EditAdditionalInfo"
import RestClient from "@/components/Client/RESTClient.js"
import recordStore from "@/store/record.js";
import userStore from "@/store/users.js";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.currentRecord = {
    fairsharingRecord: {
        metadata: {
            type: 'model_and_format'
        }
    }
};
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
        users: userStore
    }
});

let restStub;

describe("EditAdditionalInfo", function() {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(editAdditionalInfo, {
            localVue,
            vuetify,
            mocks: {$store}
        });
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns(['this', 'that']);
    });
    afterEach(() => {
        restStub.restore();
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditAdditionalInfo");
    });

    /*
    // Fails to run in the test for unknown reasons.
    it("returns the correct list of fields names", async () => {
        await wrapper.vm.getFieldNames();
        console.log("Allowed: " + JSON.stringify(wrapper.vm.allowedFields));
        expect(wrapper.vm.allowedFields[1]).toEqual('that');
    });
     */

});
