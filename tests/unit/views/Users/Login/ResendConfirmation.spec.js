import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import ResendConfirmation from "@/views/Users/Login/ResendConfirmation";
import Client from "@/components/Client/RESTClient.js"

describe("ResendConfirmation.vue", function(){
    let wrapper;
    let restStub;
    const button = "Resend Confirmation Email";
    const message =  "Confirmation message sent successfully!";
    restStub = sinon.stub(Client.prototype, "resendConfirmation");

    beforeEach(() => {
        wrapper = shallowMount(ResendConfirmation, {
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("ResendConfirmation");
    });

    it("sends an resend request and responds", async () => {
        restStub.returns({
            message: message
        });
        expect(wrapper.vm.buttonDisabled).toBe(false);
        expect(wrapper.vm.buttonMessage).toEqual(button);
        await wrapper.vm.makeResendRequest();
        expect(wrapper.vm.buttonDisabled).toBe(false);
        expect(wrapper.vm.buttonMessage).toEqual(button);
        wrapper.vm.email = "example@fairsharing.org";
        await wrapper.vm.makeResendRequest();
        expect(wrapper.vm.buttonDisabled).toBe(true);
        expect(wrapper.vm.buttonMessage).toEqual(message);
        restStub.returns({
            message: "no luck this time"
        });
        await wrapper.vm.makeResendRequest();

    });

    it("hasn't sent the email correctly", async () => {
        wrapper.vm.email = "example@fairsharing.org";
        restStub.returns({
            message: "no luck this time"
        });
        await wrapper.vm.makeResendRequest();
        expect(wrapper.vm.buttonDisabled).toBe(false);
        expect(wrapper.vm.buttonMessage).toEqual(button);

    });


});
