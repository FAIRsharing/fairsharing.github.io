/**
 * Our client gets the Data from the API using GraphQL and send them to the web interface
 */

const axios = require('axios');

class GraphQLClient {

    constructor(){
        this.url = "https://api.fairsharing.org/graphql";
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        this.query_fields = "currentPage perPage totalCount totalPages firstPage ";
    }

    async getRecordsList(pagination_string){
        /**
         * ASync method to get the list of fairsharing records
         * How do we control the output fields ?
         */
        const output_fields = "type name abbreviation doi type subjects domains taxonomies registry";
        const query_name = "fairsharingRecords";
        const object_type = "records";
        let queryString = {
            query: "{" + query_name + pagination_string + "{ " + this.query_fields + object_type + "{" + output_fields + "}}}"
        };

        try {
            let resp = await axios.post(this.url, queryString, this.headers);
            return resp.data.data[query_name]
        }
        catch (err){
            console.log(queryString.query);
            throw err;
        }
    }

    async getRecordsOfType(pagination, recordType){
        /**
         *
         */
        const output_fields = "name doi type";
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

        try {
            let resp = await axios.post(this.url, queryString, this.headers);
            return resp.data.data[query_name]
        }
        catch (err){
            console.log(queryString.query);
            throw err;
        }
    }

    __build_query() {
        console.log(123);
    }



}

export default GraphQLClient;