import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import editAdditionalInfo from "@/components/Editor/EditAdditionalInfo"
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
        user: userStore
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
    });
    afterEach(() => {
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("EditAdditionalInfo");
    });

    it("can download the JSON with allowed fields", async () => {
        console.log("USER: " + JSON.stringify(wrapper.vm.user()));
        restStub = sinon.stub(RestClient.prototype, 'executeQuery');
        restStub.returns({this: 'that'});
        await wrapper.vm.getAllowedFields();
        expect(wrapper.vm.allowedFields.this).toEqual('that');
        restStub.restore();
    });
});
