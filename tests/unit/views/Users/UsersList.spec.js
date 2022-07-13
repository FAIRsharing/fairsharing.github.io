import {createLocalVue, shallowMount} from "@vue/test-utils";
import UsersList from "@/views/Users/UsersList"
import Vuetify from "vuetify"
import Vuex from "vuex";
import usersStore from "@/store/users";
import sinon from "sinon";
import allUsersQuery from "@/lib/GraphClient/queries/getAllUsers.json";
import GraphClient from "@/lib/GraphClient/GraphClient";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(Vuex);
const $store = new Vuex.Store({
    modules: {
        users: usersStore,
    },
});

describe("UsersList.vue", function () {
    let wrapper;

    let graphStub;

    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.withArgs(allUsersQuery).returns({
        allUsers: [
            {id: 1, username: 'one', email: 'one@one.com'}
        ]
    })

    afterAll(() => {
        graphStub.restore();
    })


    beforeEach( () => {
        wrapper =  shallowMount(UsersList, {
            vuetify,
            localVue,
            mocks: {$store},
        })
    });

    afterEach(() => {
        wrapper.destroy();
    });

    afterAll(() => {
        graphStub.restore();
    })

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("UsersList");
    });

});
