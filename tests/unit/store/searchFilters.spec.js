import {actions, mutations, getters, buildFilters} from "@/store/searchFilters.js"
import RecordsData from '../../../tests/fixtures/getRecords.json'

describe('Mutation & Actions & Getters', () => {

    const returnedVal = {
        "searchFairsharingRecords": {
            "aggregations": RecordsData.aggregations
        }
    };
    let state = {
        rawFilters: [],
        filters: [],
        filterButtons: [],
    };
    actions.commit = jest.fn();
    const commit = jest.fn();

    it("can check fetchFilters actions", () => {
        actions.fetchFilters(state, returnedVal);
        expect(actions.commit).toHaveBeenCalledTimes(2);
    });

    it("can check resetFilterButtons actions", () => {
        actions.resetFilterButtons(state, 0);
        expect(actions.commit).toHaveBeenCalledTimes(3);
    });

    it("can check activateFilterButtonsItem actions", () => {
        actions.activateFilterButtonsItem({commit}, {
            active: false,
            filterName: 'isRecommended',
            title: 'RECOMMENDED',
            value: true
        }, 0);
        expect(actions.commit).toHaveBeenCalledTimes(3);
    });

    it("can check setFilters mutations", () => {
        mutations.setFilters(state, returnedVal);
        expect(state.rawFilters.length).toBeGreaterThan(0)
    });

    it("can check the setFilterButtons mutations", () => {
        mutations.setFilterButtons(state);
        expect(state.filterButtons.length).toBeGreaterThan(0)
    });

    it("can check the resetFilterButtons mutations", () => {
        mutations.resetFilterButtons(state, 1);
        expect(state.filterButtons[1]).toStrictEqual([
            {title: 'ALL', active: false, filterName: 'isRecommended'},
            {title: 'RECOMMENDED', active: false, filterName: 'isRecommended', value: true},
            {title: 'NOT RECOMMENDED', active: false, filterName: 'isRecommended', value: false},
        ]);
    });

    it("can check the activateFilterButtonsItem mutations", () => {
        const fakeSelectedItem = {
            active: false,
            filterName: 'isRecommended',
            title: 'RECOMMENDED',
            value: true
        }
        mutations.activateFilterButtonsItem(state, {
            'activeItem': fakeSelectedItem,
            'itemParentIndex': 1
        });
        expect(state.filterButtons[1]).toStrictEqual([
            {title: 'ALL', active: false, filterName: 'isRecommended'},
            {title: 'RECOMMENDED', active: true, filterName: 'isRecommended', value: true},
            {title: 'NOT RECOMMENDED', active: false, filterName: 'isRecommended', value: false},
        ]);
    });

    it("can check buildFilters function", () => {
        returnedVal["searchFairsharingRecords"].aggregations["notAvailableKey!"] = {};
        let aggregation = returnedVal['searchFairsharingRecords']['aggregations']
        const new_rawFilters = buildFilters(aggregation);
        expect(state.rawFilters.length).toBe(new_rawFilters.length);
    });

    it("can check getFilters getters", () => {
        const builtData = getters.getFilters(state);
        expect(builtData[0]).toHaveProperty('filterName')
        expect(builtData.length).toBe(11)
    });

});
