import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import RestClient from "@/lib/Client/RESTClient.js"
import LinkOverlay from "@/components/Editor/Organisations/LinkOverlay.vue"
import recordStore from "@/store/recordData.js"
import editorStore from "@/store/editor.js"
import userStore from "@/store/users.js"
import ExternalClient from "@/lib/Client/ExternalClients";
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

const organisation = {
    "items":[{
        "country":{
            "country_code": "GB",
            "country_name": "Great Britain"
        },
        "links":["http://www.obsmedical.com/"],
        "name":"OBS Medical (United Kingdom)",
        "types":["Company"],
        "ror_link": "https:rororere.rere",
        "parent_ror_links": ["https:rororere.rere1", "https:rororere.rere2"],
        "child_ror_links": ["https:rororere.rere3", "https:rororere.rere4"]
    }],
};

describe("Edit -> LinkOverlay.vue", function() {
    let wrapper;
    let restStub;
    let fetchStub;

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
        expect(wrapper.vm.$options.name).toMatch("LinkOverlay");
        expect(wrapper.vm.organisationLinks).toStrictEqual([{id: 1, organisation: {name: "abc", id: 1}}]);
    });

    it("can check removeCountry", () => {
        wrapper.vm.menus.newOrganisation.data.country_ids = [{id:1,label:'b'}]
        wrapper.vm.removeCountry({id:1,label:'b'})
        expect(wrapper.vm.menus.newOrganisation.data.country_ids).toStrictEqual([]);
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
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data:{
                error: "I am an error"
            }});
        wrapper.vm.menus.newOrganisation.logoData = {
            data: "data:image/png;base64,AnotherTest"
        };
        wrapper.vm.menus.newOrganisation.data = {
            name: "test",
            homepage: "https://example.com/test",
            organisation_type_ids: [{id:1, name: "?"}],
            country_ids: [{id:1}],
            parent_ror_links: [
            {
                id: "https:rororere.rere1"
              },
              {
                id: "https:rororere.rere2"
              }
            ],
            child_ror_links: [
            {
              id : "https:rororere.rere3"
            }
          ]
        };
        wrapper.vm.menus.newOrganisation.data.country_ids = [];
        await wrapper.vm.createNewOrganisation();
        expect(wrapper.vm.menus.newOrganisation.error).toBe("I am an error");
        wrapper.vm.menus.newOrganisation.logoData = null;
        restStub.returns({
            data: {
                data: {
                    id: 1,
                    attributes: {
                        name: "test",
                        relationships: [
                         { type: "Parent",
                         id: "https:rororere.rere1"
                        },
                        { type: "Parent",
                         id: "https:rororere.rere2"
                        },
                        {type: "Child",
                        id : "https:rororere.rere3"
                        }
                    ]
                    },
                    types: [{name: "?"}]

                }
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
    });

    it("can create a new grant", async () => {
        restStub.restore();
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data:{
            error: "I am an error"
        }});
        wrapper.vm.menus.newGrant.data = {
            name: "grant",
            description: "http://example.com/grant"
        };
        await wrapper.vm.createNewGrant();
        expect(wrapper.vm.menus.newGrant.error).toBe("I am an error");
        restStub.returns({data:{
            name: "grant",
            description: "another description",
            id: 123
        }});
        await wrapper.vm.createNewGrant();
        expect(wrapper.vm.grants).toStrictEqual([{
            name: "grant",
            description: "another description",
            id: 123
        }]);
        restStub.restore();
    });

    it('can run a custom filter on autocompletes', () => {
        expect(wrapper.vm.customFilter({name: "this", alternativeNames: []}, "that")).toBe(false);
        expect(wrapper.vm.customFilter({name: "this", alternativeNames: []}, "this")).toBe(true);
    });

    it("can check removeType", () => {
        wrapper.vm.menus.newOrganisation.data.organisation_type_ids = [{id:1,label:'typeA'}]
        wrapper.vm.removeType({id:1,label:'typeA'})
        expect(wrapper.vm.menus.newOrganisation.data.organisation_type_ids).toStrictEqual([]);
    });

    it("can check addNewOrganisation", () => {
        wrapper.vm.menus.show = '';
        wrapper.vm.enterName = false
        wrapper.vm.importROR = true
        wrapper.vm.addNewOrganisation()
        expect(wrapper.vm.menus.show).toBe('organisation')
        expect(wrapper.vm.enterName).toBe(true)
        expect(wrapper.vm.importROR).toBe(false)
    });

    it("can getOrganisations List", async() => {
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data:organisation});
        const expectedOrganisation = [{
                "country":{
                    "country_code": "GB",
                    "country_name": "Great Britain"
                },
                "links":["http://www.obsmedical.com/"],
                "name":"OBS Medical (United Kingdom)",
                "ror_link": "https:rororere.rere",
                "types":["Company"],
                "parent_ror_links": ["https:rororere.rere1", "https:rororere.rere2"],
                "child_ror_links": ["https:rororere.rere3", "https:rororere.rere4"]
            }]
        wrapper.vm.enterName = true
        wrapper.vm.importROR = false
        wrapper.vm.validName = true
        wrapper.vm.menus.newOrganisation.data.name = 'Oxford'
        wrapper.vm.menus.newOrganisation.data.child_ror_links[1] = 'https:rororere.rere4'
        await wrapper.vm.getOrganisations();
        expect(wrapper.vm.enterName).toBe(false)
        expect(wrapper.vm.importROR).toBe(true)
        expect(wrapper.vm.validName).toBe(true)
        expect(wrapper.vm.organisationsList).toStrictEqual(expectedOrganisation);
        expect(wrapper.vm.organisationsNameList).toStrictEqual(["OBS Medical (United Kingdom)"])
        fetchStub.restore();

    });

    it("cannot getOrganisations List", async() => {
        const fetchOrganisation = {}
        fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
        fetchStub.returns({data:fetchOrganisation});
        const expectedOrganisation = []
        wrapper.vm.enterName = true
        wrapper.vm.importROR = false
        wrapper.vm.validName = true
        wrapper.vm.menus.newOrganisation.data.name = 'abc'
        await wrapper.vm.getOrganisations();
        expect(wrapper.vm.enterName).toBe(true)
        expect(wrapper.vm.importROR).toBe(false)
        expect(wrapper.vm.validName).toBe(false)
        expect(wrapper.vm.organisationsList).toStrictEqual(expectedOrganisation);
        fetchStub.restore();

    });

    it("can select selectOrganisation", async () => {
        wrapper.vm.enterName = false;
        wrapper.vm.organisationsList = ["abc"]
        wrapper.vm.menus.newOrganisation.data = {
            "name": "abc",
            "homepage": "http://www.abc.com",
            "organisation_type_ids": "dummy",
            "country_ids":"dummy",
            "parent_ror_links": ["https:rororere.rere1", "https:rororere.rere2"],
            "child_ror_links": ["https:rororere.rere3"]
        }
        wrapper.vm.selectOrganisationFromList()
        wrapper.vm.menus.newOrganisation.selectOrganisation = {
            name: "abc",
            links: ['http://www.abc.com'],
            type: ['dummy'],
            country:{
                country_code: "DM",
                country_name: "dummy"
            },
            parent_ror_links: [
              {
                id: "https:rororere.rere1"
              },
              {
                id: "https:rororere.rere2"
              }
          ],
          child_ror_links: [
            {
            id : "https:rororere.rere3"
          }
        ]
        }
        expect(wrapper.vm.menus.newOrganisation.data).toStrictEqual({
            "name": "abc",
            "homepage": "http://www.abc.com",
            "organisation_type_ids": "dummy",
            "country_ids":"dummy",
            "parent_ror_links": ["https:rororere.rere1", "https:rororere.rere2"],
            "child_ror_links": ["https:rororere.rere3"]
        });
    });

    it("can check clearForm", () => {
        wrapper.vm.enterName = false
        wrapper.vm.importROR = true
        wrapper.vm.validName = false
        wrapper.vm.menus.newOrganisation.data.name = 'xyz'
        wrapper.vm.$refs['createNewOrganisation'] = {
            reset: jest.fn()
        };
        wrapper.vm.clearForm()
        expect(wrapper.vm.enterName).toBe(true)
        expect(wrapper.vm.importROR).toBe(false)
        expect(wrapper.vm.validName).toBe(true)
        expect(wrapper.vm.menus.newOrganisation.data.name).toBe('')
    });
});
