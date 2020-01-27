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
            console.log(queryString.query);
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

                    if (content[query.queryName][query.queryFields.target.name]){
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
                    else {
                        let groupedRecords = {};
                        content[query.queryName][sortParamName].forEach(function(rec){
                            let localTarget = queryField.target;
                            if (!groupedRecords.hasOwnProperty(rec[localTarget][sortParamValue])){
                                groupedRecords[rec[localTarget][sortParamValue]] = []
                            }
                            groupedRecords[rec[localTarget][sortParamValue]].push(rec[localTarget]);
                        });
                        content[query.queryName][sortParamName] = groupedRecords;
                    }

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

        if (query.pagination){
            Object.keys(query.pagination).forEach(function(key){
                queryString += ` ${key}:${query.pagination[key]} `;
            });
        }
        if (query.queryParam){
            Object.keys(query.queryParam).forEach(function(key){
                if (query.queryParam[key]){
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