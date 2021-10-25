const axios = require("axios");
import Fragments from "./queries/fragments/fragments.json"

class GraphQLClient {

    /** The GraphQLClient retrieves data from the FAIRSharing API and sends it to the front-end.
     * Be careful, this is a singleton and trying to cast new instances will return the existing instance. Be
     * also careful, its constructor is async !!
     * @returns {Promise} - to use this object you need to do "await new ClassName()" or use .then(callback)
     */
    constructor(){
        this.initalizeHeader();
        if (GraphQLClient._instance){
            return GraphQLClient._instance
        }
        GraphQLClient._instance = this;
        this.url = process.env.VUE_APP_API_ENDPOINT + "/graphql";
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
        let resp = await this.getData(queryString);
        if (resp.data.errors) {
            return resp.data.errors;
        }
        return resp.data.data
    }

    /**
     * Takes the query, post it with axios and returns the raw data
     * @param {Object} queryString - processed request coming out of buildQuery() or a GraphQL query string
     * @returns {Promise} - an axios promise representing the server response.
     */
    async getData(queryString){
        let client = this;
        const fullQuery = {
            method: "post",
            baseURL: client.url,
            data:  queryString,
            headers: client.headers
        };
        return await axios(fullQuery);
    }

    /**
     * Transform the JSON query into a string for graphQL
     * @param {Object} query - the query coming from the JSON file
     * @returns {Object} {query: queryString} - a valid graphQL query string to execute
     */
    buildQuery(query){
        let client = this;
        let queryString = `${query["queryName"]}`; // query name

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
                else {
                    let param = [];
                    query.queryParam[key].forEach(function(paramVal){
                        typeof paramVal !== "number" ? param.push("\"" + paramVal + "\"") : param.push(paramVal);
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
                    if ("$ref" in field){
                        let myRef = Fragments[field["$ref"]];
                        for (let subField of myRef){
                            if (typeof subField === "string"){
                                queryString += ` ${subField}`;
                            }
                            else {
                                queryString += ` ${client.buildQuery(subField)}`;
                            }
                        }
                    }
                    else {
                        queryString += ` ${field.name}{`;
                        field.fields.forEach(function(subField){
                              if (typeof subField === "string"){
                                  queryString += `${subField} `;
                              }
                              else {
                                  queryString += `${client.buildQuery(subField)}`;
                              }
                        });
                        queryString += "}";
                    }
                }
            });
            queryString += "}";
        }
        return queryString;
    }

    /**
    * Add the authorization token to the headers
    * @param {String} jwt - the user json web token
    */
    setHeader(jwt){
      this.headers['Authorization'] = `Bearer ${jwt}`;
    }

    initalizeHeader(){
      this.headers = {
          "Accept": "application/json",
          "Content-Type": "application/json",
      };
      this.headers['X-Client-Id'] = process.env.VUE_APP_CLIENT_ID;
      /* istanbul ignore if */
      if (this.headers['X-Client-Id'] === undefined){
          delete this.headers['X-Client-Id']
      }
    }


}

export default GraphQLClient;
