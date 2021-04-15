import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vue from "vue"
import sinon from "sinon"
import ValidityProgress from "@/components/Users/Password/ValidityProgress"
import Client from "@/lib/Client/RESTClient.js"

const localVue = createLocalVue();
Vue.config.silent = true;
let stub;

describe('ValidityProgress.vue', () => {

    it("can be mounted", () => {
        let wrapper = shallowMount(ValidityProgress, {
            localVue
        });
        expect(wrapper.name()).toBe("ValidityProgress");
        expect(wrapper.vm['passwordValidity']).toBe(0);
        expect(wrapper.vm['passwordColor']).toBe("red");
    });

    it("can react to password change", async () => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {percent: 0}
        });
        const secondLocalVue = createLocalVue();
        const anotherWrapper = await shallowMount(ValidityProgress, {
            secondLocalVue,
            propsData: {
                password: "Great password 123!?"
            }
        });
        anotherWrapper.vm.password = "anotherWrapper";
        expect(anotherWrapper.vm.passwordColor).toBe("red");
        expect(anotherWrapper.vm.passwordValidity).toBe(0);

    });



});
