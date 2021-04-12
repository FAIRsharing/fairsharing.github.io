import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import Vuetify from "vuetify"
import Contact from "@/components/Editor/GeneralInformation/Contact.vue"
import recordStore from "@/store/record.js";


const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();
let contact = {
    contact_name: 'jean',
    contact_email: 'jean@test.com',
    contact_orcid: '0000-'
};
recordStore.state.sections = {
    generalInformation: {
        data: {
            metadata: {
                contacts: [contact]
            }
        },
        initialData: {
            metadata: {
                contacts: [{field: 'nothere'}]
            }
        }
    }
};
const $store = new Vuex.Store({
    modules: {
        record: recordStore
    }
});

let wrapper;

describe('Editor -> Contact.vue', () => {

    beforeEach(() => {
        wrapper = shallowMount(Contact, {
            localVue,
            vuetify,
            mocks: {$store}
        });
    });

    it("can be mounted", () => {
        expect(wrapper.name()).toMatch("Contact");
        wrapper.vm.rules.isRequired();
        wrapper.vm.rules.isEmail();
        wrapper.vm.rules.isOrcid("0000");
        let contacts = [{
            contact_name: 'jean',
            contact_email: 'jean@test.com',
            contact_orcid: '0000-0000'
        }];
        wrapper.vm.contacts = contacts;
        expect(wrapper.vm.getSection("generalInformation").data.metadata.contacts).toStrictEqual(contacts)
        expect(wrapper.vm.isNew({field: 'avc'})).toBe(true)
    });

    it("can create a new contact", () => {
        wrapper.vm.createNewContact();
        expect(wrapper.vm.submitted).toBe(false);
        expect(wrapper.vm.menu).toStrictEqual({
            show: true,
            label: "Create new contact point",
            index: null,
            content: {
                contact_name: null,
                contact_email: null,
                contact_orcid: null
            }
        });
        wrapper.vm.formValid = true;
        wrapper.vm.menu.content = contact;
        wrapper.vm.addItem();
        expect(wrapper.vm.submitted).toBe(true);
    });

    it("can remove an existing contact", () => {
        wrapper.vm.contacts = [contact];
        wrapper.vm.removeContact(0);
        expect(wrapper.vm.contacts.length).toBe(0);
    });

    it("can edit an existing contact", () => {
        wrapper.vm.editContact({
            contact_name: null,
            contact_email: null,
            contact_orcid: null
        },0);
        expect(wrapper.vm.menu).toStrictEqual({
            show: true,
            label: "Apply changes to contact point",
            index: 0,
            content: {
                contact_name: null,
                contact_email: null,
                contact_orcid: null
            }
        });
        wrapper.vm.formValid = true;
        wrapper.vm.menu.content = contact;
        wrapper.vm.addItem();
        expect(wrapper.vm.submitted).toBe(true);
    });

    it('can add the contact', () => {
       wrapper.vm.addItem();
       expect(wrapper.vm.submitted).toBe(false);
    });
});
