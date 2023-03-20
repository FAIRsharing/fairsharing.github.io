import {createLocalVue, shallowMount} from "@vue/test-utils";
import Educational from "@/views/Static/Educational/Educational"
import Vuetify from "vuetify"
import VueSanitize from "vue-sanitize";

const vuetify = new Vuetify();
const localVue = createLocalVue();
localVue.use(VueSanitize)

let $route = {
    name: "Community",
    hash:'#faq9-3'
};

const originalClipboard = { ...global.navigator.clipboard };

describe("Privacy.vue", function(){
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
        expect(wrapper.name()).toMatch("Educational");
        wrapper.vm.$route.hash = '#anotherAnchor'
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
                "doi": "10.5281/zenodo.7737366",
                "copyButtonStatus": false
            }

        const mockDoi = `https://doi.org/${selectedInfoGraphic.doi}`;

        wrapper.vm.copyURL(selectedInfoGraphic)
        expect(navigator.clipboard.writeText).toBeCalledTimes(1);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockDoi)
    });

});
