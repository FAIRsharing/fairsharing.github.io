import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import Header from "@/components/Navigation/Header.vue";
import { RouterLinkStub } from '@vue/test-utils';
import uiControllerStore from "@/store/uiController.js";
import usersStore from "@/store/users.js";
import {isEqual} from 'lodash';

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let $route = {
    name: "Standards",
    query: {fairsharingRegistry:'Standard'}
};

const $store = new Vuex.Store({
    modules: {
        uiController: uiControllerStore,
        users: usersStore,
    }
});

describe("Header.vue", function () {
    let wrapper;

    wrapper = shallowMount(Header, {
        localVue,
        vuetify,
        data: () => {
            return {
                links: [
                    {
                        label: "Standards",
                        name: "Standard",
                        link: "/standards",
                        active: false
                    },
                    {
                        label: "Databases",
                        name: "Database",
                        link: "/databases",
                        active: false
                    },
                    {
                        label: "Policies",
                        name: "Policy",
                        link: "/policies",
                        active: false
                    },
                    {
                        label: "Collections",
                        name: "Collection",
                        link: "/collections",
                        active: false
                    },
                    {
                        label: "Add content",
                        name: "New_content",
                        link: "/new",
                        active: false
                    },
                    {
                        label: "Stats",
                        name: "Statistics",
                        link: "/summary-statistics",
                        active: false
                    }
                ]
            }
        },
        mocks: {$store,$route},
        stubs: {
            RouterLink: RouterLinkStub
        }
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch('Header');
    })

    it("can update the uiController store's UIGeneralStatus state", () => {
        const expectedData = {
            headerVisibilityState: true,
            drawerVisibilityState: true,
        };
        wrapper.vm.toggleDrawerLeft();
        expect($store.state.uiController.UIGeneralStatus).toStrictEqual(expectedData);
    });

    it("sets the closePopup value", () => {
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(false);
        let status = false;
        wrapper.vm.closePopup(status);
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
        status = true;
        wrapper.vm.closePopup(status);
        expect(wrapper.vm.closeMenuStatus).toStrictEqual(status);
    })

    it("toggle button activeness using route changes", () => {
        wrapper.vm.$route.query = {};
        wrapper.vm.$route.name = 'Statistics';
        const selectedItem = wrapper.vm.links.find(item => item.name === 'Statistics');
        // expect selectedItem to be true
        expect(selectedItem.active).toBe(true)
        // expect all other items to be false when one is selected
        wrapper.vm.links.forEach(item => {
            if (!isEqual(item, selectedItem)) {
                expect(item.active).toBe(false)
            }
        });
    })
});
