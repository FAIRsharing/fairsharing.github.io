import axios from "axios"
const bibtexParse = require('bibtex-parse-js');


class ExternalRESTClients {

    /**
     * The RESTClient is a singleton class that handles the connection and data exchange from the back-end
     * REST API.
     */
    constructor() {
        if (ExternalRESTClients._instance) {
            return ExternalRESTClients._instance
        }
        ExternalRESTClients._instance = this;
        this.doiBaseURL = 'http://dx.doi.org/';
        this.headers = {
            'Accept': 'application/x-bibtex',
        };
        this.pmidBaseURL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=";
    }

    async getDOI(doi){
        const request = {
            method: "get",
            baseURL: this.doiBaseURL + doi,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        if (!response.error){
            return bibtexParse.toJSON(response.data);
        }
        return response;
    }

    async getPMID(id){
        const request = {
            method: "get",
            baseURL: this.pmidBaseURL + id
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Trigger the given query with Axios
     * @param query
     * @returns {Promise<*>}
     */
    async executeQuery(query) {
        try {
            return await axios(query);
        }
        catch(e){
            return({data: {error: e}});
        }
    }
}

export default ExternalRESTClients;
