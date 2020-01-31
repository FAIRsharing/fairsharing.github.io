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

        let queryString = this.buildQuery({
                fields: query.queryFields.target.fields,
                pagination: query.pagination,
                queryName: query.queryName,
                objectType: query.queryFields.target.name,
                queryFields: query.queryFields["elasticSearchFields"].join(" ") + " ",
                queryParam: query["queryParam"]
            });

        // trigger the query
        try {
            console.log(queryString.query);
            let resp = await axios.post(this.url, queryString, this.headers);
            if (resp.data.errors){
                throw new Error(resp.data.errors[0].message);
            }

            let content = resp.data.data;

            /* group By */
            query.queryFields.target.fields.forEach(function(queryField){
                if (queryField.type === "object"){
                    queryField.target.forEach(function(target){
                        const queryHasField = Object.prototype.hasOwnProperty.call(queryField, target);
                        let queryHasGroupBy = false;
                        if (queryHasField){
                            queryHasGroupBy = Object.prototype.hasOwnProperty.call(queryField[target], "groupBy");
                        }
                        if (queryHasField && queryHasGroupBy){
                            content[query.queryName][query.queryFields.target.name].forEach(function(record){
                                const groupedData = client.groupBy(record[queryField.name], queryField[target]["groupBy"], target);
                                if (groupedData){
                                    record[queryField.name] = groupedData;
                                }
                            });

                        }
                    })
                }
            });
            return content;
        }
        catch (err){
            console.log(err);
            return err;
        }

    }

    /**
     * Giving an array of items, a field and a target, group these items based on the field value.
     * @param {Array} data - an array of objects
     * @param {string} field - the name of the property of groupBy
     * @param {string} target - the target object inside the array (due to graphQL output structure)
     * @returns {Object | boolean} - Either return the grouped array as an object or false if the array was empty
     */
    groupBy(data, field, target) {
        let output = {};
        if (data.length > 0) {
            data.forEach(function(record){
                let outputHasField = Object.prototype.hasOwnProperty.call(output, record[target][field]);
                if (!outputHasField){
                    output[record[target][field]] = []
                }
                output[record[target][field]].push(record[target])
            });
            return output;
        }
        return false;

    }


    /**
     * Transform the JSON query into a string for graphQL
     * @param {Object} query - the query coming from the JSON file
     * @returns {Object} {query: queryString} - a valid graphQL query string to execute
     */
    buildQuery(query){
        let queryString = `{${query.queryName}( `;

        if (query.pagination){
            Object.keys(query.pagination).forEach(function(key){
                queryString += ` ${key}:${query.pagination[key]} `;
            });
        }
        if (query.queryParam){
            Object.keys(query.queryParam).forEach(function(key){
                const isInt = parseInt(query.queryParam[key]);
                if (typeof query.queryParam[key] === "string" && isNaN(isInt)){
                    queryString += ` ${key}:"${query.queryParam[key]}" `;
                }
                else if (!isNaN(isInt)){
                    queryString += ` ${key}:${isInt} `;
                }
                else {
                    queryString += ` ${key}:${query.queryParam[key]} `;
                }
            });
        }

        queryString += "){";
        if (query.objectType){
            queryString += `${query.queryFields} ${query.objectType}{`;
        }

        Object.keys(query.fields).forEach(function(key){
            let field = query.fields[key];
            if (field.type === "string"){
                queryString += field.name + " ";
            }
            else if (field.type === "object"){
                queryString += field.name + "{";
                field.target.forEach(function(target){
                    if (Object.keys(field).indexOf(target) > 0){
                        queryString += `${target}{`;
                        queryString += field[target].fields.join(" ");
                        queryString += "} ";
                    }
                    else {
                        queryString += target + " " ;
                    }

                });
                queryString += "} ";
            }
        });
        queryString += "}}";
        if (query.objectType){
            queryString += "}";
        }
        return {query: queryString};

    }

}

export default GraphQLClient;