import Client from "@/components/GraphClient/GraphClient.js";
import {mutations, actions} from "@/store/introspector.js"


describe('Mutations', () => {
    let state = {};

    beforeEach(() => {
        state = {};
    });


    it('can raise an error ', () => {
        let errorTest = {
            data: {
                errors: [
                    {message: "Error"}
                ]
            }
        };
        actions.fetchParameters(state, errorTest);
        let validTimeRange = {day: 1, month: 0, year: 0};
        mutations.setLocalStorageExpiryTime(state, validTimeRange);
        mutations.setParameters(state, errorTest.data);
        console.log(state.error);
        console.log(errorTest);
        expect(state.error).toBe("Can't initialize application");
    });


    it('can gets the data correctly ', () => {
        let returnedVal = {
            data: {
                data: {
                    "__schema": {
                        "types": [
                            {
                                name: "Query",
                                fields: [
                                    {
                                        name: "searchFairsharingRecords",
                                        args: [
                                            {
                                                name: "test",
                                                description: "testDescription",
                                                type: "String",
                                                defaultValue: "1"
                                            }
                                        ]
                                    }
                                ]
                            }]
                    }
                }
            }
        };
        let returnedValDif = {
            data: {
                data: {
                    "__schema": {
                        "types": [
                            {
                                name: "Query",
                                fields: [
                                    {
                                        name: "searchFairsharingRecords",
                                        args: [
                                            {
                                                name: "test",
                                                description: "testDescription",
                                                type: "String",
                                                defaultValue: "1"
                                            },
                                            {
                                                name: "test2",
                                                description: "testDescription",
                                                type: "String",
                                                defaultValue: "1"
                                            }

                                        ]
                                    }
                                ]
                            }]
                    }
                }
            }
        };

        let localStorageMock = (function () {
            return {
                searchQueryParameters: "ass"
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: localStorageMock});
        let localStorageObject = window.localStorage;
        console.log("localStorageObject",localStorageObject);

        actions.fetchParameters(state, returnedVal);
        let validTimeRange = {day: 1, month: 0, year: 0};
        mutations.setLocalStorageExpiryTime(state, validTimeRange);
        mutations.setParameters(state, returnedVal.data);
        console.log(returnedVal.data);
        console.log(state.searchQueryParameters);
        expect(state.searchQueryParameters).toStrictEqual(returnedVal);


         localStorageMock = (function () {
            return {
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: localStorageMock});

        console.log("localStorageObject",localStorageObject);

        actions.fetchParameters(state, returnedVal);
        mutations.setLocalStorageExpiryTime(state, validTimeRange);
        mutations.setParameters(state, returnedVal.data);
        console.log(returnedVal.data);
        console.log(state.searchQueryParameters);
        expect(state.searchQueryParameters).toStrictEqual(returnedVal);



/*
        localStorageMock = (function () {
            return {
                searchQueryParameters: "diff"
            };
        })();        Object.defineProperty(window, 'localStorage', {value: localStorageMock});

        actions.fetchParameters(state, returnedValDif);
        mutations.setLocalStorageExpiryTime(state, validTimeRange);
        mutations.setParameters(state, returnedValDif.data);
        console.log(returnedValDif.data);
        console.log(state.searchQueryParameters);
        expect(state.searchQueryParameters).toStrictEqual(returnedValDif);
*/
    });


});
