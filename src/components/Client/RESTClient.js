import axios from "axios"

class RESTClient {

    /**
     * The RESTClient is a singleton class that handles the connection and data exchange from the back-end
     * REST API.
     */
    constructor(){
        if (RESTClient._instance){
            return RESTClient._instance
        }
        RESTClient._instance = this;
        this.baseURL = "https://api.fairsharing.org";
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        };
    }

    /* USERS: all methods below related to handling user authentication */

    /**
     * Method to log in the user
     * @param username - name of the user
     * @param password - password of the user
     * @return {Promise} - the response of the server
     */
    async login(username, password){
        const endpoint = "/users/sign_in";
        const body = {
            user: {
                login: username,
                password: password
            }
        };
        const request = {
            method: "post",
            baseURL: this.baseURL + endpoint,
            data: body
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     *  Method to create a new user
     * @param {Object} userLogin - the user account to create
     * @returns {Promise} response - server response
     */
    async createAccount(userLogin){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/users",
            data: {user: userLogin}
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
            let client = this;
            query.headers = client.headers;
            return await axios(query);
        }
        catch(e){
            console.log(e);
            return({data: e});
        }
    }
}

export default RESTClient;