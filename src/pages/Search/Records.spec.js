import { shallowMount } from '@vue/test-utils'
import Records from './Records.vue'

const $route = {
    path: '/records'
}

describe('Records.vue', () => {

    // Set up the wrapper
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(Records, {
            mocks: {$route}
        });
    });
    const title = 'Records';


    it('can be instantiated', () => {
        expect(wrapper.name()).toMatch(title);
    });

    it('has a currentPath computed attribute', () => {
        expect(wrapper.vm.currentPath.toUpperCase()).toMatch(title.toUpperCase());

    });

    it('has a is_request_valid method to check if the request is valid', function(){
        expect(wrapper.vm.is_request_valid({})).toBe(true);
        expect(wrapper.vm.is_request_valid()).toBe(false);
    });


});
