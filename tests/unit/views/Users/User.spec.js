import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import User from "@/views/Users/User.vue"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "../../../../src/store/users";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let routes = [{name: "Login", path: "/accounts/login"}];
const router = new VueRouter({routes});


describe("User.vue", () => {

    let wrapper;
    let restStub;
    let graphStub;

    beforeAll( () => {
       restStub = sinon.stub(Client.prototype, "executeQuery").returns({
           data: {id: "12345"}
       });
       graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
           data: {user: {name: "Terazus", expiry: undefined
               }}
       })
    });

    afterAll(() => {
        restStub.restore();
        graphStub.restore();
    });

    beforeEach( () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        const title = "User";
        expect(wrapper.name()).toMatch(title);
    });

    it("can logout users", async () => {
        await wrapper.vm.resetPwd(); // Still needs more testing
        await wrapper.vm.logoutUser();
        expect(wrapper.vm.$route.path).toBe("/accounts/login");
    });

});
