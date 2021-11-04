import {actions, mutations, getters, buildFilters} from "@/store/searchFilters.js"
import RecordsData from '../../../tests/fixtures/getRecords.json'
import GraphClient from "@/lib/GraphClient/GraphClient.js"

let sinon = require("sinon");

describe('searchFilters store methods', () => {

    const returnedVal = {
        "searchFairsharingRecords": {
            "aggregations": RecordsData.aggregations
        }
    };
    const databaseCount = {
        "frontPageDatabases": {
            "data": {
                "natural science": 10
            }
        }
    }
    let state = {
        rawFilters: [],
        filters: [],
        filtersStatistic:[{
            subjects:{buckets:[{doc_count:12,key:'natural science'}]},
            fairsharing_registry:{buckets:[{doc_count:500,key:'standard'}]},
        }],
        filterButtons: [
            {data: [ { active: true }]}
        ],
        isLoadingFilters: false,
    };
    actions.commit = jest.fn();



    it("can check resetFilterButtons actions", () => {
        actions.resetFilterButtons(state, 0);
        expect(actions.commit).toHaveBeenCalledTimes(1);
    });

    it("can check activateFilterButtonsItem actions", () => {
        actions.activateButton(state, {
            activeItem: {
                active: false,
                filterName: 'isRecommended',
                title: 'RECOMMENDED',
                value: true
            },
            itemParentIndex: 0
        });
        expect(actions.commit).toHaveBeenCalledTimes(2);
    });

    it("can check setFilters mutations", () => {
        mutations.setFilters(state, returnedVal);
        expect(state.rawFilters.length).toBeGreaterThan(0)
    });

    it("can check setDatabaseCount mutations", () => {
        mutations.setDatabaseCount(state, databaseCount);
        expect(state.databaseCount).toStrictEqual(databaseCount.frontPageDatabases.data);
    });

    it("can check the setFilterButtons mutations", () => {
        mutations.setFilterButtons(state);
        expect(state.filterButtons.length).toBeGreaterThan(0)
    });

    it("can deactivate a filter status", () => {
        mutations.resetFilterButtons(state, 0);
        expect(state.filterButtons[0]).toStrictEqual({data: [{ active: false }]});
    });

    it("can check the activateFilterButtonsItem mutations", () => {
        const fakeSelectedItem = {
            active: false,
            filterName: 'isRecommended',
            title: 'RECOMMENDED',
            value: true
        };
        mutations.activateButton(state, {
            'activeItem': fakeSelectedItem,
            'itemParentIndex': 0
        });
        expect(state.filterButtons[0]).toStrictEqual({data: [{ active: false }]});
    });

    it("can check buildFilters function", () => {
        returnedVal["searchFairsharingRecords"].aggregations["notAvailableKey!"] = {};
        let aggregation = returnedVal['searchFairsharingRecords']['aggregations'];
        const new_rawFilters = buildFilters(aggregation);
        expect(state.rawFilters.length).toBe(new_rawFilters.length);
    });

    it("can check getFilters getters", () => {
        const builtData = getters.getFilters(state);
        expect(builtData[0]).toHaveProperty('filterName');
        expect(builtData.length).toBe(8)
    });

    it("can check getFiltersStatisticCount getters", () => {
        const builtData = getters.getFiltersStatisticCount(state);
        expect(builtData({filterName:'fairsharing_registry',key:'standard'})).toBe(74);
    });

    it("can change the state of loading status", () => {
        mutations.setLoadingStatus(state, true);
        expect(state.isLoadingFilters).toBe(true);
    });

    it("can fetch the data and assemble the filters", async () => {
        let stub = sinon.stub(GraphClient.prototype, "executeQuery");
        stub.returns({
            searchFairsharingRecords: {
                aggregations: {
                    is_maintained: {}
                }
            }
        });
        await actions.assembleFilters();
        expect(actions.commit).toHaveBeenCalledWith("searchFilters/setLoadingStatus", true);
        expect(actions.commit).toHaveBeenCalledWith("searchFilters/setLoadingStatus", true);
        expect(actions.commit).toHaveBeenCalledWith("searchFilters/setFilterButtons");
        expect(actions.commit).toHaveBeenCalledWith("searchFilters/setLoadingStatus", false);
        expect(actions.commit).toHaveBeenCalledTimes(7);
        stub.restore();
    });

});
