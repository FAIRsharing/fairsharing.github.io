import {actions, mutations, getters, buildFacets} from "@/store/records.js"

describe('Mutation & Actions & Getters', () => {

    const returnedVal = {
        "aggregations": {
            "is_maintained": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 47
                    },
                    {
                        "key": "false",
                        "key_as_string": "false",
                        "doc_count": 27
                    }
                ]
            },
            "grants": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "16183mfds541",
                        "doc_count": 1
                    },
                    {
                        "key": "1u24ai117966-01",
                        "doc_count": 1
                    },
                ]
            },
            "fairsharing_registry": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "standard",
                        "doc_count": 74
                    }
                ]
            },
            "subjects": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "natural science",
                        "doc_count": 65
                    },
                    {
                        "key": "natural sciences",
                        "doc_count": 65
                    },
                    {
                        "key": "life science",
                        "doc_count": 62
                    },
                ]
            },
            "domains": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "entity",
                        "doc_count": 67
                    },
                    {
                        "key": "continuant",
                        "doc_count": 53
                    },
                ]
            },
            "countries": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "united states of america",
                        "doc_count": 44
                    },
                ]
            },
            "journals": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "nat biotechnol",
                        "doc_count": 6
                    },
                    {
                        "key": "nucleic acids res",
                        "doc_count": 5
                    },
                ]
            },
            "record_type": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "reporting_guideline",
                        "doc_count": 38
                    },
                ]
            },
            "is_recommended": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 74
                    }
                ]
            },
            "organisations": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "national institutes of health (nih), bethesda, md, usa",
                        "doc_count": 15
                    },
                    {
                        "key": "nih common fund, usa",
                        "doc_count": 10
                    },
                ]
            },
            "taxonomies": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "all",
                        "doc_count": 27
                    },
                ]
            },
            "is_approved": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "true",
                        "key_as_string": "true",
                        "doc_count": 74
                    }
                ]
            },
            "licences": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "creative commons attribution 3.0 unported (cc by 3.0)",
                        "doc_count": 5
                    },
                    {
                        "key": "creative commons attribution 4.0 international (cc by 4.0)",
                        "doc_count": 5
                    },
                ]
            },
            "user_defined_tags": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "drug target",
                        "doc_count": 7
                    },
                    {
                        "key": "metadata standardization",
                        "doc_count": 7
                    },
                ]
            },
            "status": {
                "doc_count": 74,
                "doc_count_error_upper_bound": 0,
                "sum_other_doc_count": 0,
                "buckets": [
                    {
                        "key": "ready",
                        "doc_count": 73
                    },
                    {
                        "key": "deprecated",
                        "doc_count": 1
                    }
                ]
            }
        },
        "currentPage": 1,
        "perPage": 30,
        "totalCount": 74,
        "totalPages": 3,
        "firstPage": true,
        "records": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ]
    };
    let state = {
        records: [],
        facets: [],
        totalPages: null,
        hits: null,
        loading: false
    };
    actions.commit = jest.fn();

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
        expect(actions.commit).toHaveBeenCalledTimes(4);
    });

    it("can check setRecords mutations", () => {
        mutations.setRecords(state, returnedVal);
        expect(state.records.length).toBeGreaterThan(0);
    });

    it("can check resetRecords mutations", () => {
        mutations.resetRecords(state);
        expect(state.records.length).toBe(0);
    });

    it("can check resetHits mutations", () => {
        mutations.resetHits(state);
        expect(state.hits).toBe(null);
    });

    it("can check setLoadingStatus mutations", () => {
        const status = true;
        mutations.setLoadingStatus(state, status);
        expect(state.loading).toBe(true);
    });

    it("can check buildFacets function", () => {
        const returnedVal_NewKey = {
            "searchFairsharingRecords": {
                "aggregations": {
                    "is_maintained": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 1670
                            },
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 1383
                            }
                        ]
                    },
                    "grants": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 191,
                        "buckets": [
                            {
                                "key": "xda08020102",
                                "doc_count": 9
                            },
                            {
                                "key": "2014aa021503 and 2015aa020108",
                                "doc_count": 8
                            },
                        ]
                    },
                    "fairsharing_registry": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "database",
                                "doc_count": 1465
                            },
                            {
                                "key": "standard",
                                "doc_count": 1409
                            },
                            {
                                "key": "policy",
                                "doc_count": 133
                            },
                            {
                                "key": "collection",
                                "doc_count": 46
                            }
                        ]
                    },
                    "subjects": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "natural science",
                                "doc_count": 2403
                            },
                            {
                                "key": "natural sciences",
                                "doc_count": 2395
                            },
                        ]
                    },
                    "domains": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 588,
                        "buckets": [
                            {
                                "key": "entity",
                                "doc_count": 2324
                            },
                            {
                                "key": "continuant",
                                "doc_count": 2106
                            },
                        ]
                    },
                    "countries": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "united states of america",
                                "doc_count": 1174
                            },
                            {
                                "key": "united kingdom of great britain and northern ireland",
                                "doc_count": 558
                            },
                            {
                                "key": "germany",
                                "doc_count": 284
                            },
                        ]
                    },
                    "journals": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "nucleic acids res",
                                "doc_count": 418
                            }
                        ]
                    },
                    "record_type": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "repository",
                                "doc_count": 1465
                            },
                            {
                                "key": "terminology_artefact",
                                "doc_count": 780
                            },
                            {
                                "key": "model_and_format",
                                "doc_count": 414
                            },
                            {
                                "key": "reporting_guideline",
                                "doc_count": 170
                            },
                            {
                                "key": "journal",
                                "doc_count": 85
                            },
                            {
                                "key": "collection",
                                "doc_count": 46
                            },
                            {
                                "key": "metric",
                                "doc_count": 30
                            },
                            {
                                "key": "society",
                                "doc_count": 25
                            },
                            {
                                "key": "funder",
                                "doc_count": 23
                            },
                            {
                                "key": "identifier_schema",
                                "doc_count": 15
                            }
                        ]
                    },
                    "is_recommended": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 2741
                            },
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 312
                            }
                        ]
                    },
                    "organisations": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 1886,
                        "buckets": [
                            {
                                "key": "national institutes of health (nih), bethesda, md, usa",
                                "doc_count": 296
                            },
                            {
                                "key": "national science foundation (nsf), usa",
                                "doc_count": 277
                            },
                        ]
                    },
                    "taxonomies": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "all",
                                "doc_count": 1217
                            },
                            {
                                "key": "homo sapiens",
                                "doc_count": 707
                            },
                            {
                                "key": "not applicable",
                                "doc_count": 487
                            },
                        ]
                    },
                    "is_approved": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 1,
                                "key_as_string": "true",
                                "doc_count": 3037
                            },
                            {
                                "key": 0,
                                "key_as_string": "false",
                                "doc_count": 16
                            }
                        ]
                    },
                    "licences": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "creative commons attribution 4.0 international (cc by 4.0)",
                                "doc_count": 261
                            },
                            {
                                "key": "attribution required",
                                "doc_count": 143
                            },
                        ]
                    },
                    "user_defined_tags": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "general purpose",
                                "doc_count": 199
                            },
                            {
                                "key": "data sharing",
                                "doc_count": 178
                            },
                            {
                                "key": "metadata standardization",
                                "doc_count": 150
                            },
                        ]
                    },
                    "status": {
                        "meta": {},
                        "doc_count": 3053,
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": "ready",
                                "doc_count": 2715
                            },
                            {
                                "key": "deprecated",
                                "doc_count": 143
                            },
                            {
                                "key": "uncertain",
                                "doc_count": 135
                            },
                            {
                                "key": "in_development",
                                "doc_count": 60
                            }
                        ]
                    },
                    "notAvailableKey!": {}
                }
            }
        };
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

});
