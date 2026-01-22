import {createLocalVue, shallowMount} from "@vue/test-utils";
import VueSanitize from "vue-sanitize";
import Vuetify from "vuetify"

import Educational from "@/views/Static/Educational/Educational"

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueSanitize)

let $route = {
    name: "Community",
    hash:'#faq9-3'
};

const originalClipboard = { ...global.navigator.clipboard };

describe("Educational.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(Educational, {
            localVue,
            vuetify,
            mocks: {$route},
            stubs: ['router-link']
        })
        const mockClipboard = {
            writeText: jest.fn(),
        };
        global.navigator.clipboard = mockClipboard;
    });

    afterEach(() => {
        jest.resetAllMocks();
        global.navigator.clipboard = originalClipboard;
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Educational");
        // wrapper.vm.$route.hash = '#anotherAnchor'
        $route.hash = "#anotherAnchor"
        wrapper = shallowMount(Educational, {
            localVue,
            vuetify,
            mocks: {$route},
            stubs: ['router-link']
        })
        expect(wrapper.vm.applyCss).toBe(false);
    });

    it("generates correct doi link", () => {
        let doiLink = `https://doi.org/${test}`;
        expect(wrapper.vm.generateDoiLink(test)).toEqual(doiLink);
    });

    it("can copy url correctly", () => {
        const selectedInfoGraphic =
            {
                "id": "nutshell",
                "logo": "nutshell.png",
                "text": "",
                "doi": "10.5281/zenodo.8191958",
                "url": "https://zenodo.org/record/8191958/files/0%20-%20FAIRsharing%20in%20a%20nutshell%20V1.1.pdf?download=1",
                "copyButtonStatus": false
            }

        const mockDoi = `https://doi.org/${selectedInfoGraphic.doi}`;

        wrapper.vm.copyURL(selectedInfoGraphic)
        expect(navigator.clipboard.writeText).toBeCalledTimes(1);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDoi)
    });

    it("can generatePopup", () => {
        const $route = {
            hash: '#nutshell'
        }
        wrapper = shallowMount(Educational, {
            localVue,
            vuetify,
            mocks: {$route},
            stubs: ['router-link', 'router-view']
        })
        const selectedInfoGraphic = {
          id: "nutshell",
          logo: "nutshell.png",
          text: "",
          doi: "10.5281/zenodo.7737366",
          url: "https://zenodo.org/record/8191958/files/0%20-%20FAIRsharing%20in%20a%20nutshell%20V1.1.pdf?download=1",
          copyButtonStatus: true,
          hash: "nutshell",
        };
        wrapper.vm.$route.hash
        wrapper.vm.infographicPopup.data = {};
        wrapper.vm.infographicPopup.show = false;
        wrapper.vm.infographicPopup.loading = false;
        wrapper.vm.generatePopup()
        expect(wrapper.vm.infographicPopup.data).toStrictEqual(selectedInfoGraphic)
        expect(wrapper.vm.infographicPopup.show).toBe(true)
        expect(wrapper.vm.infographicPopup.loading).toBe(true)
    });

});
