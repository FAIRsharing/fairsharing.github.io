/**
 * Our client gets the Data from the API using GraphQL and send them to the web interface
 */

const axios = require('axios');

class GraphQLClient {
    /** The GraphQLClient retrieves data from the FAIRSharing API and sends it to the front-end
     * Be careful, this is a singleton and trying to cast new instances will return the existing instance.
     * @returns {GraphQLClient|*}
     */

    constructor(){
        if (GraphQLClient._instance){
            return GraphQLClient._instance
        }
        GraphQLClient._instance = this;

        this.url = "https://api.fairsharing.org/graphql";
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        this.query_fields = "currentPage perPage totalCount totalPages firstPage ";
    }

    async getRecordsOfType(pagination, recordType, fields){
        /** Method to get the records
         * @param {Object} pagination: contains the current page and number of items per pages
         * @param {String} recordType: the type of records to retrieve among Standard, Database, Collection and Policy
         * @param {Object} fields: the fields to retrieve from the object values (key are for labelling only)
         * @returns {Promise} content: the data retrieved from the API
         */

        // Setting up the output fields string
        let output_fields = "";
        for (let field in fields){
            if (field !== "Relationships"){
                output_fields += fields[field] + " "
            }
        }

        // Setting up the rest of the query
        const query_name = "searchFairsharingRecords";
        const object_type = "records";

        let query_params = "(fairsharingRegistry : " + '"' + recordType + '"';
        Object.keys(pagination).forEach(function(key){
            query_params += ` ${key}:${pagination[key]} `;
        });
        query_params += ')';

        let queryString = {
            query: "{" + query_name + query_params + "{ " + this.query_fields + object_type + "{" + output_fields + "}}}"
        };

        console.log(queryString.query);
        let queryInput = {
            fields: fields,
            pagination: pagination,
            queryName: "searchFairsharingRecords",
            objectType: "records",
            recordType: recordType,
            queryFields: this.query_fields
        };
        buildQuery(queryInput);

        try {
            let resp = await axios.post(this.url, queryString, this.headers);
            return resp.data.data[query_name]
        }
        catch (err){
            console.log(err);
            throw err;
        }
    }

    async introspectQuery(queryName){
        let query = {
            query: `{__type(name: "${queryName}"){name fields { name }}}`
        };
        try {
            let resp = await axios.post(this.url, query, this.headers);
            let data = resp.data.data["__type"].fields;
            return Array.from(data, elem =>elem.name);
        }
        catch(err){
            throw err;
        }
    }

}

let buildQuery = function(queryParams){
    let queryString = `{${queryParams.queryName} (fairsharingRegistry : "${queryParams.recordType}"`;
    Object.keys(queryParams.pagination).forEach(function(key){
        queryString += ` ${key}:${queryParams.pagination[key]} `;
    });
    queryString += `){ ${queryParams.queryFields}`;

    for (const field in queryParams.fields){
        if (typeof queryParams.fields[field] === "string" && field !== "Related Database") {
            queryString += queryParams.fields[field] + " "
        }
    }
    queryString += "}}";

    console.log(queryString);
    return queryString;
};

export default GraphQLClient;