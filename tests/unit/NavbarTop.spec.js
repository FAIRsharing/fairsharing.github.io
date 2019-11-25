import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Navbar from '@/components/Navigation/NavbarTop.vue'

const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter();


describe('NavbarTop.vue', () => {
    it('can be instantiated', () => {
        const title = 'NavbarTop';
        const wrapper = shallowMount(Navbar, {
            localVue,
            router
        });
        expect(wrapper.name()).toMatch(title);
    })
})
