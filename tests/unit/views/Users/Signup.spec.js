import {shallowMount} from "@vue/test-utils";
import SignUp from "@/views/Users/Signup";

describe("Community.vue", function(){
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(SignUp, {});
    });

    it("can be mounted", function(){
        expect(wrapper.name()).toMatch("Signup");
    })
});
