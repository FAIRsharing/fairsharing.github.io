import axios from "axios"

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
        this.doiBaseURL = 'https://dx.doi.org/';
        this.headers = {
            'Accept': 'application/x-bibtex',
        };
        this.pmidBaseURL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=";
        this.tessBaseURL = "https://tess.elixir-europe.org/materials.json?q=";
        this.orcidBaseURL = "https://pub.orcid.org/v2.0/";
    }

    async getDOI(doi){
        const request = {
            url: this.doiBaseURL + doi,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async getPMID(id){
        const request = {
            url: this.pmidBaseURL + id,
            headers: {
                'Accept': 'application/json',
            }
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async getTessRecords(string){
        const request = {
            url: this.tessBaseURL + string,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async getOrcidUser(user){
        this.headers['Accept'] = "application/orcid+json";
        const request = {
            url: this.orcidBaseURL + user,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        this.headers['Accept'] = 'application/x-bibtex';
        return response.data;
    }

    /**
     * Trigger the given query with Axios
     * @param query
     * @returns {Promise<*>}
     */
    async executeQuery(query) {
        try {
            return await axios.get(query.url, {headers: query.headers});
        }
        catch(e){
            return({data: {error: e}});
        }
    }
}

export default ExternalRESTClients;
