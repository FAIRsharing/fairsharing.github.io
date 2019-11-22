import { mount } from '@vue/test-utils'
import Community from './Community.vue'

describe('CommunityComponent', () => {
    // Inspecter l'instance au montage du composant
    it('has correct name', () => {
        const wrapper = mount(Community);
        expect(wrapper.name()).toBe('Community');
    })
});
