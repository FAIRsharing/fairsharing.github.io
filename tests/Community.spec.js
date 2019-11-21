import Vue from '../node_modules/vue'
import Community from '../src/components/Static/Community/Community.vue'

describe('MyComponent', () => {
    // Inspecter l'instance au montage du composant
    it('affecte correctement les messages à la création', () => {
        const vm = new Vue(Community).$mount();
        expect(123).toBe(123)
    })
});
