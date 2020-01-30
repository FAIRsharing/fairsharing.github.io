import Client from "../../components/Client/Client.js"
import query from "../../components/Client/queries/getRecords.json"
import recordQuery from "../../components/Client/queries/getRecord.json"
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

    it("can execute a JSON query", async function(){
        localQuery.queryParam = {};
        localQuery.queryParam["fairsharingRegistry"] = "Standard";
        localQuery.queryParam["isRecommended"] = true;

        let groupStub = sinon.stub(Client.prototype, "groupBy");
        groupStub.withArgs(sinon.match.any).returns([123]);
        let output = await client.executeQuery(localQuery);
        expect(JSON.stringify(output)).toBe(JSON.stringify({
            searchFairsharingRecords: {
                records: [{
                    recordAssociations: [123]
                }]
            }
        }));
        groupStub.withArgs(sinon.match.any).returns(false);
        await client.executeQuery(localQuery);
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
        sinon.stub(Client.prototype, "buildQuery").withArgs(sinon.match.any).returns(0);
        await expect(client.executeQuery(localQuery)).rejects;
        axios.post.restore();
        Client.prototype.buildQuery.restore();
        postStub.restore();
    });

    it("can correctly build a query string from a JSON", function() {
        const expectedOutput = "{searchFairsharingRecords( )" +
            "{currentPage perPage totalCount totalPages firstPage  records{id type name abbreviation registry domains " +
            "subjects taxonomies recordAssociations{linkedRecord{name id registry} recordAssocLabel } status isRecommended }}}";
        delete localQuery.pagination;
        delete localQuery.queryParam;
        localQuery.queryFields.target.fields.push({
            name: "test",
            label: "test",
            type: null
        });
        const queryObject = {
            fields: localQuery.queryFields.target.fields,
            pagination: localQuery.pagination,
            queryName: localQuery.queryName,
            objectType: localQuery.queryFields.target.name,
            queryFields: localQuery.queryFields["elasticSearchFields"].join(" ") + " ",
            queryParam: localQuery["queryParam"]
        };
        const queryString = client.buildQuery(queryObject);
        expect(queryString.query).toBe(expectedOutput);

        const expectedRecordQueryString = "{fairsharingRecord( ){registry type doi status name " +
            "abbreviation description name homepage countries metadata taxonomies domains subjects history " +
            "grants isRecommended legacyIds legacyLogs licences maintainers{username id } organisations " +
            "publications recordAssociations{linkedRecord{name id registry} recordAssocLabel } reviews{id " +
            "fairsharingRecordId createdAt userId } }}";
        const recordQueryObject = {
            fields: recordQuery.queryFields.target.fields,
            pagination: recordQuery.pagination,
            queryName: recordQuery.queryName,
            objectType: recordQuery.queryFields.target.name,
            queryFields: recordQuery.queryFields["elasticSearchFields"].join(" ") + " ",
            queryParam: recordQuery["queryParam"]
        };
        const recordQueryString = client.buildQuery(recordQueryObject);
        expect(recordQueryString.query).toBe(expectedRecordQueryString);

    });


});