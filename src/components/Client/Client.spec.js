import Client from "../../components/Client/Client.js"
import query from "../../components/Client/queries/getRecords.json"
const sinon = require("sinon");
const axios = require("axios");

describe("GraphQL Client", function(){
    let client;
    let searchFairsharingRecords = {records: [{}]};

    beforeAll( () => {
        client = new Client();
        sinon.stub(axios, "post").withArgs(sinon.match.any).returns({
            data: {
                data: {
                    searchFairsharingRecords
                }
            }
        });
    });

    afterAll(() => {
       axios.post.restore()
    });

    it("can be instantiated as a singleton", function(){
       const instance2 = new Client();
       expect(client).toBe(instance2.constructor["_instance"]);
    });

    it("can execute a JSON query", async function(){
        query.queryParam = {
            "registry": "whatever"
        };
        sinon.stub(Client.prototype, "groupBy").withArgs(sinon.match.any).returns([123]);
        let output = await client.executeQuery(query);
        expect(JSON.stringify(output)).toBe(JSON.stringify({
            searchFairsharingRecords: {
                records: [{
                    recordAssociations: [123]
                }]
            }
        }));
        Client.prototype.groupBy.restore();
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


});