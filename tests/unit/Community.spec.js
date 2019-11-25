import { shallowMount } from '@vue/test-utils'
import Community from '@/components/Static/Community/Community.vue'

describe('Community.vue', () => {

  it('renders', () => {

    const title = 'This will be the community page';

    let wrapper = shallowMount(Community, {
    });
    expect(wrapper.vm.greet()).toBe(0);

  })

});
