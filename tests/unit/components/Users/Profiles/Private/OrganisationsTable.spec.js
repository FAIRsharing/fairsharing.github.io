import { shallowMount, createLocalVue } from "@vue/test-utils"
import OrganisationsTable from "@/components/Users/Profiles/Private/OrganisationsTable";
import userStore from "@/store/users.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RESTClient from "@/lib/Client/RESTClient.js";
import Vuex from "vuex";
import VueRouter from "vue-router";
import sinon from "sinon";
import Vuetify from "vuetify";

const localVue = createLocalVue();
localVue.use(Vuex);
// Initializing store states and getters
userStore.state.user = function () {
    return {
        isLoggedIn: true,
        credentials: {token: 123, username: 123},
        watchedRecords: [1],
        records: {organisations: []},
        id: 1,
        is_super_curator: true
    }
};
let $store = new Vuex.Store({
        modules: {
            users: userStore
        }
    }),
    $route = {
        path: "/",
        params: {id: "1"},
        name:"PublicProfile"
    };
const router = new VueRouter(),
    $router = { push: jest.fn() };
// Preparing mocks
let mocks = {
    graphMock: null,
    restMock: null,
    editPublicUserStub: null,
    editUserStub: null,
    getUserStub: null,
    restore: function(mockKey) {
        this[mockKey].restore();
    },
    restoreAll: function(){
        this.restore("graphMock");
        this.restore("restMock");
        this.restore("editPublicUserStub");
        this.restore("editUserStub");
        this.restore("getUserStub");
    },
    setMock: function(mockKey, targetClass, targetMethod, returnedValue){
        this[mockKey] = sinon.stub(targetClass, targetMethod);
        this[mockKey].returns(returnedValue);
    },
    throwMock: function(mockKey, targetClass, targetMethod){
        this[mockKey] = sinon.stub(targetClass, targetMethod).throws(new Error("error"));
    }
};

describe('OrganisationTable.vue', () => {
    let wrapper,
        vuetify,
        graphMockValue = {user: {organisations: [{id: 4}, {id: 1}]}};


    beforeAll( async () => {
        mocks.setMock("graphMock",
            GraphClient.prototype,
            "executeQuery",
            graphMockValue
        );
        mocks.setMock("editPublicUserStub",
            RESTClient.prototype,
            "editPublicUser",
            "success");
        mocks.setMock("editUserStub",
            RESTClient.prototype,
            "editUser",
            "success");
        mocks.setMock("getUserStub",
            RESTClient.prototype,
            "getUser",
            {});
        vuetify = new Vuetify();
    });
    afterAll( () => {
        mocks.restoreAll();
    });
    afterEach(() => {
        wrapper.destroy();
    });
    beforeEach(async () => {
        wrapper = await shallowMount(OrganisationsTable, {
            mocks: {$route, $store, $router},
            localVue,
            vuetify,
            router
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("OrganisationsTable");
        expect(wrapper.vm.perPage).toBe(5)
        delete $route.params.id
    });

    it("can process organisation types", () => {
        $route.params.id="1"
        let obj = [
            {
                name: 'one',
            },
            {
                name: 'two'
            }
        ];
        expect(wrapper.vm.objToList(obj)).toEqual('one, two');

    })

    it("can close delete dialog", () => {
        wrapper.vm.closeDelete()
        expect(wrapper.vm.selectedOrganisationID ).toBe(-1);

    })

    it("can close delete item", () => {
        const item = {id:4};
        wrapper.vm.deleteItem({id:4})
        expect(wrapper.vm.selectedOrganisationID ).toBe(item.id);
    })

    it("can check delete confirm method", async () => {
        wrapper.vm.selectedOrganisationID = 4
        await wrapper.vm.deleteItemConfirm()
        expect(wrapper.vm.userOrganisations).toStrictEqual([{id:1}]);
        $store.state.users.user = function (){return {
            isLoggedIn: true,
            credentials: {token: 123, username: 123},
            is_super_curator: true
        }};
        $route.params.id = "1";
        await wrapper.vm.deleteItemConfirm()
    })

    it("can check watcher behavior", () => {
        $store.state.users.user = function (){return {
            isLoggedIn: false,
            credentials: {token: 123, username: 123},
            is_super_curator: true
        }};
        $route.path = "another route";
        $route.name = "User";
        $store.state.users.user = function (){return {
            isLoggedIn: true,
        }};
        wrapper.vm.viewerCanManipulate()
        expect(wrapper.vm.userCanEditOrganisation).toBe(true);
        $store.state.users.user = function (){return {
            isLoggedIn: false,
        }};
        wrapper.vm.viewerCanManipulate()
        expect(wrapper.vm.userCanEditOrganisation).toBe(false);
    })


});
