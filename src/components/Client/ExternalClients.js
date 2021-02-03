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
        this.tessBaseURL = "https://tess.elixir-europe.org/materials.json?q="
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
