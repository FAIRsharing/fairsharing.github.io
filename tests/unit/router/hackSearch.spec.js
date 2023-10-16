import {createLocalVue} from "@vue/test-utils";
import VueRouter from "vue-router";

import { hackSearch } from '@/router/hackSearch'

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
        expect(hackSearch(query)).toStrictEqual([{}, false]);
        query = {a:undefined};
        expect(hackSearch(query)).toStrictEqual([{}, false]);
        query = {clue: ''};
        expect(hackSearch(query)).toStrictEqual([{}, false]);
    });

});