import introspectionQuery from "./introspectionQuery.js"
const axios = require('axios');

class GraphQLClient {

    /** The GraphQLClient retrieves data from the FAIRSharing API and sends it to the front-end.
     * Be careful, this is a singleton and trying to cast new instances will return the existing instance.
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
        this.query_fields = "currentPage perPage totalCount totalPages firstPage ";
        this.introspection = {
            records: null,
            recordAssociations: null,
            all: {}
        };
        return (async () => {
            this.introspection.all = await this.introspectAll();
            return this; // when done
        })();
    }

    /**
     * Method to get the records
     * @param {Object} pagination - contains the current page and number of items per pages
     * @param {String} recordType - the type of records to retrieve among Standard, Database, Collection and Policy
     * @param {Object} fields - the fields to retrieve from the object values (key are for labelling only)
     * @returns {Promise} content - the data retrieved from the API
     */
    async getRecordsOfType(pagination, recordType, fields){
        // Building the introspect IF it hasn't been already done !
        if (!this.introspection.records){
            this.introspection.records = await this.introspectQuery("FairsharingRecord")
        }
        if (!this.introspection.recordAssociations){
            this.introspection.recordAssociations = await this.introspectQuery("RecordAssociation")
        }

        // No need of a if as this will throw an error if failing; You can re-catch the error with a try/catch
        GraphQLClient.validate_fields(Object.values(fields), this.introspection.records);

        // Building the query
        const query_name = "searchFairsharingRecords";
        let queryInput = {
            fields: fields,
            pagination: pagination,
            queryName: "searchFairsharingRecords",
            objectType: "records",
            recordType: recordType,
            queryFields: this.query_fields
        };
        let query = {
            query: this.buildQuery(queryInput)
        };

        // trigger the query
        try {
            let resp = await axios.post(this.url, query, this.headers);
            return resp.data.data[query_name]
        }
        catch (err){
            console.log(err);
            throw err;
        }
    }

    /**
     * Given the name of a GraphQL query, run the introspection and return the list of allowed fields.
     * @param {string} queryName - the name a the query to introspect (e.g. "FairsharingRecord")
     * @return {array}
     */
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

    /**
     * Given a list of fields and allowed fields, verify the validity of input fields
     * @param {array} fields - an array of field names to verify
     * @param {array} allowed_fields - an array of allowed field names to check against
     * @return {boolean}
     */
    static validate_fields(fields, allowed_fields){
        for (let field of fields){
            if (typeof field === "string"){
                if (allowed_fields.indexOf(field) < 0){
                    console.warn("Error field " + field + "is not allowed for this query");
                }
            }
            else{
                if (allowed_fields.indexOf(field.field) < 0){
                    throw new TypeError("Error field " + field.field + " is not allowed for this query");
                }
            }

        }
        return true;
    }

    /**
     * Given an object or query parameters and fields, build the GraphQL query string?
     * @param {Object} queryParams - contains information about the query: pagination, fields, query name, ...
     * @returns {string} queryString - the string query to execute with axios
     */
    buildQuery = function(queryParams){
        let queryString = `{${queryParams.queryName} (fairsharingRegistry : "${queryParams.recordType}"`;
        Object.keys(queryParams.pagination).forEach(function(key){
            queryString += ` ${key}:${queryParams.pagination[key]} `;
        });
        queryString += `){ ${queryParams.queryFields} records{`;

        for (const field in queryParams.fields){
            if (typeof queryParams.fields[field] === "string") {
                queryString += queryParams.fields[field] + " "
            }
            else {
                GraphQLClient.validate_fields(queryParams.fields[field].fieldTarget, this.introspection.recordAssociations);
                queryString += queryParams.fields[field].query + " "
            }
        }
        queryString += "}}}";
        return queryString;
    }


    async introspectAll(){
        try {
            let resp = await axios.post(this.url, introspectionQuery, this.headers);
            return resp.data.data;
        }
        catch(err){
            throw err;
        }
    }

}

export default GraphQLClient;