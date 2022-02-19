import axios from "axios";

class CRUD {

    constructor(initOptions) {
        let {baseURL, headers} = initOptions
        this.baseURL = baseURL
        this.headers = headers
    }

    /**
     * Method to add authorisation to the headers.
     * @param jwt - the user's json web token
     * @return {JSON} - headers with authorisation field added
     */
    set_auth_headers(jwt) {
        let headers = JSON.parse(JSON.stringify(this.headers));
        headers['Authorization'] = 'Bearer ' + jwt;
        this.headers = headers;
    }

    /*    unset_auth_headers() {
            let headers = JSON.parse(JSON.stringify(this.headers));
            delete headers['Authorization'];
            this.headers = headers;
     }*/

    async executeQuery(query) {
        try {
            return await axios(query);
        }
        catch (e) {
            return ({data: {error: e}});
        }
    }

    async create(url, data) {
        const request = {
            method: "post",
            baseURL: this.baseURL + url,
            data: data,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async update(url, data) {
        const request = {
            method: "put",
            baseURL: this.baseURL + url,
            data: data,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async delete(url) {
        const request = {
            method: "delete",
            baseURL: this.baseURL + url,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    async get(url) {
        let baseURL = `${this.baseURL}${url}`;
        const request = {
            method: "get",
            baseURL: baseURL,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }
}

export default CRUD;