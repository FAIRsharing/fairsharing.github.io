import {actions, mutations, getters, buildFilters} from "@/store/searchFilters.js"

describe('Mutation & Actions & Getters', () => {

    const returnedVal = {
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
                }
            }
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
        const new_rawFilters = buildFilters(aggregation);
        expect(state.rawFilters.length).toBe(new_rawFilters.length);
    });

    it("can check getFilters getters", () => {
        const builtData = getters.getFilters(state);
        expect(builtData[0]).toHaveProperty('filterName')
        expect(builtData.length).toBe(11)
    });

});
