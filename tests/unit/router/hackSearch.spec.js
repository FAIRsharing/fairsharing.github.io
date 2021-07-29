import { hackSearch } from '@/router/hackSearch'
import {shallowMount, createLocalVue} from "@vue/test-utils";
import App from "@/App.vue"
const sinon = require("sinon");
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "@/router/routes.js";
import { Records } from "@/router/routes.js";

const localVue = createLocalVue()
localVue.use(VueRouter)

describe("hackSearch", () => {

    it("correctly re-writes old queries", () => {
        let query = {this: 'that'};
        expect(hackSearch(query)).toStrictEqual([{this: 'that'}, false]);
        query = {content: 'biodbcore'};
        expect(hackSearch(query)).toStrictEqual([{fairsharingRegistry: 'database'}, true]);
        query = {fairsharingRegistry: 'biodbcore'};
        expect(hackSearch(query)).toStrictEqual([{fairsharingRegistry: 'database'}, true]);
        query = {content: 'database'};
        expect(hackSearch(query)).toStrictEqual([{fairsharingRegistry: 'database'}, true]);
        query = {search_state: 'hidden'};
        expect(hackSearch(query)).toStrictEqual([{}, true]);
        query = {clue: ''};
        expect(hackSearch(query)).toStrictEqual([{}, true]);
    });

    it("hacks the search parameters before searching", async () => {
        jest.mock("@/views/Records/Records.vue", () => ({
            name: "Records",
            render: h => h("div")
        }))
        const router = new VueRouter({ routes })
        const wrapper = shallowMount(App, { localVue, router })

        router.push("/search")

        expect(wrapper.find(Records).exists()).toBe(true)

    });
});