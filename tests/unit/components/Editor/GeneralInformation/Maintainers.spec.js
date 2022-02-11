import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import Maintainers from "@/components/Editor/GeneralInformation/Maintainers.vue"
import recordStore from "@/store/recordData.js";
import usersStore from "@/store/users";
import sinon from "sinon";
import Client from "@/lib/Client/RESTClient";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
let maintainer = {
    username: 'jean',
    id: 100,
    orcid: '0000-'
};
recordStore.state.sections = {
    generalInformation: {
        data: {
            maintainers: [maintainer]
        },
        initialData: {
            maintainers: [maintainer]
        }
    }
};
const $store = new Vuex.Store({
    modules: {
        record: recordStore,
        users: usersStore
    }
});

let wrapper;

describe('Editor -> Maintainers.vue', () => {
    let restStub;

    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: [{name: "Terazus"}]
    });

    afterAll(() => {
        restStub.restore();
    })

    beforeEach(() => {
        wrapper = shallowMount(Maintainers, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("Maintainers");
        expect(wrapper.vm.getSection("generalInformation").data.maintainers).toStrictEqual([maintainer]);
    });

    it("can add a new maintainer", async () => {
        wrapper.vm.selectMaintainers();
        let count = wrapper.vm.maintainers.length;
        expect(wrapper.vm.menu).toStrictEqual({
            show: true,
            label: "Add maintainer",
            index: null,
            content: {
                name: null,
                id: null,
                orcid: null
            }
        });
        wrapper.vm.formValid = true;
        wrapper.vm.menu.content = maintainer;
        wrapper.vm.addItem(maintainer);
        // The same maintainer will not be added again.
        expect(wrapper.vm.maintainers.length).toEqual(count);
        let nextMaintainer = {
            username: 'another',
            id: 2222,
            orcid: null
        };
        wrapper.vm.menu.content = nextMaintainer;
        wrapper.vm.addItem(nextMaintainer);
        expect(wrapper.vm.maintainers.length).toEqual(count + 1);
    });

    it("can remove maintainers", () => {
        expect(wrapper.vm.maintainers.length).toEqual(2);
        wrapper.vm.removeMaintainer(0);
        expect(wrapper.vm.maintainers.length).toEqual(1);
    });

    it("determines if a maintainer is newly added", () => {
        expect(wrapper.vm.isNew(maintainer)).toBe(false);
        let nextMaintainer = {
            username: 'another',
            id: 2222,
            orcid: null
        };
        expect(wrapper.vm.isNew(nextMaintainer)).toBe(true);
    });

    it("avoids re-adding maintainers to the list", () => {
        wrapper.vm.maintainers.push(maintainer);
        expect(wrapper.vm.isAlreadyMaintainer(maintainer)).toBe(true);
        let nextMaintainer = {
            username: 'unknown',
            id: 1234,
            orcid: null
        };
        expect(wrapper.vm.isAlreadyMaintainer(nextMaintainer)).toBe(false);
    });

});
