import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import VueMeta from "vue-meta";
import Vuetify from "vuetify";
import VueRouter from "vue-router";
import Record from "@/views/Records/Record.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RESTClient from "@/lib/Client/RESTClient.js";
import record from "@/store/recordData.js";
import users from "@/store/users.js";
import sinon from "sinon";
import VueScrollTo from "vue-scrollto";

// Initializing context for mounting
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueMeta);
localVue.use(VueScrollTo,{})

// Initializing store states and getters
users.state.user = function(){ return {
    isLoggedIn: true,
    credentials: {token: 123, username: 123},
    watchedRecords: [1]
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
                    contacts: [],
                    support_links: []
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

    it("can be mounted with a target", async ()  => {
        let anotherWrapper = await shallowMount(Record, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router,
            propsData: {target: 123}
        });
        expect(anotherWrapper.name()).toMatch("Record");
        expect(anotherWrapper.vm.getTitle).toBe('FAIRsharing | 123');
        expect(anotherWrapper.vm.currentRoute).toBe(123);
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
        $store.state.users.user().isLoggedIn = false;
        wrapper.vm.getMenuButtons();
        expect(wrapper.vm.buttons[0].name()).toEqual("Edit record");
        expect(wrapper.vm.buttons[0].isDisabled()).toBe(false);
        expect(wrapper.vm.buttons[1].name()).toEqual("Request ownership");
        expect(wrapper.vm.buttons[1].isDisabled()).toBe(false);
        expect(wrapper.vm.buttons[2].name()).toEqual("Watch record");
        expect(wrapper.vm.buttons[2].isDisabled()).toBe(false);
        expect(wrapper.vm.buttons[3].name()).toEqual("View Relation Graph");
        expect(wrapper.vm.buttons[3].isDisabled()).toBe(false);
        expect(wrapper.vm.buttons[4].name()).toEqual("Have a suggestion/question ?");
        expect(wrapper.vm.buttons[4].isDisabled()).toBe(true);
        wrapper.vm.buttons[0].method();
        expect($router.push).toHaveBeenCalledWith({path: "/980190962/edit", params: {fromRecordPage: true}});
        wrapper.vm.buttons[1].method();
        expect($router.push).toHaveBeenCalledWith({path: "/accounts/login", query: {goTo: "/980190962"}});
        expect($router.push).toHaveBeenCalledTimes(2);
        await wrapper.vm.buttons[2].method();
        expect($router.push).toHaveBeenCalledWith({path: "/accounts/login", query: {goTo: "/980190962"}});
        expect(wrapper.vm.buttons[4].method()).toBe(null);
        $store.state.users.user = function (){return {
            isLoggedIn: true,
            credentials: {token: 123, username: 123},
            watchedRecords: []
        }};
        expect(wrapper.vm.buttons[0].isDisabled()).toBe(!wrapper.vm.canEdit);
        expect(wrapper.vm.buttons[1].isDisabled()).toBe(!wrapper.vm.canClaim);
        await wrapper.vm.buttons[1].method();
        expect(wrapper.vm.claimedTriggered).toBe(true);
        expect(wrapper.vm.canClaim).toBe(false);
        wrapper.vm.buttons[3].method();
        expect($router.push).toHaveBeenCalledWith({path: "/graph/980190962"});
    });

    it("runs the watch method", async () => {
        mocks.setMock("restMock",
            RESTClient.prototype,
            "executeQuery",
            {
                data: {
                    modification: 'success'
                }
            }
        );
        expect(wrapper.vm.isWatching()).toBe(false);
        let changeWatchRecord = jest.spyOn(wrapper.vm, "changeWatchRecord");
        wrapper.vm.getMenuButtons();
        expect(wrapper.vm.buttons[2].name()).toEqual("Watch record");
        await wrapper.vm.buttons[2].method();
        expect(changeWatchRecord).toHaveBeenCalledWith(true);
        mocks.restore("restMock");
        $store.state.users.user = function (){return {
            isLoggedIn: true,
            credentials: {token: 123, username: 123},
            watchedRecords: [980190962]
        }};
        expect(wrapper.vm.isWatching()).toBe(true);
        expect(wrapper.vm.buttons[2].name()).toEqual("Unwatch record");
        await wrapper.vm.buttons[2].method();
        expect(changeWatchRecord).toHaveBeenCalledWith(false);
        mocks.restore("restMock");
    });

    it("doesn't change watched records if the user wasn't updated", async() => {
        let changeWatch = jest.spyOn(wrapper.vm, "changeWatchRecord");
        let changeWatchUsers = jest.spyOn(wrapper.vm, "changeWatched");
        expect(changeWatchUsers).toHaveBeenCalledTimes(0);
        wrapper.vm.getMenuButtons();
        mocks.setMock("restMock",
            RESTClient.prototype,
            "executeQuery",
            {
            data: {
              modification: 'failure'
            }
          }
        );
        await wrapper.vm.buttons[2].method();
        expect(changeWatch).toHaveBeenCalled();
        expect(changeWatchUsers).toHaveBeenCalledTimes(0);
        mocks.restore("restMock");
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
            credentials: {token: 123, username: 567},
            watchedRecords: []
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
    });
});
