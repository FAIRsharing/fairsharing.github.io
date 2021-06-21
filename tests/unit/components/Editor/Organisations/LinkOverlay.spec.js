import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import RestClient from "@/lib/Client/RESTClient.js"
import LinkOverlay from "@/components/Editor/Organisations/LinkOverlay.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
recordStore.state.sections = {
    organisations: {data: [{id: 1, organisation: {name: "abc", id: 1}}]}
};
recordStore.state.editOrganisationLink = {
    showOverlay: true,
    data: {id: 1, organisation: {name: "abc", id: 1}},
    id: 0
};
editorStore.state.organisations = [];
editorStore.state.grants = [];
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore,
        users: userStore
    }
});
const formValidation = {
    render: () => {},
    methods: {
        validate: () => true,
    },
    data(){return {}}
};

describe("Edit -> LinkOverlay.vue", function() {
    let wrapper;
    let restStub;

    beforeEach(async () => {
        wrapper = await shallowMount(LinkOverlay, {
            localVue,
            vuetify,
            mocks: {$store},
            stubs: {'v-form': formValidation}
        });
    });

    it("can be mounted", () => {
        wrapper.vm.menus.show = "organisation";
        expect(wrapper.name()).toMatch("LinkOverlay");
        expect(wrapper.vm.organisationLinks).toStrictEqual([{id: 1, organisation: {name: "abc", id: 1}}]);
    });

    it("can react to change in logo", () => {
        const fileContents       = 'data:image/png;base64,TEST1';
        const readAsDataURL      = jest.fn();
        const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
            target: {result: fileContents}} )});
        const dummyFileReader    = {addEventListener, readAsDataURL, result: fileContents};
        window.FileReader        = jest.fn(() => dummyFileReader);
        wrapper.vm.menus.newOrganisation.data = {logo: {value: "123"}};
        expect(wrapper.vm.menus.newOrganisation.logoData.data).toBe("data:image/png;base64,TEST1");
        wrapper.vm.menus.newOrganisation.data = {logo: null};
        expect(wrapper.vm.menus.newOrganisation.logoData.data).toBe("data:image/png;base64,TEST1");
    });

    it("can hide the menu", () => {
        wrapper.vm.hideMenu();
        expect(wrapper.vm.menus.show).toBe(false);
        expect(wrapper.vm.editOrganisationLink.data).toStrictEqual({});
        expect(wrapper.vm.editOrganisationLink.id).toBe(null);
        expect(wrapper.vm.editOrganisationLink.showOverlay).toBe(false);
    });

    it("can confirm the modifications", () => {
        recordStore.state.editOrganisationLink = {
            showOverlay: true,
            data: {organisation: {name: "test", id: 2}},
            id: -1
        };
        wrapper.vm.confirmModifications();
        expect(wrapper.vm.organisationLinks).toStrictEqual(
            [{id: 1, organisation: {name: "abc", id: 1}}, {organisation: {name: "test", id: 2}}]
        );
        recordStore.state.editOrganisationLink = {
            showOverlay: true,
            data: {id: 1, organisation: {name: "work", id: 1}},
            id: 0
        };
        wrapper.vm.confirmModifications();
        expect(wrapper.vm.organisationLinks).toStrictEqual(
            [{id: 1, organisation: {name: "work", id: 1}}, {organisation: {name: "test", id: 2}}]
        );
    });

    it("can create a new organisation", async () => {
        try {
            restStub = sinon.stub(RestClient.prototype, "executeQuery");
            restStub.returns({
                data: {
                    error: "I am an error"
                }
            });
            wrapper.vm.menus.newOrganisation.logoData = {
                data: "data:image/png;base64,AnotherTest"
            };
            wrapper.vm.menus.newOrganisation.data = {
                name: "test",
                homepage: "https://example.com/test",
                organisation_type_ids: [{id: 1, name: "?"}]
            };
            await wrapper.vm.createNewOrganisation();
            expect(wrapper.vm.menus.newOrganisation.error).toBe("I am an error");
            wrapper.vm.menus.newOrganisation.logoData = null;
            restStub.returns({
                data: {
                    id: 1,
                    name: "test",
                    types: [{name: "?"}]
                }
            });
            await wrapper.vm.createNewOrganisation();
            expect(wrapper.vm.organisations).toStrictEqual([{
                id: 1,
                name: "test",
                types: ['?'],
                homepage: undefined,
                urlForLogo: undefined
            }]);
            restStub.restore();
        }
            // eslint-disable-next-line no-empty
        catch {

        }

    });

    it("can create a new grant", async () => {
        try {

            restStub = sinon.stub(RestClient.prototype, "executeQuery");
            restStub.returns({
                data: {
                    error: "I am an error"
                }
            });
            wrapper.vm.menus.newGrant.data = {
                name: "grant",
                description: "http://example.com/grant"
            };
            await wrapper.vm.createNewGrant();
            expect(wrapper.vm.menus.newGrant.error).toBe("I am an error");
            restStub.returns({
                data: {
                    name: "grant",
                    description: "another description",
                    id: 123
                }
            });
            await wrapper.vm.createNewGrant();
            expect(wrapper.vm.grants).toStrictEqual([{
                name: "grant",
                description: "another description",
                id: 123
            }]);
            restStub.restore();

        }
            // eslint-disable-next-line no-empty
        catch {

        }
    });

});
