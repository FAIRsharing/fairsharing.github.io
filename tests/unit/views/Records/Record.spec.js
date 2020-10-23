import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vuetify from "vuetify"
import VueRouter from "vue-router"
import Record from "@/views/Records/Record.vue";
import VueMeta from "vue-meta";
import Client from "@/components/GraphClient/GraphClient.js";
import RESTClient from "@/components/Client/RESTClient.js";
import record from "@/store/record.js";
import users from "@/store/users.js";
import fakeAssociations from "@/../tests/fixtures/fakeAssociations.json";
import Vue from "vue"

Vue.config.silent = true;
const sinon = require("sinon"),
    localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);
users.state.user = function(){
    return {
        isLoggedIn: true,
        credentials: {token: 123}
    }
};
record.state.currentRecord.fairsharingRecord.maintainers = [
    {username:123}
];
record.getters = {
    getField: () => () => {
        return [
            {username: "test"}
        ]
    }
};

let $store = new Vuex.Store({
    modules: {
        record: record,
        users: users,
    }
}),
    restStub,
    queryStub,
    canEditStub,
    canClaimStub;
const $route = {
    path: "/",
    params: {
        id: "980190962"
    }
},
    router = new VueRouter(),
    $router = { push: jest.fn() };

describe("Record.vue", function() {
    let wrapper,
        vuetify;

    beforeEach( async () => {
        queryStub = sinon.stub(Client.prototype, "executeQuery");
        restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        queryStub.withArgs(sinon.match.any).returns({
            fairsharingRecord:{
                id: 123,
                abbreviation: "abc",
                name: "test",
                licences: [
                    {
                        name: "test",
                        url: "https://example.com"
                    }
                ],
                metadata: {
                    contacts: []
                }
            }
        });
        canEditStub = sinon.stub(RESTClient.prototype, "canEdit");
        canEditStub.returns(true);
        canClaimStub = sinon.stub(RESTClient.prototype, "canClaim");
        canClaimStub.returns(true);
        vuetify = new Vuetify();
        wrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
    });
    afterEach( () => {
        Client.prototype.executeQuery.restore();
        restStub.restore();
        canEditStub.restore();
        canClaimStub.restore();
    });

    const path = "980190962";
    const title = "FAIRsharing | " + path;

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Record");
    });

    it("has a currentRoute computed property", () => {
        expect(wrapper.vm.currentRoute).toMatch(path);
        expect(wrapper.vm.getTitle).toBe(title);
        let $route = {
            path: "/",
            params: {
                id: "FAIRsharing.p9xm4v"
            }
        };
        const anotherWrapper = shallowMount(Record, {
            mocks: {$route, $store},
            localVue,
            vuetify
        });
        expect(anotherWrapper.vm['currentRoute']).toMatch("FAIRsharing.p9xm4v");

    });

    it("has it meta title dynamically set", () => {
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | abc");
    });

    it("react to path change", async () => {
        $route.params = {
            id: "123"
        };
        expect(wrapper.vm.currentRoute).toMatch("123");
    });

    it("can properly fetch a record history", async () => {
        await wrapper.vm.getHistory();
    });

    it("can check cleanString returns properly",  () =>{
        const term = 'hosein_mirian';
        let returnedValue = wrapper.vm.cleanString(term);
        expect(returnedValue).toBe('hosein mirian');
    });

    it("can check prepareAssociations returns a flat joined array ",()=>{
        let fakeAssociatedRecords = fakeAssociations['fakeAssociatedRecords'];
        let fakeReverseAssociatedRecords = fakeAssociations['fakeReverseAssociatedRecords'];
        wrapper.vm.currentRecord['fairsharingRecord'] = {
            name: "test",
            metadata: {
                year_creation: 2018
            }
        };
        wrapper.vm.prepareAssociations(fakeAssociatedRecords,fakeReverseAssociatedRecords);
        expect(wrapper.vm.recordAssociations.length).toBe(11);
        fakeReverseAssociatedRecords = [
            {
                "UNDEFINED": {
                    "name": "RDA Covid-19 WG Resources",
                    "id": 3012,
                    "registry": "collection"
                },
                "recordAssocLabel": "collects"
            },
        ];
        wrapper.vm.prepareAssociations(fakeAssociatedRecords,fakeReverseAssociatedRecords)
    });

    it("can check prepareAssociations returns for specific cases collected/recommended by",()=>{
        let fakeAssociatedRecords = fakeAssociations['fakeAssociatedRecords'];
        let fakeReverseAssociatedRecords = fakeAssociations['fakeReverseAssociatedRecords'];
        wrapper.vm.currentRecord['fairsharingRecord'] = {
            name: "test",
            registry: "collection",
            metadata: {
                year_creation: 2018
            }
        };
        wrapper.vm.prepareAssociations(fakeAssociatedRecords,fakeReverseAssociatedRecords);
        expect(wrapper.vm.recordAssociations[9].recordAssocLabel).toBe("is collected by");
        wrapper.vm.recordAssociations = [];
        wrapper.vm.currentRecord['fairsharingRecord'] = {
            name: "test",
            registry: "policy",
            metadata: {
                year_creation: 2018
            }
        };
        wrapper.vm.prepareAssociations(fakeAssociatedRecords,fakeReverseAssociatedRecords);
        expect(wrapper.vm.recordAssociations[10].recordAssocLabel).toBe("is recommended by");
    });

    it("can properly fetch record associations", async () => {
        queryStub.restore();
        queryStub = sinon.stub(Client.prototype, "executeQuery");
        queryStub.withArgs(sinon.match.any).returns({
            fairsharingRecord:{
                id: 123,
                type: "testType",
                name: "test",
                licences: [
                    {
                        name: "test",
                        url: "https://example.com"
                    }
                ],
                metadata: {},
                recordAssociations: [{}]
            }
        });
        let anotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify
        });
        expect(anotherWrapper.vm.recordAssociations.length).toBe(0);
    });

    it("can go to the edit page", () => {
        wrapper.vm.goToEdit();
        expect($router.push).toHaveBeenCalledWith({
            path: "123/edit",
            params: {
                fromRecordPage: true
            }
        });
    });

    it("can check if the user can claim a record", async () => {
        wrapper.vm.canClaim = false;
        restStub.withArgs(sinon.match.any).returns({data: {existing: false}});
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.canClaim).toBe(true);
        restStub.restore();
        canClaimStub.restore();
    });

    it("allows a logged in user to request to own/maintain the record", async () => {
        wrapper.vm.canClaim = true;
        restStub.withArgs(sinon.match.any).returns({data: {existing: false}});
        await wrapper.vm.requestOwnership();
        expect(wrapper.vm.canClaim).toBe(false);
        restStub.restore();
        canClaimStub.restore();
    });

    it("prevents re-requesting to maintain when a request fails", async () => {
        wrapper.vm.canClaim = true;
        restStub.withArgs(sinon.match.any).returns(
            {
                data: {
                    error: {
                        response: {
                            data: {
                                error: "Request failed."
                            }
                        }
                    }
                }
            }
        );
        await wrapper.vm.requestOwnership();
        expect(wrapper.vm.canClaim).toBe(false);
        restStub.restore();
    });

    it("handles errors when checking claim status", async() => {
        canClaimStub.restore();
        wrapper.vm.canClaim = true;
        restStub.withArgs(sinon.match.any).returns(
            {
                data: {
                    error: {
                        response: {
                            data: {
                                error: "Request failed."
                            }
                        }
                    }
                }
            }
        );
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.canClaim).toBe(false);
        restStub.restore();

        restStub.withArgs(sinon.match.any).returns(
            {
                data: {
                    error: {
                        response: {
                            data: {
                                error: "Request failed.",
                                existing: true
                            }
                        }
                    }
                }
            }
        );
        $store.state.users.user = function (){return {isLoggedIn: true, credentials: {token: 123}}};
        let anotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
        await anotherWrapper.vm.checkClaimStatus();
        expect(anotherWrapper.vm.alreadyClaimed).toBe(true);

        record.getters = {
            getField: () => () => {
                return [
                    {username: 123}
                ]
            }
        };
        users.state.user = function(){
            return {
                isLoggedIn: true,
                credentials: {username: 123}
            }
        };
        $store = new Vuex.Store({
            modules: {
                record: record,
                users: users,
            }
        });

        let againAnotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
        await againAnotherWrapper.vm.checkClaimStatus();
        expect(againAnotherWrapper.vm.alreadyClaimed).toBe(false);
        expect(againAnotherWrapper.vm.canClaim ).toBe(false);

        restStub.restore();

    });

    it("can check if a logged in user can edit the record", async () => {
        canClaimStub.restore();
        canEditStub.restore();

        restStub.withArgs(sinon.match.any).returns({data: {id: 123}});
        await wrapper.vm.canEditRecord();
        expect(wrapper.vm.canEdit).toBe(true);
        restStub.restore();

        restStub.withArgs(sinon.match.any).returns({
            data: {error: {response: {data: "error"}}}
        });
        await wrapper.vm.canEditRecord();
        expect(wrapper.vm.canEdit).toBe(false);
        restStub.restore();
        users.state.user = function(){
            return { isLoggedIn: false }
        };
        const anotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
        await anotherWrapper.vm.canEditRecord();
        expect(anotherWrapper.vm.canEdit).toBe(false);
    });

    it("testing the action buttons methods", async () => {
        $router.push = jest.fn();
        users.state.user = function(){
            return { isLoggedIn: false }
        };
        let newWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
        restStub.withArgs(sinon.match.any).returns({data: {created: true}});
        let buttons = newWrapper.vm.getMenuButtons;

        buttons[0].method();
        expect($router.push).toHaveBeenCalledWith({path: "123/edit", params: {fromRecordPage: true}});
        expect($router.push).toHaveBeenCalledTimes(1);

        buttons[1].method();
        expect($router.push).toHaveBeenCalledWith({path: "/accounts/login", query: {goTo: "/123"}});
        expect($router.push).toHaveBeenCalledTimes(2);

        expect(buttons[2].method()).toBe(null);
        expect(buttons[3].method()).toBe(null);


        $store.state.users.user = function (){return {isLoggedIn: true, credentials: {token: 123}}};
        let anotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
        buttons = anotherWrapper.vm.getMenuButtons;
        buttons[1].method();
        expect($router.push).toHaveBeenCalledTimes(2);
        expect(anotherWrapper.vm.canClaim).toBe(false);
    });
});
