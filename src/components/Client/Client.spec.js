import Client from "../../components/Client/Client.js"
import query from "../../components/Client/queries/getRecords.json"
const sinon = require("sinon");
const axios = require("axios");

describe("GraphQL Client", function(){
    let client;
    let searchFairsharingRecords = {records: [{}]};
    let postStub = sinon.stub(axios, "post");

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

    it("can execute a JSON query", async function(){
        query.queryParam = {
            "registry": "whatever"
        };
        let groupStub = sinon.stub(Client.prototype, "groupBy");
        groupStub.withArgs(sinon.match.any).returns([123]);
        let output = await client.executeQuery(query);
        expect(JSON.stringify(output)).toBe(JSON.stringify({
            searchFairsharingRecords: {
                records: [{
                    recordAssociations: [123]
                }]
            }
        }));
        groupStub.restore();
    });

    it("can groupBy a given array of object based on target property", function(){
        const input = [
            {target:{
                name: "test1",
                type: "standard"
            }},
            {target: {
                name: "test2",
                type: "standard"
            }},
            {target:{
                name: "test3",
                type: "collection"
            }}
        ];
        let groupedOutput = client.groupBy(input, "type", "target");
        const expectedOutput =  {
            standard: [
                { name: 'test1', type: 'standard' },
                { name: 'test2', type: 'standard' }
            ],
            collection: [
                { name: 'test3', type: 'collection' }
            ]
        };
        expect(JSON.stringify(groupedOutput)).toBe(JSON.stringify(expectedOutput));
        groupedOutput = client.groupBy({}, "type", "target");
        expect(groupedOutput).toBe(false);
    });

    it("can properly raise errors", async function(){
        postStub.withArgs(0).returns({
            data: {errors: [{messages: "abc"}]}
        });
        sinon.stub(Client.prototype, "queryBuilder").withArgs(sinon.match.any).returns(0);
        await expect(client.executeQuery(query)).rejects;
        axios.post.restore();
        Client.prototype.queryBuilder.restore();
        postStub.restore();
    })


});