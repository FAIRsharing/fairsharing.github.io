import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import Login from "@/views/Users/Login/Login.vue"
import Client from "@/lib/Client/RESTClient.js"
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
// localVue.use(VueRouter);
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let $route = {name: "Login", path: "/accounts/login", query: {goTo: "/123"}};
let routes = [
    $route
];
const router = new VueRouter({routes});
const $router = {
    go: jest.fn(),
    push: jest.fn()
};


describe("Login.vue", ()=> {

    let wrapper;
    let restStub;

    beforeAll( () => {
        restStub = sinon.stub(Client.prototype, "executeQuery");
    });
    afterAll(() => {
        restStub.restore();
    });
    beforeEach( () => {
        wrapper = shallowMount(Login, {
            localVue,
            router,
            propsData: {
                redirect: true,
            },
            stubs: ['router-link', 'router-view'],
            mocks: {$store, $route, $router}
        });
    });

    it("can instantiate", () => {
        restStub.returns({
            data: {
                username: "Terazus"
            }
        });
        const title = "Login";
        expect(wrapper.name()).toMatch(title);
    });

    it("can log users in", async () => {
        restStub.returns({
            data: {
                username: "Terazus"
            }
        });
        wrapper.vm.loginData = {
            name: "Terazus",
            password: "niceTry!Lolz"
        };
        await wrapper.vm.logUser();
        expect(wrapper.vm.$route.path).toBe("/accounts/login");

        $route.query = {};
        let anotherWrapper = shallowMount(Login, {
            localVue,
            router,
            propsData: {
                redirect: true,
            },
            stubs: ['router-link', 'router-view'],
            mocks: {$store, $route, $router}
        });
        await anotherWrapper.vm.logUser();
        expect($router.push).toHaveBeenCalledWith({path: "/accounts/profile"});
        $route.query = {goTo: "/123"};
    });

    it("can prevent users from logging in", async () => {
        restStub.returns({
            data: {
                error: {
                    response: {
                        data: {
                            error: "You have to confirm your email address before continuing."
                        }
                    }
                }
            }
        });
        wrapper.vm.loginData = {};
        expect(wrapper.vm.resendButton).toBe(false);
        await wrapper.vm.logUser();
        expect(wrapper.vm.messages().login).toStrictEqual({"error": true, "message": "You have to confirm your email address before continuing."});
        expect(wrapper.vm.resendButton).toBe(true);
    });

    it("doesn't show resend button if the error isn't a confirmation error", async () => {
        restStub.returns({
            data: {
                error: {
                    response: {
                        data: {
                            error: "sorry, you're out of luck this time"
                        }
                    }
                }
            }
        });
        wrapper.vm.loginData = {};
        expect(wrapper.vm.resendButton).toBe(false);
        await wrapper.vm.logUser();
        expect(wrapper.vm.messages().login).toStrictEqual({"error": true, "message": "sorry, you're out of luck this time"});
        expect(wrapper.vm.resendButton).toBe(false);

    });

    it('can process redirection', async () => {
        const anotherWrapper = shallowMount(Login, {
            localVue,
            router,
            propsData: {
                redirect: false,
            },
            stubs: ['router-link', 'router-view'],
            mocks: {$store, $route, $router}
        });
        restStub.returns({
            data: {
                username: "Terazus"
            }
        });
        anotherWrapper.vm.loginData = {
            name: "Terazus",
            password: "niceTry!Lolz"
        };
        await anotherWrapper.vm.logUser();
        expect(anotherWrapper.vm.$route.path).toBe("/accounts/login");
    });

    it('can process special redirection', async () => {
        $route.query.redirect = true;
        let anotherWrapper = shallowMount(Login, {
            localVue,
            router,
            propsData: {
                redirect: false,
            },
            stubs: ['router-link', 'router-view'],
            mocks: {$store, $route, $router}
        });
        restStub.returns({
            data: {
                username: "Terazus"
            }
        });
        anotherWrapper.vm.loginData = {
            name: "Terazus",
            password: "niceTry!Lolz"
        };
        await anotherWrapper.vm.logUser();
        expect(anotherWrapper.vm.$route.path).toBe("/accounts/login");
        expect($router.push).toHaveBeenCalledWith({path: "/123"})
    })

    it("generates correct oauth links", () => {
        expect(wrapper.vm.returnTo()).toEqual('?return_to=/123');
        wrapper.vm.$route.query = {};
        expect(wrapper.vm.returnTo()).toEqual('');
    });

});
