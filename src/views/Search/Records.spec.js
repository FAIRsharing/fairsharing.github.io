import { shallowMount } from "@vue/test-utils"
import Records from "./Records.vue"

const $route = {
    path: "/standards"
};

describe("Records.vue", () => {

    // Set up the wrapper
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(Records, {
            mocks: {$route}
        });
    });
    const title = "Standards";

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Records");
    });

    it("has a currentPath computed attribute", () => {
        expect(wrapper.vm.currentPath.toUpperCase()).toMatch(title.toUpperCase());
    });

    it("can execute the query with string search", async () => {
        wrapper.vm.searchString = "First";
        await wrapper.vm.getData();
        expect(wrapper.vm.content.length).toBeGreaterThan(0);
    });

    it("react to path change", async () => {
        $route.path = "Database";
        expect(wrapper.vm.currentPath).toBe($route.path);
    })

});
