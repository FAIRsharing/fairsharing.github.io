import { shallowMount, createLocalVue } from "@vue/test-utils"
import User from "@/components/Users/Profiles/Private/CardActions.vue"
import VueRouter from "vue-router"

const localVue = createLocalVue();
const router = new VueRouter();
const $router = { push: jest.fn() };
let wrapper;

describe("CardActions.vue", () => {

    it("can be mounted", () => {
        wrapper = shallowMount(User, {
            localVue,
            router,
            mocks: {$router}
        });
        const title = "CardActions";
        expect(wrapper.name()).toMatch(title);
    })

});
