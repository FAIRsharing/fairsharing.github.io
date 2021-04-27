import Client from "@/lib/GraphClient/GraphClient.js";
import {mutations, actions, paramsAreExpired} from "@/store/introspector.js"
import sinon from "sinon"

describe('Mutations & Actions', () => {
    let state = {};
    let stub;

    beforeEach(() => {
        state = {};
    });

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "executeQuery");
        stub.returns({
            data: {
                message: "Hello"
            },
            headers: {
                maintenance: "false"
            }

        })
    });

    afterAll(() => {
        stub.restore();
    });

    it('can raise errors or set the filters', async () => {
        let errorMessage = {
            errors: [
                {message: "Error"}
            ]
        };
        await mutations.setParameters(state, errorMessage);
        expect(state.error).toBe("Error");

        await mutations.setParameters(state);
        expect(state.error).toBe("Can't initialize application")
    });

    it("can set the filters", async () => {
        let dataMock = {
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
                        }
                    ]
                }
            }
        };

        // first time called => localStorage is empty
        await mutations.setParameters(state, dataMock);
        expect(state.searchQueryParameters).toStrictEqual(dataMock.data["__schema"].types[0].fields[0]);

        // second time called, localStorage now exists
        await mutations.setParameters(state, dataMock);
        expect(state.searchQueryParameters).toStrictEqual(dataMock.data["__schema"].types[0].fields[0]);

        // finally, change the data to make sure we can override the local storage
        dataMock.data["__schema"].types[0].fields[0].args = {
            name: "anothertest",
            description: "anotherDescription",
            type: "String",
            defaultValue: "2"
        };
        await mutations.setParameters(state, dataMock);
        expect(state.searchQueryParameters).toStrictEqual(dataMock.data["__schema"].types[0].fields[0]);
    });

    it("can write the expiry date to the store", async () => {
        let date = mutations.setLocalStorageExpiryTime();
        date = String(date);
        expect(localStorage.expiryDate).toBe(date);
    });

    it("can test a given date to see if its expired", () => {
        let now = new Date();
        let isExpired = paramsAreExpired(now, 24);
        expect(isExpired).toBe(false);
        isExpired = paramsAreExpired(now, -10);
        expect(isExpired).toBe(true);
    });

    it("can set maintenance and read only mode", () => {
        mutations.setMaintenanceMode(state);
        expect(state.maintenanceMode).toBe(true);
        mutations.setReadOnlyMode(state);
        expect(state.maintenanceMode).toBe(true);
    })
});

describe("Localstorage Suite", () => {
    let state = {};
    let stub;
    beforeEach(() => {
        delete global.window['localStorage'];
        global.window = Object.create(window);
        state = {};
    });

    beforeAll(() => {
        stub = sinon.stub(Client.prototype, "getData");
        stub.returns({
            data: {
                message: "Hello"
            },
            headers: {
                maintenance: "false"
            }
        })
    });

    afterAll(() => {
        stub.restore();
    });

    it('testing with empty localStorage', async () => {
        global.window.localStorage = {};
        actions.commit = jest.fn();
        await actions.fetchParameters(state, 24);
        expect(actions.commit).toHaveBeenCalledTimes(2);

    });

    it("testing with an introspectionQuery present but no timer", async () => {
        global.window.localStorage = {
            introspectionQuery: JSON.stringify({test: "ABC"})
        };
        await actions.fetchParameters(state, 24);
        expect(actions.commit).toHaveBeenCalledTimes(2);
        await actions.fetchParameters(state);
        expect(actions.commit).toHaveBeenCalledTimes(2);

    });

    it("testing with non expired dated AND introspection query", async () => {
        global.window.localStorage = {
            expiryDate: new Date(),
            introspectionQuery: JSON.stringify({test: "ABC"})
        };
        await actions.fetchParameters(state, 24);
        expect(actions.commit).toHaveBeenCalledTimes(3);
    });

    it("testing with expired dated AND introspection query", async () => {
        global.window.localStorage = {
            expiryDate: new Date(),
            introspectionQuery: JSON.stringify({test: "ABC"})
        };
        await actions.fetchParameters(state, -10);
        expect(actions.commit).toHaveBeenCalledTimes(5);

        stub.restore();
        stub = sinon.stub(Client.prototype, "getData");
        stub.returns({
            data: {
                message: "Hello"
            },
            headers: {
                maintenance: "true",
                "read-only": "true"
            }
        });
        await actions.fetchParameters(state);
        expect(actions.commit).toHaveBeenCalledWith("introspection/setMaintenanceMode");
        expect(actions.commit).toHaveBeenCalledWith("introspection/setReadOnlyMode");
    });
});
