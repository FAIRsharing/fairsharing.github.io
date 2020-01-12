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
    }

    async getRecordsList(pagination_string){
        /**
         * ASync method to get the list of fairsharing records
         * How do we control the output fields ?
         */
        const output_fields = "type name abbreviation doi type subjects domains taxonomies";
        const query_fields = "currentPage perPage totalCount totalPages firstPage ";
        const query_name = "fairsharingRecords";
        const object_type = "records";

        let queryString = {
            query: "{" + query_name + pagination_string + "{ " + query_fields + object_type + "{" + output_fields + "}}}"
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

}

export default GraphQLClient;