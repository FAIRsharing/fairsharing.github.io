import axios from "axios"
import {toBase64} from "@/utils/generalUtils"
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
        this.baseURL = process.env.VUE_APP_API_ENDPOINT;
        this.headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        };
        this.headers['X-Client-Id'] = process.env.VUE_APP_CLIENT_ID;
    }

    /* USERS: all methods below related to handling user authentication */

    /**
     * Method to add authorisation to the headers.
     * @param jwt - the user's json web token
     * @return {JSON} - headers with authorisation field added
     */
   auth_headers(jwt) {
        let headers = JSON.parse(JSON.stringify(this.headers));
        headers['Authorization'] = 'Bearer ' + jwt;
        return headers;
    }

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
            data: body,
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Logout the user from the back, expiring the current jwt.
     * @param {String} jwt - the user token to expire.
     * @returns {Promise}
     */
    async logout(jwt){
        const request = {
            method: "delete",
            baseURL: this.baseURL + "/users/sign_out",
            headers: this.auth_headers(jwt)
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
            data: {user: userLogin},
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Validate the account given the corresponding token
     * @param {String} token - the account token to validate
     * @returns {Promise}
     */
    async confirmAccount(token){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/users/confirmation?confirmation_token=" + token,
            headers: this.headers,
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Method to send a reset password link to the given email address
     * @param {String} email to send the link to
     * @returns {Promise}
     */
    async requestResetPwd(email){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/users/password",
            headers: this.headers,
            data: {
                user: {email: email}
            }
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Resend the validation link for a given user
     * @param {Object} user - contains the email of the user.
     * @returns {Promise}
     */
    async resendConfirmation(user) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/users/confirmation",
            headers: this.headers,
            data: {user: user}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Reset the password of the given user
     * @param {Object} user - contains the new pwd, repeated pwd and token.
     * @returns {Promise}
     */
    async resetPassword(user){
        const request = {
            method: "put",
            baseURL: this.baseURL + "/users/password",
            headers: this.headers,
            data: {user: user}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Changes the password of the logged in user
     * @param {String} jwt - the user token
     * @param {Object} user - contains the current, new and repeated new password
     * @returns {Promise}
     */
    async resetPasswordWithoutToken(jwt, user){
        const request = {
            method: "put",
            baseURL: this.baseURL + "/users/",
            headers: this.auth_headers(jwt),
            data: {user: user}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Verify the validity of the given password
     * @param {String} password - the password to test
     * @returns {Promise}
     */
    async verifyPassword(password){
        let headers = JSON.parse(JSON.stringify(this.headers));
        const request = {
            method: "post",
            baseURL: this.baseURL + "/users/check_password",
            headers: headers,
            data: {password: password}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Get the current user data
     * @param jwt
     * @returns {Promise}
     */
    async getUser(jwt){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/users/edit",
            headers: this.auth_headers(jwt)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Get the current user data
     * @param jwt
     * @param id
     * @returns {Promise}
     */
    async getPublicUser(jwt,id){
        const request = {
            method: "get",
            baseURL: this.baseURL + `/user_admin/${id}`,
            headers: this.auth_headers(jwt)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Get all users list
     * @param jwt
     * @returns {Promise}
     */
    async getUsersList(jwt){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/user_admin/",
            headers: this.auth_headers(jwt)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Edit the current logged in user profile
     * @param {Object} newUser - the new values for the logged in user
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async editUser(newUser, jwt){
        const request = {
            method: "put",
            baseURL: this.baseURL + "/users",
            headers: this.auth_headers(jwt),
            data: {user: newUser}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }
    /**
     * Edit the current logged in user profile
     * @param {Object} newUser - the new values for the logged in user
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async editPublicUser(newUser, jwt){
        const request = {
            method: "put",
            baseURL: this.baseURL + `/user_admin/${newUser.id}` ,
            headers: this.auth_headers(jwt),
            data: {user: newUser}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }
    /**
     * Delete the user
     * @param userID
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async deletePublicUser(userID, jwt){
        const request = {
            method: "delete",
            baseURL: this.baseURL + `/user_admin/${userID}` ,
            headers: this.auth_headers(jwt),
        };
        let response = await this.executeQuery(request);
        return response.data;
    }
    /**
     * Verify that the given JWT is still valid
     * @param {String} jwt - the token to validate
     * @returns {Promise}
     */
    async validateToken(jwt){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/users/valid",
            headers: this.auth_headers(jwt)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }


    /* EDITORS METHODS */

    /**
     * Post the given object to the API to create the corresponding record.
     * @param record
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async createRecord(record, jwt){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/fairsharing_records",
            headers: this.auth_headers(jwt),
            data: {fairsharing_record: record}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Update the given record
     * @param {Object} record - the record to update containing the ID to target, the new values
     * and the user token
     * @returns {Promise}
     */
    async updateRecord(record){
        const request = {
            method: "put",
            baseURL: this.baseURL + "/fairsharing_records/" + record.id,
            headers: this.auth_headers(record.token),
            data: {fairsharing_record: record.record}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Determine if a user has permission to edit this record.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async canEdit(recordID, userToken){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/fairsharing_records/can_edit/" + recordID,
            headers: this.auth_headers(userToken),
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Attempt to create a MaintenanceRequest for a user for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async claimRecord(recordID, userToken) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/maintenance_requests",
            headers: this.auth_headers(userToken),
            data: {maintenance_request: {fairsharing_record_id: recordID}}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Determine if a user has permission to create a MaintenanceRequest for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async canClaim(recordID, userToken) {
        const request = {
            method: "get",
            baseURL: this.baseURL + "/maintenance_requests/existing/" + recordID,
            headers: this.auth_headers(userToken),
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Remove an existing maintainer from a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    // Coverage steadfastly refuses to see this even though it is mocked and called
    // in a test (see Record.spec.js).
    /* istanbul ignore next */
    async removeMaintainer(recordID, userToken) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/maintenance_requests/remove",
            headers: this.auth_headers(userToken),
            data: {maintenance_request: {fairsharing_record_id: recordID}}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Add or remove an watcher to/from a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} operation - 'add' or 'remove'.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async changeWatcher(recordID, operation, userToken) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/fairsharing_records/watch",
            headers: this.auth_headers(userToken),
            data: {
                record_id: recordID ,
                operation: operation
            }
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Attempt to create a RecordReview for a user for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async reviewRecord(recordID, userToken) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/record_reviews",
            headers: this.auth_headers(userToken),
            data: {record_review: {fairsharing_record_id: recordID}}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /* USER DEFINED TAGS */

    /**
     * Create a new user defined tag in the database for users to tag their records.
     * @param {String} term - the string value of the term
     * @param {String} token - the user JWT
     * @returns {Promise}
     */
    async createNewUserDefinedTag(term, token){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/user_defined_tags",
            headers: this.auth_headers(token),
            data: {user_defined_tag: {label:term}}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }


    /* LICENCES */

    /**
     * Create new a licence link
     * @param {Object} licenceLink - the licence link to create
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async createLicenceLink(licenceLink, token){
        let _client = this;
        const request = {
            method: "post",
            baseURL: _client.baseURL + "/licence_links",
            headers: this.auth_headers(token),
            data: {licence_link: licenceLink}
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Delete the given licence
     * @param {Number} id - id of the licence link to delete
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async deleteLicenceLink(id, token){
        let _client = this;
        const request = {
            method: "delete",
            baseURL: _client.baseURL + "/licence_links/" + id,
            headers: this.auth_headers(token),
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Update the licenceLink
     * @param {Object} licenceLink - the new values for the licence link
     * @param {String} token the user token
     * @returns {Promise}
     */
    async updateLicenceLink(licenceLink, token){
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/licence_links/" + licenceLink.id,
            headers: this.auth_headers(token),
            data: {licence_link: licenceLink}
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }


    /* PUBLICATIONS */

    async createPublication(publication, token){
        let _client = this;
        const request = {
            method: "post",
            baseURL: _client.baseURL + "/publications",
            headers: this.auth_headers(token),
            data: { publication: publication }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    async editPublication(publication, token){
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/publications/" + publication.id,
            headers: this.auth_headers(token),
            data: { publication: publication }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /* RELATIONSHIPS BETWEEN RECORDS */
    /**
     * Saves the relationships as an array of items containing a targetID, a sourceID and a labelID
     * @param {Object} options - the options to pass as {token: String, relations: Array}
     * @returns {Promise}
     */
    async saveRelations(options){
        if (options.relations.length > 0) {
            const request = {
                method: 'put',
                baseURL: this.baseURL + '/fairsharing_records/' + options.target,
                headers: this.auth_headers(options.token),
                data: {fairsharing_record: {record_associations_attributes: options.relations}}

            };
            let response = await this.executeQuery(request);
            return response.data;
        }
        return {};
    }

    /**
     * Deletes the relationships as an array of items containing a targetID, a sourceID and a labelID
     * @param {Object} options - the options to pass as {token: String, relations: Array}
     * @returns {Promise}
     */
    async deleteRelations(options){
        if (options.relations.length > 0) {
            const request = {
                method: 'put',
                baseURL: this.baseURL + '/fairsharing_records/' + options.target,
                headers: this.auth_headers(options.token),
                data: {fairsharing_record: {record_associations_attributes: options.relations}}

            };
            let response = await this.executeQuery(request);
            return response.data;
        }
        return {};
    }

    /* ORGANISATIONS AND GRANTS */
    /**
     * Create a given organisation
     * @param {Object} organisation
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createOrganisation(organisation, userToken){
        let _client = this;
        const request = {
            method: "post",
            baseURL: _client.baseURL + "/organisations",
            headers: this.auth_headers(userToken),
            data: { organisation: organisation }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Create a given grant
     * @param {Object} grant
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createGrant(grant, userToken){
        let _client = this;
        const request = {
            method: "post",
            baseURL: _client.baseURL + "/grants",
            headers: this.auth_headers(userToken),
            data: { grant: grant }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Create a new link between an organisation, a record and an optional grant.
     * @param {Object} organisationLink - the organisation link to create
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createOrganisationLink(organisationLink, userToken){
        let _client = this;
        const request = {
            method: "post",
            baseURL: _client.baseURL + "/organisation_links",
            headers: this.auth_headers(userToken),
            data: { organisation_link: organisationLink }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Update the organisationLink given from linkID input with the given organisationLink
     * @param {Object} organisationLink - the new organisation link value
     * @param {Number} linkID - ID of the organisationLink to update
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async updateOrganisationLink(organisationLink, linkID, userToken){
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/organisation_links/" + linkID,
            headers: this.auth_headers(userToken),
            data: { organisation_link: organisationLink }
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Delete the given organisation link
     * @param {Number} linkID - the id of the link to remove
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async deleteOrganisationLink(linkID, userToken){
        let _client = this;
        const request = {
            method: "delete",
            baseURL: _client.baseURL + "/organisation_links/" + linkID,
            headers: this.auth_headers(userToken),
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Get the extra metadata fields for a RecordType
     * @param {String} type - name of the record type.
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async extraMetadataFields(type, userToken) {
        const request = {
            method: "post",
            baseURL: this.baseURL + "/fairsharing_records/metadata_fields",
            headers: this.auth_headers(userToken),
            data: {type: type}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /* METHODS FOR CURATION */
    /**
     * Update the maintenanceRequest given the new status value
     * @param {Number} maintenanceRequest  ID of the maintenanceRequest to update
     * @param {string} newStatus - new status to update
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async updateStatusMaintenanceRequest(maintenanceRequest, newStatus, userToken){
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/maintenance_requests/" + maintenanceRequest,
            headers: this.auth_headers(userToken),
            data: { maintenance_request: {status: newStatus}}
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Delete Record
     * @param {Number} id - id of the record link to delete
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async deleteRecord(id, token){
        let _client = this;
        const request = {
            method: "delete",
            baseURL: _client.baseURL + "/fairsharing_records/" + id,
            headers: this.auth_headers(token),
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Get the list of allowed relation types for editing record's relationships.
     * @returns {Promise}
     */
    /* EDITOR DATA */
    async getRelationsTypes(){
        let _client = this;
        const request = {
            method: "get",
            baseURL: _client.baseURL + "/record_associations/allowed"
        };
        let response = await _client.executeQuery(request);
        return response.data;
    }

    /**
     * Get the list of available profile types for a user.
     * @returns {Promise}
     */
    async getProfileTypes(){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/users/profile_types",
            headers: this.headers
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Get the list of available roles for a user.
     * @returns {Promise}
     * @param {String} token - the user token
     */
    // Coverage steadfastly refuses to see this even though it is mocked and called
    // in a test (see EditPublicProfile.spec.js).
    /* istanbul ignore next */
    async getUserRoles(userToken){
        const request = {
            method: "get",
            baseURL: this.baseURL + "/user_roles",
            headers: this.auth_headers(userToken)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /* SYSTEM MESSAGES */
    /**
     * Update the given message
     * @param {Object} message - the message to update containing the ID to target and the new values
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async updateMessage(message, userToken){
        const request = {
            method: "put",
            baseURL: this.baseURL + "/messages/" + message.id,
            headers: this.auth_headers(userToken),
            data: {message: message}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Update the given message
     * @param {Object} message - the message to create
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createMessage(message, userToken){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/messages/",
            headers: this.auth_headers(userToken),
            data: {message: message}
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

    /**
     * Update the given message
     * @param {String} messageId - the ID of the message to delete
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async deleteMessage(messageId, userToken){
        const request = {
            method: "delete",
            baseURL: this.baseURL + "/messages/" + messageId,
            headers: this.auth_headers(userToken)
        };
        let response = await this.executeQuery(request);
        return response.data;
    }


    /* EXTRA METHODS */

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

    /**
     * Get records without DOIS
     * @param {String} token - the user token that needs to be a curator
     * @returns {Promise}
     */
     async getRecordsWoDOIs(userToken){
         let _client = this;
         const request = {
             method: "get",
             baseURL: _client.baseURL + "/files/no_dois",
             headers: this.auth_headers(userToken),
         };
         let response = await _client.executeQuery(request);
         return response.data;
     }

     /**
      * Get Zenodo call
      * @param {String} call
      * @param {String} userToken - the user jwt
      * @returns {Promise}
      */
      async getZenodoSearch(text, userToken){
          let _client = this;
          const request = {
              method: "post",
              baseURL: _client.baseURL + "/zenodo",
              headers: this.auth_headers(userToken),
              data: {doi: text}
          };
          let response = await _client.executeQuery(request);
          return response.data;
      }


    async uploadLogo(formData) {
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/fairsharing_records/" + formData.get("id"),
            headers: _client.auth_headers(formData.get("token")),
            data: {fairsharing_record:{logo:{
                filename:formData.get("logo").name,
                // //encode to base 64
                data:await toBase64(formData.get("logo")),
                content_type:formData.get("logo").type,
                    }}},
        };
        let response = await _client.executeQuery(request);
        // here the data returned always should be either an array of images or one string of image
        return response.data.data.attributes['url-for-logo'];
    }

    async clearLogo(id, token) {
        let _client = this;
        const request = {
            method: "put",
            baseURL: _client.baseURL + "/fairsharing_records/" + id,
            headers: _client.auth_headers(token),
            data: {
                fairsharing_record: {
                    logo: {}
                }
            }
        };
        let response = await _client.executeQuery(request);
        // here the data returned always should be either an array of images or one string of image
        return response.data;
    }

    /**
     * Get a file of search results from the server
     * @param data - Data describing the search to be performed.
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    // TODO: This is ignored here due to problems testing SummaryDownload.vue's commenceDownload().
    // Please refer to SummaryDownload.spec.js for more information.
    // If you can fix it, please do.
    /* istanbul ignore next */
    async downloadSearch(data, jwt){
        const request = {
            method: "post",
            baseURL: this.baseURL + "/files/search_download",
            headers: this.auth_headers(jwt),
            data: data
        };
        let response = await this.executeQuery(request);
        return response.data;
    }

}

export default RESTClient;
