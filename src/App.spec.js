import {shallowMount, createLocalVue} from "@vue/test-utils";
import VueRouter from "vue-router";
import App from "./App.vue";
import Vuetify from "vuetify"


const localVue = createLocalVue();
localVue.use(VueRouter);

let $route = { path: "/123/edit", params: {id: 123} };
const router = new VueRouter();
// const $router = { push: jest.fn() };


describe("App.vue", () => {
    let wrapper;
    const vuetify = new Vuetify();

    it("can be instantiated", () => {
        const title = "App";
        wrapper = shallowMount(App, {
            localVue,
            router,
            vuetify,
            mocks: {$route, vuetify:{breakpoint:{smAndDown:false}}}
        });
        expect(wrapper.name()).toMatch(title);
    });


    it("can check the toggleOverFlow", () => {
        wrapper.vm.toggleOverFlow(false);
        expect(wrapper.root).toBe(null);
    });

    /*   it("can check watcher", () => {
           console.log(wrapper.vm.UIGeneralStatus)

           wrapper.vm.UIGeneralStatus.recordType = {
               name: "collection"
           };
           expect(wrapper.vm.models).toStrictEqual({
               recordType: {name: "collection"},
               recordStatus: "uncertain"
           });
    });
   */

});
