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
        return (async () => {
            this.introspection = await this.introspectAll();
            this.introspect = this.introspection["__schema"].types;
            this.allowedQueries = this.introspect.filter(
                allowedTypes => allowedTypes.name === "Query"
            )[0];

            return this; // when done
        })();
    }

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
     * sending to the API.
     * @returns {Promise}
     */
    async executeQuery(query){
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
            if (resp.data.errors){
                throw new Error(resp.data.errors[0].message);
            }

            let content = resp.data.data;

            /* group By */
            query.queryFields.target.fields.forEach(function(queryField){
                if (queryField.hasOwnProperty("groupBy")){
                    let sortParamValue = queryField["groupBy"];
                    let sortParamName = queryField.name;
                    content[query.queryName][query.queryFields.target.name].forEach(function(record){
                        if (record[sortParamName].length > 0){
                            let groupedRecords = {};
                            record[sortParamName].forEach(function(item){
                                let localTarget = queryField.target;
                                if (!groupedRecords.hasOwnProperty(item[localTarget][sortParamValue])){
                                    groupedRecords[item[localTarget][sortParamValue]] = [];
                                }
                                groupedRecords[item[localTarget][sortParamValue]].push(item[localTarget]);
                            });
                            record[sortParamName] = groupedRecords;
                        }
                    });
                }
            });

            return content
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
    queryBuilder(query){
        let queryString = `{${query.queryName}( `;

        if (query.pagination !== undefined){
            Object.keys(query.pagination).forEach(function(key){
                queryString += ` ${key}:${query.pagination[key]} `;
            });
        }

        if (query.queryParam !== undefined){
            Object.keys(query.queryParam).forEach(function(key){
                if (query.queryParam[key]){
                    queryString += ` ${key}:${query.queryParam[key]} `;
                }
            });
        }
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
     * TODO: finish the validation (currently server side)
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

        // validate pagination parameters
        const allowedArgs = queryMeta.args;
        if (query.hasOwnProperty("pagination")) {
            Object.keys(query.pagination).forEach(function (paginationArg) {
                const currentArgument = query.pagination[paginationArg];
                const allowedArguments = allowedArgs.filter(allowedArg => allowedArg.name === paginationArg);
                // validate the current parameter
                if (allowedArguments.length === 0) {
                    throw new Error(`Parameter ${paginationArg} is not allowed for query ${query.queryName}`);
                }
                const argumentType = allowedArguments[0].type.name;
                // validate the current parameter value type
                if (validVarTypes[argumentType] !== typeof currentArgument && argumentType !== typeof currentArgument) {
                    throw new Error(`Parameter ${paginationArg} of query ${query.queryName} should be ${argumentType} but is ${typeof currentArgument}`);
                }
            });
        }


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
        const queryOfType = this.introspect.filter(allowedType => allowedType.name === queryMeta.type["ofType"].name)[0];
        const currentQueryFields = queryOfType.fields;

        query.queryFields["elasticSearchFields"].forEach(function(queryField){
            const isValid = currentQueryFields.filter(allowedTarget => allowedTarget.name === queryField);
            if (isValid.length === 0){
                throw new Error(`Field ${queryField} not allowed for query ${query.queryName}`)
            }
        });

        const queryTarget = currentQueryFields.filter(allowedTarget => allowedTarget.name === query.queryFields.target.name);
        if (queryTarget.length === 0){
            throw new Error(`Target ${query.queryFields.target.name} not allowed for query ${query.queryName}`)
        }
    }

}

export default GraphQLClient;