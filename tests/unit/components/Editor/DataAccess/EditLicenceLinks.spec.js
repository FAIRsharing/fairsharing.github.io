import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import EditLicenceLinks from "@/components/Editor/DataAccess/EditLicenceLinks.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(Vuex);
let $route = { path: "/123/edit", params: {id: 123} };
recordStore.state.sections = {
    dataAccess: {
        data: {
            licences: [
                {id: 222, name: "test", licence: {id: 123, name: "myLicence"}}
            ]
        },
        initialData: {
            licences: [
                {id: 222, name: "test", licence: {id: 123, name: "myLicence"}}
            ]
        }
    }
};
editorStore.state.availableLicences = [
    {id: 222, name: "test", licence: {id: 123}}
];
const $store = new Vuex.Store({
        modules: {
            editor: editorStore,
            record: recordStore
        }
    });
let wrapper;

describe("Edit -> EditLicenceLinks.vue", function() {

    beforeEach(async () => {
        const editLink = {
            render: () => {},
            methods: {
                validate: () => true,
            },
            data(){return {}}
        };
        wrapper = await shallowMount(EditLicenceLinks, {
            localVue,
            vuetify,
            mocks: {$store, $route},
            stubs: {'v-form': editLink}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("EditLicences");
        expect(wrapper.vm.isNew({field: 'test'})).toBe(true);
    });

    it('can display the overlay', () => {
        wrapper.vm.showCreator = true;
        wrapper.vm.showEditItem(0);
        expect(wrapper.vm.edit).toStrictEqual({
            show: true,
            template: {
                licence: {name: "myLicence", id: 123},
                target: 222,
                relation: undefined,
            },
            id: 0
        });
        wrapper.vm.showEditItem();
        expect(wrapper.vm.edit).toStrictEqual({show:true, id:null, template: {relation: null, target: null}})
    });

    it("can hide the overlay", () => {
       wrapper.vm.hideEdit();
       expect(wrapper.vm.edit).toStrictEqual({
           show: false,
           id: null,
           template: null
       });
       expect(wrapper.vm.showCreator).toBe(false)
    });

    it('can update a given link', () => {
        wrapper.vm.edit.template = {
            licence: {name: "myLicence", id: 123},
            target: 222,
                relation: undefined,
        };
        wrapper.vm.updateLink();
        expect(recordStore.state.sections.dataAccess.data.licences[0]).toStrictEqual({
            licence: {name: "myLicence", id: 123},
            id: 222,
            name: "test"
        });
        wrapper.vm.edit = {
            id: 0,
            template: {
                licence: {name: "myLicence", id: 123},
                target: 222,
                relation: undefined,
            }
        };
        wrapper.vm.updateLink();
        expect(recordStore.state.sections.dataAccess.data.licences[0]).toStrictEqual({
            licence: {name: "myLicence", id: 123},
            relation: undefined,
            id: 222,
            name: "test"
        });
    });

    it('can create a new licence', () => {
        wrapper.vm.newLicence = {name: "why not?"};
        wrapper.vm.edit.template = {};
        wrapper.vm.createNewLicence();
        expect(wrapper.vm.edit.template).toStrictEqual({licence:{name: "why not?"}});
        expect(wrapper.vm.showCreator).toBe(false);
        expect(wrapper.vm.newLicence).toStrictEqual({
            name: null,
            url: null
        });
    });

    it('can remove a licence link', () => {
        wrapper.vm.removeLicenceLink(1);
        expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(1);
        wrapper.vm.removeLicenceLink(0);
        expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(0);
    });
});
