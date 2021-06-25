import {createLocalVue, shallowMount} from "@vue/test-utils";
import Community from "@/views/Static/Community/Community.vue";
import Vuetify from "vuetify"
import icons from "@/plugins/icons";
import linkify from "vue-linkify";

let $route = {
    name: "Community",
    hash:'#governance'
};

const push = jest.fn();
const $router = {
    push: jest.fn(),
};

describe("Community.vue", function () {
    let wrapper;
    const localVue = createLocalVue();
    localVue.directive('linkified', linkify)
    const vuetify = new Vuetify({'icons': icons});
    beforeEach(() => {
        wrapper = shallowMount(Community,
            {
                localVue,
                vuetify,
                mocks: {$route,$router},
                stubs: ['router-link']
            }
        );
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Community");
        wrapper.vm.$route.hash = '#anotherAnchor'
        expect(wrapper.vm.applyCss).toBe(false);
    });

    it("can check jumpToAnchor method", () => {
        wrapper.vm.currentAnchor = ''
        wrapper.vm.$router.push = push;
        wrapper.vm.jumpToAnchor('newAnchor')
        expect(push).toHaveBeenCalledWith({"hash": "newAnchor"});
        wrapper.vm.jumpToAnchor('newAnchor')
        expect(wrapper.vm.currentAnchor).not.toBe("");
    });

});
