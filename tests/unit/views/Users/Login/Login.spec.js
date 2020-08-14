import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import Login from "@/views/Users/Login/Login.vue"
import Client from "@/components/Client/RESTClient.js"
import usersStore from "@/store/users.js";

const localVue = createLocalVue();
// localVue.use(VueRouter);
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});
let $route = {name: "Login", path: "/accounts/login", query: {}};
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
    });

    it("can prevent users from logging in", async () => {
        restStub.returns({
            data: {
                error: {
                    response: {
                        data: {
                            error: "Error !"
                        }
                    }
                }
            }
        });
        wrapper.vm.loginData = {};
        await wrapper.vm.logUser();
        expect(wrapper.vm.messages().login).toStrictEqual({"error": true, "message": "Error !"})
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
    })

});
