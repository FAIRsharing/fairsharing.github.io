import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
// import Record from "@/store/recordData.js"
import Support from "@/components/Records/Record/Support.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

// Record.state.currentRecord["fairsharingRecord"] = {
//     metadata: {
//         contacts: [
//             {
//                 contact_name: "A Contact",
//                 contact_email: "contact@goatse.cx"
{/*            },*/}
//             {
//                 contact_name: "B Contact",
//                 contact_email: "b contact@goatse.cx",
//                 contact_orcid: "orcid id"
//             }
//         ],
//         support_links:[
//             {
//                 url: "some url",
//                 type: "blog/web"
//             },
//         ]
//     },
//     subjects:[],
//     domains:[],
//     taxonomies:[],
//     userDefinedTags:[],
// };

/*const $store = new Vuex.Store({
    modules: {
         record:Record
    }});*/

describe("Support.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Support, {
            localVue,
            vuetify,
            // mocks: {$store}
        });
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Support");
        // expect(wrapper.vm.getField('metadata')['contacts'][0].contact_name).toMatch("A Contact");
        // expect(wrapper.vm.getField('metadata')['contacts'][0].contact_email).toMatch("contact@goatse.cx");
    });

/*
    it("can be check the reaction of page if appropriate data not provided for support", () => {
        let mockData;
        expect(wrapper.vm.generateSupport()).toStrictEqual({
            'blog/web': {
                data: [{
                    url: "some url",
                    type: "blog/web"
                }],
                icon: 'blog_web'
            },
            contacts: {
                data: [
                    {
                        contact_name: "A Contact",
                        contact_email: "contact@goatse.cx"
                    },
                    {
                        contact_name: "B Contact",
                        contact_email: "b contact@goatse.cx",
                        contact_orcid: "orcid id"
                    }
                ],
                icon:'contacts'
            }
        })

        mockData = {
            fairsharingRecord: {
                licences: [],
                metadata: {},
                taxonomies: [
                    {label: "asasd turdus"},
                ],
                subjects: [
                    {label: "asdasd Fun"},
                ],
                domains: [
                    {label: "asasd"},
                ],
                userDefinedTags: [{label: 'b'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateSupport()).toStrictEqual({})

        mockData = {
            fairsharingRecord: {
                metadata: {
                    contacts: [
                        {
                            contact_name: "A Contact",
                            contact_email: "contact@goatse.cx"
                        },
                        {
                            contact_name: "B Contact",
                            contact_email: "b contact@goatse.cx",
                            contact_orcid: "orcid id"
                        }
                    ],
                    support_links: [
                        {
                            url: "some url",
                            type: "blog/web"
                        },
                        {
                            url: "some url 2",
                            type: "another type"
                        },
                        {
                            url: "some url 3",
                            type: "blog/web"
                        },
                    ]
                },
                taxonomies: [
                    {label: "asasd turdus"},
                ],
                subjects: [
                    {label: "asdasd Fun"},
                ],
                domains: [
                    {label: "asasd"},
                ],
                userDefinedTags: [{label: 'b'}]
            }
        }
        $store.commit("record/setCurrentRecord", mockData)
        expect(wrapper.vm.generateSupport()).toStrictEqual({
            "blog/web": {
                data: [
                    {
                        url: "some url",
                        type: "blog/web"
                    },
                    {
                        url: "some url 3",
                        type: "blog/web"
                    }
                ],
                icon: "blog_web"
            },
            "another type": {
                data: [
                    {
                        url: "some url 2",
                        type: "another type"
                    }
                ],
                icon: "another_type"
            },
            contacts: {
                data: [
                    {
                        contact_name: "A Contact",
                        contact_email: "contact@goatse.cx"
                    },
                    {
                        contact_name: "B Contact",
                        contact_email: "b contact@goatse.cx",
                        contact_orcid: "orcid id"
                    }
                ],
                icon: "contacts"
            }
        })
    });
*/

});
