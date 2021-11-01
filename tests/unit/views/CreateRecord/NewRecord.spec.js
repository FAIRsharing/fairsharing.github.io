import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import CreateRecord from "@/views/CreateRecord/NewRecord.vue"
import usersStore from "@/store/users.js";
import recordStore from "@/store/recordData.js";
import editorStore from "@/store/editor.js";
import countriesQuery from "@/lib/GraphClient/queries/getCountries.json"
import typesQuery from "@/lib/GraphClient/queries/getRecordsTypes.json"
import tagsQuery from "@/lib/GraphClient/queries/geTags.json"
import getDuplicates from "@/lib/GraphClient/queries/getDuplicates.json"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);

const $store = new Vuex.Store({modules: {
    users: usersStore,
    record: recordStore,
    editor: editorStore
}});
let $route = { name: "New_content", path: "/new" };
const router = new VueRouter();
const $router = { push: jest.fn() };

let restStub;
let graphStub;

describe("CreateRecord.vue", function() {
    let wrapper;
    let vuetify;

    beforeAll(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(countriesQuery).returns({
            searchCountries: []
        });
        graphStub.withArgs(typesQuery).returns({
            fairsharingRegistries: {
                records: [
                    {
                        name: "Standard",
                        recordTypes: [{
                            name: "terminology",
                            id: 1,
                            description: "abc"
                        }]
                    },
                    {
                        name: "Collection",
                        recordTypes: [{
                            name: "collection",
                            id: 3,
                            description: "abc"
                        }]
                    }
                ],
            }
        });
        graphStub.withArgs(tagsQuery).returns({
            searchTags: [
                {label: 'tag1'}
            ]
        });
    });

    afterAll(() => {
        graphStub.restore();
    });

    beforeEach(async () => {
        vuetify = new Vuetify();
        wrapper = await shallowMount(CreateRecord, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $route, $router}
        });
    });

    it("can be instantiated", async () => {
        expect(wrapper.name()).toMatch("NewRecordPage");
    });

    it("can create records", async () => {
        let checkForDups = jest.spyOn(wrapper.vm, "checkForDups");
        wrapper.vm.recordCreated = false;
        recordStore.state.sections.generalInformation.data.countries = [{id: 123}];
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                data: {
                    id: 1234,
                    type: "fairsharing-records"
                }
            }
        });
        graphStub.withArgs(getDuplicates).returns({ duplicateCheck: []})
        await wrapper.vm.createRecord();
        expect(checkForDups).toHaveBeenCalledTimes(1);
        expect($router.push).toHaveBeenCalledWith({path: "1234/edit"});

        editorStore.state.possibleDuplicates = [];
        wrapper.vm.submitAnyway = true;
        await wrapper.vm.createRecord();
        expect(checkForDups).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.recordCreated).toBe(true);

        editorStore.state.possibleDuplicates = [{record: 'another record'}];
        graphStub.withArgs(getDuplicates).returns({ duplicateCheck: [{record: 'another record'}]})
        wrapper.vm.submitAnyway = false;
        wrapper.vm.recordCreated = false;
        await wrapper.vm.createRecord();
        expect(checkForDups).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.recordCreated).toBe(false);

        restStub.restore();

        wrapper.vm.submitAnyway = true;
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({
            data: {
                error: {
                    response: {data: "error"}
                }}
        });
        await wrapper.vm.createRecord();
        expect(wrapper.vm.message.error).toBe(true);
        restStub.restore();
    });

    it("can check for duplicates", async () => {
        // Nothing should happen on the first few of these
        let fake_record = {
            metadata: {
                name: "Name of the Record",
                abbreviation: "NOTR",
                homepage: "http://wibble.com"
            }
        };
        graphStub.withArgs(getDuplicates).returns({ duplicateCheck: []})
        await wrapper.vm.checkForDups(fake_record);
        expect(wrapper.vm.possibleDuplicates).toStrictEqual([]);

        fake_record = {
            metadata: {
                name: "N",
                abbreviation: null,
                homepage: null
            }
        };
        graphStub.withArgs(getDuplicates).returns({ duplicateCheck: []})
        await wrapper.vm.checkForDups(fake_record);
        expect(wrapper.vm.possibleDuplicates).toStrictEqual([]);


        // Here's a working query.
        graphStub.withArgs(getDuplicates).returns({
            duplicateCheck: [
                {
                    id: 1,
                    name: "Possible Duplicate Record",
                    abbreviation: "PDR",
                    homepage: "https://www.nhm.ac.uk/discover/what-is-a-coprolite.html"
                }
            ]

        });
        editorStore.state.possibleDuplicates = [{record: "a record"}];
        await wrapper.vm.checkForDups(fake_record);
        expect(wrapper.vm.message.error).toBe(false);

        graphStub.restore();
    });

    it("sets the disableSubmit variable correctly", () => {
        editorStore.state.possibleDuplicates = [{record: "a record"}];
        wrapper.vm.formValid = false;
        wrapper.vm.submitAnyway = false;
        expect(wrapper.vm.disableSubmit()).toBe(true);
        wrapper.vm.formValid = true;
        expect(wrapper.vm.disableSubmit()).toBe(true);
        wrapper.vm.setSubmitAnyway();
        expect(wrapper.vm.submitAnyway).toBe(true);
        expect(wrapper.vm.disableSubmit()).toBe(false);
        wrapper.vm.tryAgain();
        expect(wrapper.vm.submitAnyway).toBe(false);
        expect(wrapper.vm.possibleDuplicates.length).toEqual(0);
    });


});
