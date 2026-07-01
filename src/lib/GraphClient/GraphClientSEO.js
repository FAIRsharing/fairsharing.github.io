import axios from "axios";
import Fragments from "./queries/fragments/fragments.json" with { type: "json" };

class GraphQLClientSEO {
  constructor() {
    //If an instance already exists, return it immediately without altering state
    if (GraphQLClientSEO._instance) {
      return GraphQLClientSEO._instance;
    }

    // Otherwise, this is the true first initialization
    this.initalizeHeader();

    // Ensure we handle trailing/missing slashes cleanly
    const baseEndpoint = process.env.VITE_API_ENDPOINT;
    this.url = `${baseEndpoint.replace(/\/$/, "")}/graphql`;

    GraphQLClientSEO._instance = this;
  }

  /**
   * Execute the given query (coming from a json file, see /queries/getRecords.json)
   * @param {Object} query - the query coming from the JSON file
   * @returns {Promise}
   */
  async executeQuery(query) {
    let client = this;
    let queryString = {
      query: `{${client.buildQuery(query)}}`,
    };
    let resp = await this.getData(queryString);
    if (resp.data.errors) {
      return resp.data.errors;
    }
    return resp.data.data;
  }

  /**
   * Takes the query, posts it with axios, and returns the raw data
   * @param {Object} queryString - processed request coming out of buildQuery()
   * @returns {Promise}
   */
  async getData(queryString) {
    let client = this;
    const fullQuery = {
      method: "post",
      url: client.url, //Use 'url' instead of 'baseURL' so the exact path is targeted cleanly
      data: queryString,
      headers: client.headers,
    };
    return axios(fullQuery);
  }

  /**
   * Transform the JSON query into a string for graphQL
   * @param {Object} query - the query coming from the JSON file
   * @returns {String}
   */
  buildQuery(query) {
    let client = this;
    let queryString = `${query["queryName"]}`;

    if (query.queryParam) {
      queryString += "(";
      Object.keys(query.queryParam).forEach(function (key) {
        if (
          typeof query.queryParam[key] === "boolean" ||
          typeof query.queryParam[key] === "number"
        ) {
          queryString += `${key}:${query.queryParam[key]} `;
        } else if (typeof query.queryParam[key] === "string") {
          const regExp = /\(|\)|\{|\}/g;
          const hasBrackets = regExp.test(query.queryParam[key]);

          if (hasBrackets) queryString += `${key}:${query.queryParam[key]}`;
          else queryString += `${key}:"${query.queryParam[key]}" `;
        } else {
          let param = [];
          query.queryParam[key].forEach(function (paramVal) {
            typeof paramVal !== "number"
              ? param.push('"' + paramVal + '"')
              : param.push(paramVal);
          });
          queryString += `${key}:[${param.join(",")}]`;
        }
      });
      queryString += ")";
    }

    if (query.fields) {
      queryString += "{";
      query.fields.forEach(function (field) {
        if (typeof field === "string") {
          queryString += ` ${field}`;
        }
        if (typeof field === "object") {
          if ("$ref" in field) {
            let myRef = Fragments[field["$ref"]];
            for (let subField of myRef) {
              if (typeof subField === "string") {
                queryString += ` ${subField}`;
              } else {
                queryString += ` ${client.buildQuery(subField)}`;
              }
            }
          } else {
            queryString += ` ${field.name}{`;
            field.fields.forEach(function (subField) {
              if (typeof subField === "string") {
                queryString += `${subField} `;
              } else {
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
  setHeader(jwt) {
    this.headers["Authorization"] = `Bearer ${jwt}`;
  }

  initalizeHeader() {
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      // Disguise Axios as a standard Chrome web browser to bypass WAF blocks
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      // Force standard compression formats
      "Accept-Encoding": "gzip, deflate",
    };

    const clientId = process.env.VITE_CLIENT_ID;
    if (clientId) {
      this.headers["X-Client-Id"] = clientId;
    }
  }
}

export default GraphQLClientSEO;
