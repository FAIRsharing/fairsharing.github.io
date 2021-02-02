import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import VueMeta from "vue-meta";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Record from "@/views/Records/Record.vue";
import GraphClient from "@/components/GraphClient/GraphClient.js";
import RESTClient from "@/components/Client/RESTClient.js";
import record from "@/store/record.js";
import users from "@/store/users.js";
import sinon from "sinon";

// Initializing context for mounting
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);

delete global.window.scrollTo;
global.window.scrollTo = () => {};

// Initializing store states and getters
users.state.user = function(){ return {
    isLoggedIn: true,
    credentials: {token: 123, username: 123}
}};
record.state.currentRecord.fairsharingRecord = {
    maintainers: [{username: 123}]
};
record.getters = {getField: () => () => { return [{username: 123}]}};
let $store = new Vuex.Store({
    modules: {
        record: record,
        users: users,
    }
}),
    $route = {
        path: "/",
        params: {id: "980190962"}
    };
const router = new VueRouter(),
    $router = { push: jest.fn() };

// Preparing mocks
let mocks = {
    graphMock: null,
    restMock: null,
    canEditStub: null,
    canClaimStub: null,
    claimRecord: null,
    restore: function(mockKey) {
        this[mockKey].restore();
    },
    restoreAll: function(){
        this.restore("graphMock");
        this.restore("restMock");
        this.restore("canEditStub");
        this.restore("canClaimStub");
        this.restore("claimRecord");
    },
    setMock: function(mockKey, targetClass, targetMethod, returnedValue){
        this[mockKey] = sinon.stub(targetClass, targetMethod);
        this[mockKey].returns(returnedValue);
    },
    throwMock: function(mockKey, targetClass, targetMethod){
        this[mockKey] = sinon.stub(targetClass, targetMethod).throws(new Error("error"));
    }
};

describe("Record.vue", function() {
    let wrapper,
        vuetify,
        graphMockValue = {
            fairsharingRecord: {
                id: 980190962,
                abbreviation: "IAT",
                name: "I Am a Test",
                licences: [
                    {
                        name: "test",
                        url: "https://example.com"
                    }
                ],
                metadata: {
                    contacts: []
                },
                domains: [],
                subjects: [],
                taxonomies: [],
                userDefinedTags: []
            }
        };

    beforeAll( async () => {
        mocks.setMock("graphMock",
            GraphClient.prototype,
            "executeQuery",
            graphMockValue
            );
        mocks.setMock("canEditStub",
            RESTClient.prototype,
            "canEdit",
            true);
        mocks.setMock("canClaimStub",
            RESTClient.prototype,
            "canClaim",
            true);
        mocks.setMock("claimRecord",
            RESTClient.prototype,
            "claimRecord",
            true);
        vuetify = new Vuetify();
    });
    afterAll( () => {
        mocks.restoreAll();
    });
    afterEach(() => {
        wrapper.destroy();
    });
    beforeEach(async () => {
        wrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
    });

    it("Testing currentRoute & getTitle with a integer style", () => {
        expect(wrapper.name()).toMatch("Record");
        expect(wrapper.vm.getTitle).toBe('FAIRsharing | 980190962');
        expect(wrapper.vm.currentRoute).toBe('980190962');
    });

    it("Testing currentRoute & getTitle with a DOI style", () => {
        $route.params.id = "FAIRsharing.abc";
        expect(wrapper.vm.getTitle).toBe('FAIRsharing | 10.25504/FAIRsharing.abc');
        expect(wrapper.vm.currentRoute).toBe('10.25504/FAIRsharing.abc');
        expect(wrapper.vm.$meta().refresh().metaInfo.title).toBe("FAIRsharing | IAT");
    });

    it('Can react to user logging out', () => {
        wrapper.vm.canEdit = true;
        $store.state.users.user = function (){return {isLoggedIn: false}};
        expect(wrapper.vm.canEdit).toBe(false);
    });

    it("Testing buttons methods", async () => {
        $store.state.users.user = function (){return {isLoggedIn: false}};
        let buttons = wrapper.vm.getMenuButtons;
        buttons[0].method();
        expect($router.push).toHaveBeenCalledWith({path: "980190962/edit", params: {fromRecordPage: true}});
        buttons[1].method();
        expect($router.push).toHaveBeenCalledWith({path: "/accounts/login", query: {goTo: "/980190962"}});
        expect($router.push).toHaveBeenCalledTimes(2);
        expect(buttons[2].method()).toBe(null);
        expect(buttons[3].method()).toBe(null);
        $store.state.users.user = function (){return {
            isLoggedIn: true,
            credentials: {token: 123, username: 123}
        }};
        await buttons[1].method();
        expect(wrapper.vm.claimedTriggered).toBe(true);
        expect(wrapper.vm.canClaim).toBe(false);
    });

    it("can properly fetch a record history", async () => {
        mocks.setMock("restMock",
            RESTClient.prototype,
            "executeQuery",
            {data: "abc"}
        );
        await wrapper.vm.getHistory();
        mocks.restore("restMock");
    });

    it("can process check claim status errors", async () => {
        mocks.restore("canClaimStub");
        mocks.setMock("canClaimStub",
            RESTClient.prototype,
            "canClaim",
            {error: {response: {data: ""}}}
        );
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.canClaim).toBe(false);

        mocks.restore("canClaimStub");
        mocks.setMock("canClaimStub",
            RESTClient.prototype,
            "canClaim",
            {error: {response: {data: {existing: true}}}}
        );
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.alreadyClaimed).toBe(false);

        wrapper.vm.alreadyClaimed = false;
        $store.state.users.user = function(){ return {
            isLoggedIn: true,
            credentials: {token: 123, username: 567}
        }};
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.alreadyClaimed).toBe(true);
        $store.state.users.user = function(){ return {
            isLoggedIn: true,
            credentials: {token: 123, username: 123}
        }};

        mocks.restore("canClaimStub");
        mocks.setMock("restMock",
            RESTClient.prototype,
            "executeQuery",
            {data: true}
        );
        await wrapper.vm.checkClaimStatus();
        expect(wrapper.vm.alreadyClaimed).toBe(true);
        mocks.restore("restMock");
        mocks.setMock("canClaimStub",
            RESTClient.prototype,
            "canClaim",
            {}
        );
    });

    it("can process request ownership errors", async () => {
        mocks.restore("claimRecord");
        mocks.setMock("restMock",
            RESTClient.prototype,
            "executeQuery",
            {data: {error: true}}
        );
        await wrapper.vm.requestOwnership();
        expect(wrapper.vm.error).toBe("Sorry, your request to claim this record failed. Please contact us.");
        mocks.restore("restMock");
        mocks.setMock("claimRecord",
            RESTClient.prototype,
            "claimRecord",
            true);
        mocks.restore("restMock");
    });

    it("getData can process errors", async () => {
        mocks.restore("graphMock");
        mocks.throwMock("graphMock",
            GraphClient.prototype,
            "executeQuery");
        await wrapper.vm.getData();
        expect(wrapper.vm.error).toBe("error");
        mocks.restore("graphMock");

        wrapper.vm.error = null;
        graphMockValue.fairsharingRecord.recordAssociations = [];
        graphMockValue.fairsharingRecord.reverseRecordAssociations = [];
        mocks.setMock("graphMock",
            GraphClient.prototype,
            "executeQuery",
            graphMockValue);
        await wrapper.vm.getData();
        expect(wrapper.vm.error).toBe(null);
        mocks.restore("graphMock");
    });

    it("can prepare records associations", async () => {
        let associations = [
            {
                fairsharingRecord: {
                    name: "name",
                    registry: "collection"
                },
                recordAssocLabel: 'collects',
            }
        ];
        wrapper.vm.prepareAssociations(associations, []);
        expect(wrapper.vm.recordAssociations).toStrictEqual([
            {
                registry: "collection",
                subject: "I Am a Test",
                id: undefined,
                name: "name",
                type: undefined,
                recordAssocLabel: 'collects'
            }
        ]);

        graphMockValue.fairsharingRecord.registry = "collection";
        mocks.restore("graphMock");
        mocks.setMock("graphMock",
            GraphClient.prototype,
            "executeQuery",
            graphMockValue);
        await wrapper.vm.getData();
        wrapper.vm.prepareAssociations(associations, []);
        expect(wrapper.vm.recordAssociations).toStrictEqual([
            {
                registry: "collection",
                subject: "I Am a Test",
                id: undefined,
                name: "name",
                type: undefined,
                recordAssocLabel: 'is collected by'
            }
        ]);

        graphMockValue.fairsharingRecord.registry = "policy";
        associations[0].recordAssocLabel = "recommends";
        associations[0].fairsharingRecord.registry = "policy";
        mocks.restore("graphMock");
        mocks.setMock("graphMock",
            GraphClient.prototype,
            "executeQuery",
            graphMockValue);
        await wrapper.vm.getData();
        wrapper.vm.prepareAssociations(associations, []);
        expect(wrapper.vm.recordAssociations).toStrictEqual([
            {
                registry: "policy",
                subject: "I Am a Test",
                id: undefined,
                name: "name",
                type: undefined,
                recordAssocLabel: 'is recommended by'
            }
        ]);
    });
});
