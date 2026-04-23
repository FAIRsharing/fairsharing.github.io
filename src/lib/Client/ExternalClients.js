import axios from "axios";

class ExternalRESTClients {
  /**
   * The RESTClient is a singleton class that handles the connection and data exchange from the back-end
   * REST API.
   */
  constructor() {
    if (ExternalRESTClients._instance) {
      return ExternalRESTClients._instance;
    }
    ExternalRESTClients._instance = this;
    // this.doiBaseURL = "https://dx.doi.org/";
    this.doiBaseURL = "/doi-api/";
    this.headers = {
      Accept: "application/x-bibtex",
    };
    this.pmidBaseURL =
      "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=";
    this.tessBaseURL = "https://tess.elixir-europe.org/materials.json?q=";
    this.orcidBaseURL = "https://pub.orcid.org/v2.0/";
    this.rorOrganisationsBaseURL =
      "https://api.ror.org/v2/organizations?query=";
  }

  async getDOI(doi) {
    let localHeaders = this.headers;
    // localHeaders["Accept"] = "application/json";
    localHeaders["Accept"] =
      "application/vnd.citationstyles.bibliographic+json";
    const targetUrl = this.doiBaseURL + doi;
    const request = {
      url: targetUrl,
      headers: localHeaders,
    };
    let response = await this.executeQuery(request);
    return response.data;
  }

  async getPMID(id) {
    const request = {
      url: this.pmidBaseURL + id,
      headers: {
        Accept: "application/json",
      },
    };
    let response = await this.executeQuery(request);
    return response.data;
  }

  async getTessRecords(string) {
    const request = {
      url: this.tessBaseURL + string,
      headers: this.headers,
    };
    let response = await this.executeQuery(request);
    return response.data;
  }

  async getOrcidUser(user) {
    this.headers["Accept"] = "application/orcid+json";
    const request = {
      url: this.orcidBaseURL + user,
      headers: this.headers,
    };
    let response = await this.executeQuery(request);
    this.headers["Accept"] = "application/x-bibtex";
    return response.data;
  }

  async getROROrganisation(organisation) {
    let localHeaders = this.headers;
    localHeaders["Accept"] = "application/json";
    const request = {
      url: this.rorOrganisationsBaseURL + organisation,
      headers: localHeaders,
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
      const response = await axios.get(query.url, { headers: query.headers });

      // Check if we got HTML instead of JSON
      const contentType = response.headers["content-type"] || "";
      if (contentType.includes("text/html")) {
        throw new Error(
          "Expected JSON but received HTML (Website instead of API)",
        );
      }
      // Check if the data is empty or generic error-like HTML
      if (!response.data || response.data.length === 0) {
        throw new Error("No data returned from the source");
      }
      return response;
    } catch (e) {
      // This will now catch both Network/CORS errors AND the manual HTML error above
      return {
        data: {
          error: e.message || e,
          isError: true,
        },
      };
    }
  }
}

export default ExternalRESTClients;
