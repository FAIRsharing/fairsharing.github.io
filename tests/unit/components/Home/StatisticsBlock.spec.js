import { shallowMount, createLocalVue } from "@vue/test-utils";
import StatisticsBlock from "@/components/Home/StatisticsBlock"
import Vuetify from "vuetify"
import Vuex from "vuex"
import RestClient from "@/lib/Client/RESTClient.js"
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex)
const vuetify = new Vuetify();

describe("StatisticsBlock.vue", function(){
    let wrapper;
    let restStub;

    beforeEach(() => {
        wrapper = shallowMount(StatisticsBlock, {
            vuetify,
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("StatisticsBlock");
    });

    it("can get statistics count data", async () => {
        restStub = sinon.stub(RestClient.prototype, "executeQuery");
        restStub.returns({data:{
                error: "I am an error"
            }});
        wrapper.vm.statsData = {
            contributors: "xa",
            resources: "?",
            views: 1
        };
        await wrapper.vm.getStatisticsCount();
        expect(wrapper.vm.statsData.error).toBe("I am an error");
        restStub.returns({data:{
                contributors: 3,
                resources: 33,
                views: 1
            }});
        await wrapper.vm.getStatisticsCount();
        expect(wrapper.vm.statsData).toStrictEqual({
            contributors: 3,
            resources: 33,
            views: 1
        });
    });
});