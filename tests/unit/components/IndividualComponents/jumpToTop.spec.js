import {shallowMount} from "@vue/test-utils";
import Vuetify from "vuetify"
import jumpToTop from "@/components/IndividualComponents/jumpToTop.vue"

const vuetify = new Vuetify();


describe("jumpToTop.vue", function () {
    let wrapper;

    wrapper = shallowMount(jumpToTop, {
        vuetify,
        propsData: {targetObject: `
    <div id="aa">
    <input id="newTodoInput" />
    <button id="addTodoBtn">Add todo</button>
    <ol id="todoList"></ol>
  </div>`}
    });

    it("can scroll to top", () => {
        wrapper.vm.scrollToTop(true);
        expect(wrapper.vm.scrolledCorrectly).toBe(true);

        wrapper.vm.TestEnvironment =true;
        expect(wrapper.vm.scrollToTop(false)).rejects;

        wrapper.vm.TestEnvironment =false;
        wrapper.vm.scrollToTop(false);
        expect(wrapper.vm.scrolledCorrectly).toBe(true);
    });
});
