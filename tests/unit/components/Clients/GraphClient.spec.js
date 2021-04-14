import Client from "@/lib/GraphClient/GraphClient.js"
import query from "@/lib/GraphClient/queries/getRecords.json"

const sinon = require("sinon");
const axios = require("axios");

describe("GraphQL Client", function () {
    let client;
    const searchFairsharingRecords = {records: [{}]};
    let postStub = sinon.stub(axios, "post");
    const stubQuery = {};
    let localQuery = {};

    beforeEach(() => {
        localQuery = Object.assign(stubQuery, query);
    });

    beforeAll(() => {
        client = new Client();
        postStub.withArgs(sinon.match.any).returns({
            data: {
                data: {
                    searchFairsharingRecords
                }
            }
        });
    });

    afterAll(() => {
        postStub.restore()
    });

    it("can be instantiated as a singleton", function () {
        process.env.VUE_APP_CLIENT_ID = undefined;
        const instance2 = new Client();
        expect(client).toBe(instance2.constructor["_instance"]);
    });

    it("can execute a query", async function () {

        let stub = sinon.stub(Client.prototype, "getData");
        stub.withArgs(sinon.match.any).returns({
            data: {
                data: {
                    searchFairsharingRecords
                }
            }
        });

        localQuery.queryParam = {};
        localQuery.queryParam["fairsharingRegistry"] = "Standard";
        localQuery.queryParam["isRecommended"] = true;
        let output = await client.executeQuery(localQuery);
        expect(JSON.stringify(output)).toBe(JSON.stringify({
            searchFairsharingRecords: {
                records: [{}]
            }
        }));

        let output2 = await client.getData(localQuery);
        expect(JSON.stringify(output2.data)).toBe(JSON.stringify({
            data: {
                searchFairsharingRecords: {
                    records: [{}]
                }
            }
        }));
        stub.restore();

    });

    it("can check either function returns errors or correct response ", async function () {
        let stub = sinon.stub(Client.prototype, "getData");
        localQuery.queryParam = {};
        localQuery.queryParam["fairsharingRegistry"] = "Standard";
        localQuery.queryParam["isRecommended"] = true;

        stub.withArgs(sinon.match.any).returns({
            data: {
                errors: [
                    {message: "Im an error"}
                ]
            }
        });
        await expect(client.executeQuery(localQuery)).rejects;
        stub.withArgs(sinon.match.any).returns({
            data: {
                data: {
                    searchFairsharingRecords
                }
            }
        });

        await expect(client.executeQuery(localQuery)).resolves.toStrictEqual({
            searchFairsharingRecords: {
                records: [{}]
            }
        });
        Client.prototype.getData.restore();
    });

    it("can correctly build a query string from a JSON", function () {
        const expectedOutput =
            'searchFairsharingRecords(field1:true field2:"true" field3:["true","false"]){ aggregations currentPage perPage totalCount totalPages firstPage records{id type name abbreviation doi registry description domains{ label id definitions iri synonyms inFairsharing}subjects{ label id definitions iri synonyms}taxonomies{ label}userDefinedTags{ label}recordAssociations{ linkedRecord{name id registry } recordAssocLabel}reverseRecordAssociations{ fairsharingRecord{name id registry } recordAssocLabel}status isRecommended }}';
        query.queryParam = {
            "field1": true,
            "field2": "true",
            "field3": ["true", "false"]
        };
        let queryString = client.buildQuery(query);
        expect(queryString).toBe(expectedOutput);

        const smallQuery = {
            queryName: "test"
        };
        const miniResponse = client.buildQuery(smallQuery);
        expect(miniResponse).toBe("test");

        smallQuery.fields = [
            "inFairsharing",
            {"$ref": "keywords"},
            {$ref: "domains"}
        ];
        let queryFragment = client.buildQuery(smallQuery);
        expect(queryFragment).toBe('test{ inFairsharing label id definitions iri synonyms domains{ label id definitions iri synonyms inFairsharing}}');
    });
});
