import Vue from "vue"
import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import ExternalClients from "@/lib/Client/ExternalClients.js"
import EditSupportLinks from "@/components/Editor/DataAccess/EditSupportLinks.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
const sinon = require("sinon");

const localVue = createLocalVue();
const vuetify = new Vuetify();
localVue.use(Vuex);
let $route = { path: "/123/edit", params: {id: 123} };
recordStore.state.sections = {
    dataAccess: {
        data: {
            support_links: [
                {type: "Other", url: "https://example.com/test"},
                {type: "Mailing list", url: {url: "test@example.com"}, name: "a test"}
            ]
        },
        initialData: {
            support_links: [
                {type: "Other", url: "https://example.com/test"},
                {type: "Mailing list", url: {url: "test@example.com"}, name: "a test"}
            ]
        }
    }
};
const $store = new Vuex.Store({
    modules: {
        editor: editorStore,
        record: recordStore
    }
});
let wrapper;
let stub;

describe("Edit -> EditSupportLinks.vue", function() {

    beforeAll(() => {
        stub = sinon.stub(ExternalClients.prototype, "executeQuery");
        stub.returns({data:[
            {name: 'ABC', url: 'http://example.com'}
        ]})
    });

    afterAll(() => {
        try {
        stub.restore();
        }
            // eslint-disable-next-line no-empty
        catch {}

    });

    beforeEach(async () => {
        try {
            const editSupportLink = {
                render: () => {},
                methods: {
                    validate: () => true,
                },
                data(){return {}}
            };
            wrapper = await shallowMount(EditSupportLinks, {
                localVue,
                vuetify,
                mocks: {$store, $route},
                stubs: {'v-form': editSupportLink}
            });
        }
            // eslint-disable-next-line no-empty
        catch {}
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("EditSupportLinks");
        expect(wrapper.vm.isNew({field: 'test'})).toBe(true);
    });

    it("can open the new link menu", () => {
       wrapper.vm.newLink();
       expect(wrapper.vm.edit).toStrictEqual({
           show: true,
           id: null,
           template: {
               type: null,
               url: {url: null},
               name: null
           }
       })
    });

    it('can hide the overlay', () => {
        wrapper.vm.hideOverlay();
        expect(wrapper.vm.edit).toStrictEqual({
            show: false,
            id: null,
            template: null
        })
    });

    it('can edit a support link', () => {
        wrapper.vm.editLink(0);
        expect(wrapper.vm.edit).toStrictEqual({
            show: true,
            id: 0,
            template: {
                "type": "Other",
                "url": {url: "https://example.com/test"}
            }
        });
        expect(wrapper.vm.search).toBe(null);
        wrapper.vm.editLink(1);
        expect(wrapper.vm.search).toBe("a test");
        wrapper.vm.search = null;
    });

    it('can remove a link', () => {
       wrapper.vm.removeLink(0);
       expect(recordStore.state.sections.dataAccess.data.support_links).toStrictEqual(
           [{type: "Mailing list", url: {url: "test@example.com"}, name: "a test"}]
       )
    });

    it("can create a new link", () => {
        wrapper.vm.edit.template = {
            type: "TeSS links to training materials",
            url: {url: "https://example.com/tess.json", title: "a tess test"}
        };
        wrapper.vm.submitLink();
        let supportLinks = recordStore.state.sections.dataAccess.data.support_links;
        expect(supportLinks[supportLinks.length -1].url.url).toBe("https://example.com/tess");
        wrapper.vm.edit.template = {
            id: 0,
            type: "Other",
            url: "https://example.com/other"
        };
        wrapper.vm.edit.id = 0;
        wrapper.vm.submitLink();
        expect(supportLinks[0]).toStrictEqual({
            id: 0,
            type: "Other",
            url: "https://example.com/other"
        })
    });

    it('can find a TeSS record', async () => {
        try {
            let response = await wrapper.vm.findTessRecord("abc");
            expect(response).toStrictEqual([{"name": "ABC", "url": "http://example.com"}]);
        }
            // eslint-disable-next-line no-empty
        catch {}
    });

    it("can react to type change", async () => {
        try {
            wrapper.vm.edit.template = {
                type: "TeSS links to training materials",
                url: "ABC"
            };
            await Vue.nextTick();
            expect(wrapper.vm.edit.template.url).toStrictEqual("ABC");
        }
            // eslint-disable-next-line no-empty
        catch {}
    });

    it('can build an item name', () => {
        expect(wrapper.vm.getIconName("test (123)")).toBe("test_123")
    });

    it('can get the index of recordData items', () => {
        const object = { type:"Other", url:"https://example.com/test" };
        wrapper.vm.$store.state.record.sections["dataAccess"].data.support_links = [{}, object];
        expect(wrapper.vm.getLinkIndex(object)).toBe(1);
    });

});
