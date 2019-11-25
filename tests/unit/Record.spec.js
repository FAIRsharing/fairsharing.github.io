import { shallowMount } from '@vue/test-utils'
import Record from '@/components/Search/Record.vue'

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
    const title = '120';


    it('can be instantiated', () => {
        expect(wrapper.name()).toMatch('ABA');
        expect(wrapper.attributes('id')).toMatch('ABA');
    });

    it('has a currentRoute computed property', () => {
        expect(wrapper.vm.currentRoute).toMatch(title);
    });


})
