const axios = require("axios");

class GraphQLClient {

    /** The GraphQLClient retrieves data from the FAIRSharing API and sends it to the front-end.
     * Be careful, this is a singleton and trying to cast new instances will return the existing instance. Be
     * also careful, its constructor is async !!
     * @returns {Promise} - to use this object you need to do "await new ClassName()" or use .then(callback)
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
    }

    /**
     * Execute the given query (coming from a json file, see /queries/getRecords.json)
     * @param {Object} query - the query coming from the JSON file
     * sending to the API.
     * @returns {Promise}
     */
    async executeQuery(query){
        let client = this;
        let queryString = {
            query: `{${client.buildQuery(query)}}`
        };
        try {
            let resp = await axios.post(client.url, queryString, client.headers);
            if (resp.data.errors){
                throw new Error(resp.data.errors[0].message);
            }
            return resp.data.data;
        }
        catch (err){
            throw err;
        }
    }

    /**
     * Transform the JSON query into a string for graphQL
     * @param {Object} query - the query coming from the JSON file
     * @returns {Object} {query: queryString} - a valid graphQL query string to execute
     */
    buildQuery(query){
        let client = this;
        let queryString = `${query.queryName}`; // query name

        // Handle query parameters
        if (query.queryParam) {
            queryString += "(";
            Object.keys(query.queryParam).forEach(function(key){
                if (typeof query.queryParam[key] === "boolean" || typeof query.queryParam[key] === "number"){
                    queryString += `${key}:${query.queryParam[key]} `;
                }
                else if (typeof query.queryParam[key] === "string") {
                    queryString += `${key}:"${query.queryParam[key]}" `;
                }
                else if (typeof query.queryParam[key] === "object"){
                    let param = [];
                    query.queryParam[key].forEach(function(paramVal){
                        param.push("\"" + paramVal + "\"");
                    });
                    queryString += `${key}:[${param.join(",")}]`;
                }
            });
            queryString += ")";
        }

        // Handle query fields
        if (query.fields){
            queryString += "{";
            query.fields.forEach(function(field){
                if (typeof field === "string"){
                    queryString += ` ${field}`;
                }
                if (typeof field === "object"){
                    queryString += ` ${field.name}{`;
                    field.fields.forEach(function(subField){
                        if (typeof subField === "string"){
                            queryString += `${subField} `;
                        }
                        else {
                            queryString += `${client.buildQuery(subField)} `;
                        }
                    });
                    queryString += "}";
                }
            });
            queryString += "}";
        }
        return queryString;
    }
}

export default GraphQLClient;