import { shallowMount, createLocalVue } from "@vue/test-utils"
import User from "@/components/Users/Profiles/Private/RecordCard.vue"
import VueRouter from "vue-router"
import usersStore from "@/store/users";
import Vuex from "vuex";


const localVue = createLocalVue();
localVue.use(Vuex);
const router = new VueRouter();
usersStore.state.user = function(){ return {
    isLoggedIn: true,
    credentials: {token: 123, username: 123},
    records: {
        maintenanceRequests: [
            {
                fairsharingRecord: {},
                createdAt: null,
                status: 'approved'
            }
        ],
        createdRecords: [
            {}
        ]
    }
}};
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
const $router = { push: jest.fn() };
let wrapper;

describe("CardActions.vue", () => {

    it("can be mounted with maintenanceRequest", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$router, $store},
            propsData: {
                recordsType: "maintenanceRequests"
            },
        });
        const title = "RecordCard";
        expect(wrapper.name()).toMatch(title);
    });

    it("can be mounted with another record type", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$router, $store},
            propsData: {
                recordsType: "createdRecords"
            },
        });
        const title = "RecordCard";
        expect(wrapper.name()).toMatch(title);
    })

});
