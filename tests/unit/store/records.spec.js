import {actions, mutations, getters, buildFacets} from "@/store/recordSearch.js"
import sinon from "sinon"
import Client from "@/lib/GraphClient/GraphClient.js";
import RecordsData from '../../../tests/fixtures/getRecords.json'

describe('Mutation & Actions & Getters', () => {

    const returnedVal = RecordsData;
    let state = {
        state: {
            params: {ids:[]}
        },
        records: [],
        facets: [],
        totalPages: null,
        hits: null,
        loading: false,
        params: {ids: []},
        collectionIDs: [],
        perPage: null,
        currentPage: 1
    };
    actions.commit = jest.fn();
    let stub;

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {
                searchFairsharingRecords: {}
            }
        })
    });

    afterAll(() => {
        stub.restore();
    });

    it("can check fetchRecords actions", () => {
        const params = {
            fairsharingRegistry: "Standard",
            isRecommended: true
        };
        actions.fetchRecords(state, params);
        expect(actions.commit).toHaveBeenCalledTimes(3);

        actions.commit = null;
        actions.commit = jest.fn();
        actions.fetchRecords(state, {});
        expect(actions.commit).toHaveBeenCalledTimes(3);
    });

    it("can check resetRecords actions", () => {
        actions.resetRecords();
        expect(actions.commit).toHaveBeenCalledTimes(8);
    });

    it("can check setRecords mutations", () => {
        mutations.setRecords(state, returnedVal);
        expect(state.records.length).toBeGreaterThan(0);
    });

    it("can check setLoadingStatus mutations", () => {
        const status = true;
        mutations.setLoadingStatus(state, status);
        expect(state.loading).toBe(true);
    });

    it("can check buildFacets function", () => {
        let returnedVal_NewKey = {
            "searchFairsharingRecords": {
            "aggregations": returnedVal.aggregations
          }
        }
        returnedVal_NewKey["searchFairsharingRecords"].aggregations["notAvailableKey!"] = {};
        let aggregation = returnedVal_NewKey['searchFairsharingRecords']['aggregations']
        const new_rawFilters = buildFacets(aggregation);
        expect(state.facets.length).toBe(new_rawFilters.length);
    });

    it("can check getFilters getters", () => {
        let BuiltFacet = getters.getFilter(state)('grants');
        expect(BuiltFacet.filterName).toBe('grants')

        state.facets = [];
        BuiltFacet = getters.getFilter(state)('grants');
        expect(BuiltFacet.filterName).toBe(undefined)
    });

    it("can check getRecordsLength getters", () => {
        let recordsLength = getters.getRecordsLength(state);
        expect(recordsLength).toBe(30)
    });

    it("can check setCollectionParam mutation", () => {
        mutations.setCollectionIdsParam(state,[1,2]);
        expect(state.params.ids).toHaveLength(2);
    });

    it("can check initializeCollectionRecord actions", async () => {
        await actions.initializeCollectionRecords(state, [1,2,3]);
        expect(actions.commit).toHaveBeenCalledTimes(14);
    });

    it("can check initializeCollectionRecord actions", async () => {
        await actions.fetchCollectionRecords(state, {page:"2"});
        expect(actions.commit).toHaveBeenCalledTimes(19);
    });


    it("can clean the store", () => {
        mutations.cleanRecordsStore(state);
        expect(state.params).toStrictEqual({ids:[]});
        expect(state.collectionIDs).toStrictEqual([]);
        expect(state.records).toStrictEqual([]);
        expect(state.facets).toStrictEqual([]);
        expect(state.hits).toBe(null);
        expect(state.loading).toBe(false);
        expect(state.totalPages).toBe(null);
        expect(state.perPage).toBe(null);
        expect(state.currentPage).toBe(1);
    });

    it("can check resetRecords mutations", () => {
        mutations.resetRecords(state);
        expect(state.records.length).toBe(0);
    });

    it("can check resetPages mutations", () => {
        mutations.resetPages(state);
        expect(state.hits).toBe(null);
        expect(state.perPage).toBe(null);
        expect(state.currentPage).toBe(1);
        expect(state.totalPages).toBe(null);
    });


});
