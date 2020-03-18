import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Register from "@/components/Users/Register.vue"
import Client from "@/components/Client/RESTClient.js"
import sinon from "sinon"

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe("Footer.vue", () => {
    let wrapper;

    beforeEach( () => {
        wrapper = shallowMount(Register, {
            localVue,
            router
        });
    });

    it("can be instantiated", () => {
        const title = "Register";
        expect(wrapper.name()).toMatch(title);
    });

    it("will raise errors in case of missing fields", async () => {
        wrapper.vm.loginData = {
            name: "test"
        };
        await wrapper.vm.register();
        expect(wrapper.vm.errors).toStrictEqual([
            'email is missing.',
            'password is missing.',
            'repeatPwd is missing.'
        ]);
    });

    it("will raise errors in case of unmatched passwords", async () => {
        wrapper.vm.loginData = {
            name: "Terazus",
            email: "test@test.com",
            password: "test",
            repeatPwd: "ttest"
        };
        await wrapper.vm.register();
        expect(wrapper.vm.errors).toStrictEqual([ 'Passwords need to be the same' ]);
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
        await wrapper.vm.register();
        expect(wrapper.vm.message).toBe("Account created, please verify your email address test@test.com");
        stub.restore();
    });

    it("can process errors", async () => {
        let stub = sinon.stub(Client.prototype, "executeQuery");
        stub.withArgs(sinon.match.any).returns({
            data: {
                error: "Something went wrong"
            }
        });
        wrapper.vm.loginData = {
            name: "Terazus",
            email: "test@test.com",
            password: "test",
            repeatPwd: "test"
        };
        await wrapper.vm.register();
        expect(wrapper.vm.message).toBe("Something went wrong");
        stub.restore();
    })

});
