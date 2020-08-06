import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/Navigation/jumpToTop.vue"
import sinon from "sinon";

const gotoTop = require('@/utils/navigationUtils');
const vuetify = new Vuetify();

describe("jumpToTop.vue", function () {
    let wrapper;
    wrapper = shallowMount(jumpToTop, {
        vuetify,
        propsData: {
            targetObject: 'fake-div'
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('JumpToTop');
    });

    it("can check scrollToTop function", () => {
        const stub = sinon.stub(gotoTop, 'gotoTop');
        stub.returns({});
        wrapper.vm.scrollToTop();
        sinon.assert.calledWith(gotoTop.gotoTop,null);
        stub.restore();
    });

});
