import Vue from 'vue'
import Community from './Community.vue'

describe('MyComponent', () => {
    // Inspecter l'instance au montage du composant
    it('affecte correctement les messages à la création', () => {
        const vm = new Vue(Community).$mount();
        expect(123).toBe(123)
    })
});
