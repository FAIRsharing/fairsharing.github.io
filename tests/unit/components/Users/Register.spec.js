import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Register from "@/components/Users/Register.vue"
import Client from "@/lib/Client/RESTClient.js"
import sinon from "sinon"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe("Register.vue", () => {
    let wrapper;

    beforeEach( () => {
        wrapper = shallowMount(Register, {
            localVue,
            router,
        });
    });

    it("can be instantiated", () => {
        const title = "Register";
        expect(wrapper.name()).toMatch(title);
    });

    it("can create new accounts", async () => {
        let stub = sinon.stub(Client.prototype, "executeQuery");
        stub.withArgs(sinon.match.any).returns({
            data: "Hello World"
        });
        wrapper.vm.loginData = {
            name: "Terazus",
            email: "test@test.com",
            password: "test",
            repeatPwd: "test"
        };
        wrapper.vm.$refs['registerForm'] = {
            reset: jest.fn()
        };
        await wrapper.vm.register();
        expect(wrapper.vm.message).toBe("Account created, please verify your email address test@test.com");
        expect(wrapper.vm.$refs['registerForm'].reset).toHaveBeenCalledTimes(1);
        stub.restore();
    });

    it("can process errors", async () => {
        let stub = sinon.stub(Client.prototype, "executeQuery");
        stub.withArgs(sinon.match.any).returns({
            data: {
                error: {
                    response: {
                        data : {
                            errors : {
                                "email": ["missing"]
                            }
                        }
                    }
                }
            }
        });
        wrapper.vm.loginData = {
            name: "Terazus",
            email: "test@test.com",
            password: "test",
            repeatPwd: "test"
        };
        await wrapper.vm.register();
        expect(wrapper.vm.errors).toStrictEqual(["email missing"]);
        stub.restore();
    })

});
