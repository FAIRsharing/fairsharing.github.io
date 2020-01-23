import introspectionQuery from "./introspectionQuery.js"
const axios = require('axios');

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
        this.query_fields = "";
        this.introspection = {
            records: null,
            recordAssociations: null,
            all: {}
        };
        return (async () => {
            this.introspection.all = await this.introspectAll();
            const graphTypes = this.introspection.all['__schema'].types;
            const recordGraphType = graphTypes.filter(graphType => graphType.name === "FairsharingRecord")[0].fields;
            this.introspection.records = Array.from(recordGraphType, elem =>elem.name);
            const associationGraphType = graphTypes.filter(graphType => graphType.name === "RecordAssociation")[0].fields;
            this.introspection.recordAssociations = Array.from(associationGraphType, elem =>elem.name);


            this.introspect = this.introspection.all["__schema"].types;
            this.allowedQueries = this.introspect.filter(
                allowedTypes => allowedTypes.name === "Query"
            )[0];

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
            queryFields: "currentPage perPage totalCount totalPages firstPage "
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
     * Given a list of fields and allowed fields, verify the validity of input fields
     * @param {array} fields - an array of field names to verify
     * @param {array} allowed_fields - an array of allowed field names to check against
     * @return {boolean}
     */
    static validate_fields(fields, allowed_fields){
        for (let field of fields){
            if (typeof field === "string"){
                if (allowed_fields.indexOf(field) < 0){
                    console.warn("Error field %s is not allowed for this query", field);
                }
            }
            else if (typeof field === "object"){
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
                let subQuery = queryParams.fields[field];
                let subQueryString = `${subQuery.field}{${subQuery.fieldTarget}{`;
                try {
                    subQuery[subQuery.fieldTarget].forEach(function(field){
                        subQueryString += field + " "
                    });
                }
                catch(e) {
                    console.warn("the field %s is missing the attribute %s", field, subQuery.fieldTarget);
                    throw e;
                }

                subQueryString += "}}";
                GraphQLClient.validate_fields(subQuery.fieldTarget, this.introspection.recordAssociations);
                GraphQLClient.validate_fields(subQuery.linkedRecord, this.introspection.records);
                queryString += subQueryString + " ";
            }
        }
        queryString += "}}}";
        return queryString;
    };

    /**
     * Query introspection: get all the schemas from the graphQL endpoint and returns a list of allowed
     * fields/parameters for each possible query
     * @returns {Promise}
     */
    async introspectAll(){
        try {
            let resp = await axios.post(this.url, introspectionQuery, this.headers);
            return resp.data.data;
        }
        catch(err){
            throw err;
        }
    }

    /**
     * Execute the given query (coming from a json file, see /queries/getRecords.json)
     * @param {Object} query - the query coming from the JSON file
     * @param {Boolean} validate - control whether or not to trigger the query validation by the client before
     * sending to the API.
     * @returns {Promise}
     */
    async executeQuery(query, validate){
        if (validate){
            this.validateQuery(query);
        }
        let queryString = this.queryBuilder({
                fields: query.queryFields.target.fields,
                pagination: query.pagination,
                queryName: query.queryName,
                objectType: query.queryFields.target.name,
                queryFields: query.queryFields["elasticSearchFields"].join(" ") + " ",
                queryParam: query["queryParam"]
            });

        // trigger the query
        try {
            let resp = await axios.post(this.url, queryString, this.headers);
            return resp.data.data
        }
        catch (err){
            console.log(err);
            throw err;
        }

    }

    /**
     * Transform the JSON query into a string for graphQL
     * @param {Object} query - the query coming from the JSON file
     * @returns {Object} {query: queryString} - a valid graphQL query string to execute
     */
    queryBuilder(query){
        let queryString = `{${query.queryName}( `;
        Object.keys(query.pagination).forEach(function(key){
            queryString += ` ${key}:${query.pagination[key]} `;
        });

        Object.keys(query.queryParam).forEach(function(key){
            if (query.queryParam[key]){
                queryString += ` ${key}:${query.queryParam[key]} `;
            }
        });
        queryString += `){ ${query.queryFields} ${query.objectType}{`;

        Object.keys(query.fields).forEach(function(key){
            let field = query.fields[key];
            if (field.type === "string"){
                queryString += field.name + " ";
            }
            else if (field.type === "object"){
                if (Object.keys(field).indexOf(field.target) < 0 ){
                    throw new Error(`the field ${field.name} is missing the attribute ${field.target}`);
                }

                queryString += `${field.name}{${field.target}{`;
                queryString += field[field.target].join(" ");
                queryString += "}} ";
            }
        });
        queryString += "}}}";
        return {query: queryString};

    }

    /**
     * Validates the given query based on introspection
     * @param {Object} query - the query coming from the JSON file
     */
    validateQuery(query){

        const validVarTypes = {
            "Int": "number",
            "string": "string"
        };

        // validate query name and state
        if (this.allowedQueries.fields.filter(allowedQuery => allowedQuery.name === query.queryName).length === 0){
            throw new Error(`Query ${query.queryName} isn't allowed on this API`);
        }
        const queryMeta = this.allowedQueries.fields.filter(allowedQuery => allowedQuery.name === query.queryName)[0];
        if (queryMeta['isDeprecated']){
            // maybe should just warn at this point ?
            throw new Error(`Query ${query.queryName} is deprecated: ${query['deprecationReason']}`);
        }
        const queryOfType = this.introspect.filter(allowedType => allowedType.name === queryMeta.type["ofType"].name)[0];

        // validate pagination parameters
        const allowedArgs = queryMeta.args;
        Object.keys(query.pagination).forEach(function(paginationArg){
            const currentArgument = query.pagination[paginationArg];
            const allowedArguments = allowedArgs.filter(allowedArg => allowedArg.name === paginationArg);
            // validate the current parameter
            if (allowedArguments.length === 0){
                throw new Error(`Parameter ${paginationArg} is not allowed for query ${query.queryName}`);
            }
            const argumentType = allowedArguments[0].type.name;
            // validate the current parameter value type
            if (validVarTypes[argumentType] !== typeof currentArgument && argumentType!== typeof currentArgument){
                throw new Error(`Parameter ${paginationArg} of query ${query.queryName} should be ${argumentType} but is ${typeof currentArgument}`);
            }
        });


        /* validate other parameters
        Object.keys(query.queryParam).forEach(function(paginationArg){
            const currentArgument = query.queryParam[paginationArg];
            const allowedArguments = allowedArgs.filter(allowedArg => allowedArg.name === paginationArg);
            // validate the current parameter
            if (allowedArguments.length === 0){
                throw new Error(`Parameter ${paginationArg} is not allowed for query ${query.queryName}`);
            }
            console.log(allowedArguments[0]);
            const argumentType = allowedArguments[0].type.name;
            // validate the current parameter value type
            if (validVarTypes[argumentType] !== typeof currentArgument && argumentType!== typeof currentArgument){
                throw new Error(`Parameter ${paginationArg} of query ${query.queryName} should be ${argumentType} but is ${typeof currentArgument}`);
            }
        });*/

        // validate query target and fields
        const currentQueryFields = queryOfType.fields;

        query.queryFields["elasticSearchFields"].forEach(function(queryField){
            const isValid = currentQueryFields.filter(allowedTarget => allowedTarget.name === queryField);
            if (isValid.length === 0){
                throw new Error(`Field ${queryField} not allowed for query ${query.queryName}`)
            }
        });

        const queryTarget = currentQueryFields.filter(allowedTarget => allowedTarget.name === query.queryFields.target.name);
        if (queryTarget.length < 0){
            throw new Error(`Target ${query.queryFields.target.name} not allowed for query ${query.queryName}`)
        }
        console.log(queryTarget[0])

        //console.log(currentQueryFields);
    }

}

export default GraphQLClient;