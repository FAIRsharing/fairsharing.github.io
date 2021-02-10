import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"
import sinon from "sinon"
import Client from "@/components/Client/RESTClient.js"
import UserMenu from "@/components/Users/UserProfileMenu.vue"
import userStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);
userStore.state.user = function(){
    return {
        role: "super_curator",
        email: 'test@test.com',
        credentials: {
            token: 'thisisafaketoken'
        }
    }
}

const $store = new Vuex.Store({
    modules: {
        users: userStore
    }
});
let routes = [
    {name: "Login", path: "/accounts/login"},
    {name: "User", path: "/accounts/profile"}
];
const router = new VueRouter({routes});


describe("UserProfileMenu.vue", () => {

    let wrapper;
    let restStub;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {
                success: true,
                message: "Success !"
            }
        });
    });
    afterAll(() => {
        restStub.restore();
    });

    beforeEach( () => {
        wrapper = shallowMount(UserMenu, {
            localVue,
            router,
            mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        const title = "UserProfileMenu";
        expect(wrapper.name()).toMatch(title);
    });

    it("can a user that is a curator access to the curator panel", async () => {
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {
                success: true,
                message: "Success !"
            }
        });
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Curator Panel')[0].action();
        expect(wrapper.vm.$route.path).toBe("/curator");
    });

    it("can log user out", async () => {
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Logout')[0].action();
        expect(wrapper.vm.$route.path).toBe("/accounts/login");
    });

    it("can reset user pwd", async () => {
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Reset Password')[0].action();
        expect(wrapper.vm.$route.path).toBe("/users/password/edit");
    });

    it("can redirect to user edit profile", async () => {
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Edit profile')[0].action();
        expect(wrapper.vm.$route.path).toBe("/profiles/edit");
    });



});
