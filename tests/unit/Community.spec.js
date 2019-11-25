import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/Static/Community/Community.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'This will be the community page';
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
