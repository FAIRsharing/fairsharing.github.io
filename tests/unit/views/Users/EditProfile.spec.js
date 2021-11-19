import { shallowMount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import sinon from "sinon"
import EditProfile from "@/views/Users/EditProfile.vue"
import Client from "@/lib/Client/RESTClient.js"
import GraphClient from "@/lib/GraphClient/GraphClient"
import getUserQuery from "@/lib/GraphClient/queries/getUserMeta.json"
import getOrganisationsQuery from "@/lib/GraphClient/queries/Organisations/getOrganisations.json"
import getOrganisationsTypesQuery from "@/lib/GraphClient/queries/Organisations/getOrganisationTypes.json"
import userStore from "@/store/users";
import editorStore from "@/store/editor";

const localVue = createLocalVue();
localVue.use(Vuex);
userStore.state.user = function() {
    return {
        metadata: {
            preferences: {
                hide_email: true,
            },
            profile_type: "profile 1"
        },
        credentials: {
            username: "username",
            token: '123'
        }
    }
};

let $router = { push: jest.fn() };

let $store = new Vuex.Store({
    modules: {
        users: userStore,
        editor: editorStore
    }
});

describe("EditPrivateProfile.vue", () => {

    let wrapper,
        graphStub,
        profilesStub,
        userStub;

    beforeAll(() => {
        profilesStub = sinon.stub(Client.prototype, "getProfileTypes").returns([
            "profile 1",
            "profile 2"
        ])
        userStub = sinon.stub(Client.prototype, "getUser").returns({
            id: 1,
            username: "just a name",
            preferences: {
                hide_email: true,
                email_updates: false
            },
            third_party: false,
            organisations: [1, {id: 1}]
        })
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.withArgs(getUserQuery).returns({
            user: {organisations: [{id: 1}]}
        })
        graphStub.withArgs(getOrganisationsQuery).returns({
            searchOrganisations: [
                {id: 1, name: "org 1"},
                {id: 2, name: "org 2"}
            ]
        })
        graphStub.withArgs(getOrganisationsTypesQuery).returns({
            searchOrganisationTypes: [
                {id: 1, name: "org type 1"},
                {id: 2, name: "org type 2"}
            ]
        })
    });
    afterAll(() => {
        profilesStub.restore();
        graphStub.restore();
        userStub.restore();
    });

    beforeEach(async() => {
        wrapper = await shallowMount(EditProfile, {
            localVue,
            mocks: {$store, $router}
        });
    });

    it("can be instantiated", () => {
        const title = "EditProfile";
        expect(wrapper.name()).toMatch(title);

        for (const rule in wrapper.vm.rules) {
            expect(typeof wrapper.vm.rules[rule]()).toBe('function');
        }
    });

    it('can post the new user', async () => {
        let restStub = sinon.stub(Client.prototype, "executeQuery").returns({
            data: {
                modification: "failure"
            }
        });
        await wrapper.vm.updateProfile();
        expect($router.push).toHaveBeenCalledWith( {"path": "/accounts/profile"});
        expect(wrapper.vm.messages().getUser.message).toBe("Your profile was updated successfully.");
        restStub.restore();
        restStub = sinon.stub(Client.prototype, "executeQuery").returns({data: {error:
            {response: {data: {errors: {
                field: 'test', message: 'error'
            }}}}
        }});
        await wrapper.vm.updateProfile();
        expect(wrapper.vm.messages().updateProfile).toStrictEqual({
            message: { field: 'test', message: 'error' },
            error: true
        });
        restStub.restore();
    });

    it("can process errors", async () => {
        userStore.state.user = function() {return {metadata: {}}};
        $store = new Vuex.Store({modules: {
            users: userStore,
            editor: editorStore
        }});
        let anotherWrapper = await shallowMount(EditProfile, {
            localVue,
            mocks: {$store, $router}
        });
        expect(anotherWrapper.vm.formData).toBe(null);
    });

    it("disables the email edit field for third party users", () => {
        expect(wrapper.vm.isDisabled('email')).toBe(false);
        userStore.state.user = function() {return {metadata: {third_party: true}}};
        expect(wrapper.vm.isDisabled('email')).toBe(true);
    });

    it("can create a new organisation", async () => {
        let createOrganisationStub = sinon.stub(Client.prototype, 'createOrganisation').returns({
            id: 10,
            name: "an organisation"
        })
        wrapper.vm.userOrganisations = []
        await wrapper.vm.createOrganisation()
        expect(wrapper.vm.data.organisations[2]).toStrictEqual({id: 10, name: "an organisation"})
        expect(wrapper.vm.userOrganisations).toStrictEqual([{id: 10, name: "an organisation"}])
        expect(wrapper.vm.newOrganisation.error).toBeFalsy()

        createOrganisationStub.returns({
            error: {response: {data: "An error"}}
        })
        await wrapper.vm.createOrganisation()
        expect(wrapper.vm.newOrganisation.error).toBe('An error')
        createOrganisationStub.restore()
    })
});
