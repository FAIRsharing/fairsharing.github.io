import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import IncompleteRecords from "@/components/Curators/IncompleteRecords.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json"

let curationDataSummary =  dataDashboard.curationSummary;
const localVue = createLocalVue();
localVue.use(Vuex);
let header = [
    {
        "text": "Record name (id)",
        "value": "recordNameID"
    },
    {
        "text": "Date created",
        "value": "createdAt"
    },
    {
        "text": "Missing required",
        "value": "required"
    },
    {
        "text": "Missing recommended",
        "value": "recommended"
    }
];
usersStore.state.user = function () {
    return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
    };
};

const $store = new Vuex.Store({
    modules: {
        users: usersStore,
    },
});

const router = new VueRouter();
const $router = { push: jest.fn() };

describe("Curator -> IncompleteRecords.vue", () => {
    let restStub, wrapper, graphStub;
    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery")
            .returns(curationDataSummary)
        restStub = sinon.stub(Client.prototype, "executeQuery").returns(
            {
                data: {
                    error: false
                }
            }
        );
        wrapper = shallowMount(IncompleteRecords, {
            localVue,
            router,
            mocks: { $store, $router },
            propsData: {
                headerItems: header
            }
        });
    });
    afterEach( () => {
        graphStub.restore();
        restStub.restore();
    });

    it("can be mounted", () => {
        expect(wrapper.vm.$options.name).toMatch("IncompleteRecords");
        expect(wrapper.vm.prepareIncompleteRecords).toHaveBeenCalled;
        expect(wrapper.vm.incompleteRecords.length).toBe(2);
        let date = new Date("1425,01,01");
        let auxString = date.toLocaleString('default', { month: 'short' })+' '+date.getDate()+ ', '+date.getFullYear();
        expect(wrapper.vm.incompleteRecords[1].createdAt).toBe(auxString);
    });



    it("can check for incompleteRecords", () => {
        let output = {
            "createdAt": "Jan 1, 1425",
            "id": "2669f95",
            "recordNameID": "ShareSfhare (2669f95)",
            "type": undefined,
            "recommended": "data_sharing",
            "required": "name"
        }
        expect(wrapper.vm.incompleteRecords[0]).toStrictEqual(output);
    });
});
