import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"
import sinon from "sinon"
import Client from "@/lib/Client/RESTClient.js"
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
        },
        id: 1
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

    it("can redirect to user edit profile or editPublicProfile", async () => {
        userStore.state.user = function(){
            return {
                role: "super_curator",
                email: 'test@test.com',
                credentials: {
                    token: 'thisisafaketoken'
                },
                id: 1
            }
        }
        let $store = new Vuex.Store({
            modules: {
                users: userStore
            }
        });
        wrapper = shallowMount(UserMenu, {
            propsData: { viewingId: 1},
            localVue,
            router,
            mocks: {$store}
        });
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Edit profile')[0].action();
        expect(wrapper.vm.$route.path).toBe("/profiles/edit");
        userStore.state.user = function(){
            return {
                role: "super_curator",
                email: 'test@test.com',
                credentials: {
                    token: 'thisisafaketoken'
                },
                id: 1
            }
        }
        $store = new Vuex.Store({
            modules: {
                users: userStore
            }
        });
        wrapper = shallowMount(UserMenu, {
            propsData: { viewingId: 2},
            localVue,
            router,
            mocks: {$store}
        });
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Edit profile')[0].action();
        expect(wrapper.vm.$route.path).toBe("/profiles/editPublicProfile/2");
        userStore.state.user = function(){
            return {
                role: "super_curator",
                email: 'test@test.com',
                credentials: {
                    token: 'thisisafaketoken'
                },
                id: 1
            }
        }
        $store = new Vuex.Store({
            modules: {
                users: userStore
            }
        });
        wrapper = shallowMount(UserMenu, {
            propsData: {},
            localVue,
            router,
            mocks: {$store}
        });
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Edit profile')[0].action();
        expect(wrapper.vm.$route.path).toBe("/profiles/edit");


    });

    it("can redirect to userLists", async () => {
        await wrapper.vm.menuItems.filter(obj => obj.name === 'Users List')[0].action();
        expect(wrapper.vm.$route.path).toBe("/profiles/usersList");
    });

    it("hides edit profile button where required", () => {
        // Unknown why this has to be duplicated here for the test to pass...
        userStore.state.user = function(){
            return {
                role: "super_curator",
                email: 'test@test.com',
                credentials: {
                    token: 'thisisafaketoken'
                },
                id: 1
            }
        }
        const $store = new Vuex.Store({
            modules: {
                users: userStore
            }
        });
        wrapper = shallowMount(UserMenu, {
            propsData: { viewingId: 1},
            localVue,
            router,
            mocks: {$store}
        });
        expect(wrapper.vm.disableEdit()).toBe(false);

        wrapper = shallowMount(UserMenu, {
            propsData: { viewingId: 2},
            localVue,
            router,
            mocks: {$store}
        });
        expect(wrapper.vm.disableEdit()).toBe(false);
    });

    it("can disable edit when user is a curator", () => {
        userStore.state.user = function(){
            return {
                role: "curator",
                email: 'test@test.com',
                credentials: {
                    token: 'thisisafaketoken'
                },
                id: 2
            }
        }
        const $store = new Vuex.Store({
            modules: {
                users: userStore
            }
        });
        wrapper = shallowMount(UserMenu, {
            propsData: { viewingId: 2},
            localVue,
            router,
            mocks: {$store}
        });
        expect(wrapper.vm.disableEdit()).toBe(false);
    });

});
