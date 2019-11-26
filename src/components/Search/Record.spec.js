import { shallowMount } from '@vue/test-utils'
import Record from './Record.vue'

const $route = {
    path: '/',
    params: {
        id: '120'
    }
};

describe('Record.vue', function() {

    // Set up the wrapper
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(Record, {
            mocks: {$route}
        });
    });
    const path = '120';
    const title = 'FAIRsharing | ' + path;


    it('can be instantiated', () => {
        expect(wrapper.name()).toMatch('Record');
        expect(wrapper.attributes('id')).toMatch('ABA');
    });

    it('has a currentRoute computed property', () => {
        expect(wrapper.vm.currentRoute).toMatch(path);
        expect(wrapper.vm.getTitle()).toBe(title);
    });


})
