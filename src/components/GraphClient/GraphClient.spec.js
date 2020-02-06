import Client from "./GraphClient.js"
import query from "./queries/getRecords.json"
const sinon = require("sinon");
const axios = require("axios");

describe("GraphQL Client", function(){
    let client;
    const searchFairsharingRecords = {records: [{}]};
    let postStub = sinon.stub(axios, "post");
    const stubQuery = {};
    let localQuery = {};

    beforeEach( () => {
        localQuery = Object.assign(stubQuery, query);
    });

    beforeAll( () => {
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

    it("can be instantiated as a singleton", function(){
       const instance2 = new Client();
       expect(client).toBe(instance2.constructor["_instance"]);
    });

    it("can execute a query", async function(){
        localQuery.queryParam = {};
        localQuery.queryParam["fairsharingRegistry"] = "Standard";
        localQuery.queryParam["isRecommended"] = true;

        let output = await client.executeQuery(localQuery);
        expect(JSON.stringify(output)).toBe(JSON.stringify({
            searchFairsharingRecords: {
                records: [{}]
            }
        }));
        await client.executeQuery(localQuery);
    });

    it("can properly raise errors", async function(){
        postStub.withArgs(0).returns({
            data: {errors: [{messages: "abc"}]}
        });
        sinon.stub(Client.prototype, "buildQuery").withArgs(sinon.match.any).returns(0);
        await expect(client.executeQuery(localQuery)).rejects;
        axios.post.restore();
        Client.prototype.buildQuery.restore();
        postStub.restore();
    });

    it("can correctly build a query string from a JSON", function() {
        const expectedOutput = "searchFairsharingRecords(field1:true field2:\"true\" field3:[\"true\"," +
            "\"false\"]){ aggregations currentPage perPage totalCount totalPages firstPage records{id " +
            "type name abbreviation registry domains subjects taxonomies recordAssociations{ linkedRecord{name " +
            "id registry } recordAssocLabel}status isRecommended }}" ;
        query.queryParam = {
            "field1": true,
            "field2": "true",
            "field3": ["true", "false"]
        };
        const queryString = client.buildQuery(query);
        expect(queryString).toBe(expectedOutput);

        const smallQuery = {
            queryName: "test"
        };
        const miniResponse = client.buildQuery(smallQuery);
        expect(miniResponse).toBe("test");

    });


});