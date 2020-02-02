import Vue from "vue"
import Vuex from "vuex"
import searchFilters from "./searchFilters.js"

Vue.use(Vuex);

export default new Vuex.Store({
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        async fetchFilters(){
            await searchFilters.dispatch("fetchFilters")
        }
    },
    modules: {
        searchFilters
    }
})
