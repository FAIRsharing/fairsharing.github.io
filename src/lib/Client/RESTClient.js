import {toBase64} from "@/utils/generalUtils"
import CRUD from "@/lib/Client/CRUD";

class RESTClient extends CRUD {
    /**
     * The RESTClient is a singleton class that handles the connection and data exchange from the back-end
     * REST API.
     */
    constructor() {
        super({
            baseURL: process.env.VUE_APP_API_ENDPOINT, headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "X-Client-Id": "process.env.VUE_APP_CLIENT_ID"
            }
        });
        if (RESTClient._instance) {
            return RESTClient._instance
        }
        RESTClient._instance = this;
    }

    /* USERS: all methods below related to handling user authentication */

    /**
     * Method to log in the user
     * @param username - name of the user
     * @param password - password of the user
     * @return {Promise} - the response of the server
     */
    async login(username, password) {
        const body = {
            user: {
                login: username,
                password: password
            }
        };
        return await this.create("/users/sign_in", body)
    }

    /**
     * Logout the user from the back, expiring the current jwt.
     * @param {String} jwt - the user token to expire.
     * @returns {Promise}
     */
    async logout(jwt) {
        this.set_auth_headers(jwt)
        return await this.delete("users/sign_out")
    }

    /**
     *  Method to create a new user
     * @param {Object} userLogin - the user account to create
     * @returns {Promise} response - server response
     */
    async createAccount(userLogin) {
        return await this.create("/users",{user: userLogin})
    }

    /**
     * Validate the account given the corresponding token
     * @param {String} token - the account token to validate
     * @returns {Promise}
     */
    async confirmAccount(token) {
        return await this.get(`/users/confirmation?confirmation_token=${token}`)
    }

    /**
     * Method to send a reset password link to the given email address
     * @param {String} email to send the link to
     * @returns {Promise}
     */
    async requestResetPwd(email) {
        return await this.create("/users/password", {
            user: {email: email}
        })
    }

    /**
     * Resend the validation link for a given user
     * @param {Object} user - contains the email of the user.
     * @returns {Promise}
     */
    async resendConfirmation(user) {
        return await this.create("/users/confirmation", {user: user})
    }

    /**
     * Reset the password of the given user
     * @param {Object} user - contains the new pwd, repeated pwd and token.
     * @returns {Promise}
     */
    async resetPassword(user) {
        return await this.update("/users/password", {user: user})
    }

    /**
     * Changes the password of the logged in user
     * @param {String} jwt - the user token
     * @param {Object} user - contains the current, new and repeated new password
     * @returns {Promise}
     */
    async resetPasswordWithoutToken(jwt, user) {
        this.set_auth_headers(jwt)
        return await this.update("/users/", {user: user})
    }

    /**
     * Verify the validity of the given password
     * @param {String} password - the password to test
     * @returns {Promise}
     */
    async verifyPassword(password) {
        return await this.create("/users/check_password", {password: password})
    }

    /**
     * Get the current user data
     * @param jwt
     * @returns {Promise}
     */
    async getUser(jwt) {
        this.set_auth_headers(jwt)
        return await this.get("/users/edit")
    }

    /**
     * Get the current user data
     * @param jwt
     * @param id
     * @returns {Promise}
     */
    async getPublicUser(jwt, id) {
        this.set_auth_headers(jwt)
        return await this.get(`/user_admin/${id}`)
    }

    /**
     * Get all users list
     * @param jwt
     * @returns {Promise}
     */
    async getUsersList(jwt) {
        this.set_auth_headers(jwt)
        return await this.get("/user_admin/")
    }

    /**
     * Edit the current logged in user profile
     * @param {Object} newUser - the new values for the logged in user
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async editUser(newUser, jwt){
        this.set_auth_headers(jwt)
        return await this.update("/users",{user: newUser})
    }
    /**
     * Edit the current logged in user profile
     * @param {Object} newUser - the new values for the logged in user
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async editPublicUser(newUser, jwt){
        this.set_auth_headers(jwt)
        return await this.update(`/user_admin/${newUser.id}`,{user: newUser})
    }
    /**
     * Delete the user
     * @param userID
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async deletePublicUser(userID, jwt) {
        this.set_auth_headers(jwt)
        return await this.delete(`/user_admin/${userID}`)
    }
    /**
     * Verify that the given JWT is still valid
     * @param {String} jwt - the token to validate
     * @returns {Promise}
     */
    async validateToken(jwt) {
        this.set_auth_headers(jwt)
        return await this.get("/users/valid")
    }


    /* EDITORS METHODS */

    /**
     * Post the given object to the API to create the corresponding record.
     * @param record
     * @param {String} jwt - JWT of the logged in user
     * @returns {Promise}
     */
    async createRecord(record, jwt) {
        this.set_auth_headers(jwt)
        return await this.create("/fairsharing_records", {fairsharing_record: record})
    }

    /**
     * Update the given record
     * @param {Object} record - the record to update containing the ID to target, the new values
     * and the user token
     * @returns {Promise}
     */
    async updateRecord(record) {
        this.set_auth_headers(record.token)
        return await this.update(`/fairsharing_records/${record.id}`, {fairsharing_record: record.record})
    }

    /**
     * Determine if a user has permission to edit this record.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async canEdit(recordID, userToken) {
        this.set_auth_headers(userToken)
        return await this.get(`/fairsharing_records/can_edit/${recordID}`)
    }

    /**
     * Attempt to create a MaintenanceRequest for a user for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async claimRecord(recordID, userToken) {
        this.set_auth_headers(userToken)
        return await this.create("/maintenance_requests", {maintenance_request: {fairsharing_record_id: recordID}})
    }

    /**
     * Determine if a user has permission to create a MaintenanceRequest for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async canClaim(recordID, userToken) {
        this.set_auth_headers(userToken)
        return await this.get(`/maintenance_requests/existing/${recordID}`)
    }

    /**
     * Attempt to create a RecordReview for a user for a FairsharingRecord.
     * @param {Integer} recordID - ID for the relevant FairsharingRecord.
     * @param {String} userToken - JWT of the logged in user
     * @returns {Promise}
     */
    async reviewRecord(recordID, userToken) {
        this.set_auth_headers(userToken)
        return await this.create("/record_reviews", {record_review: {fairsharing_record_id: recordID}})
    }

    /* USER DEFINED TAGS */

    /**
     * Create a new user defined tag in the database for users to tag their records.
     * @param {String} term - the string value of the term
     * @param {String} token - the user JWT
     * @returns {Promise}
     */
    async createNewUserDefinedTag(term, token) {
        this.set_auth_headers(token)
        return await this.create("/user_defined_tags", {user_defined_tag: {label: term}})
    }


    /* LICENCES */

    /**
     * Create new a licence link
     * @param {Object} licenceLink - the licence link to create
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async createLicenceLink(licenceLink, token) {
        this.set_auth_headers(token)
        return await this.create("/licence_links", {licence_link: licenceLink})
    }

    /**
     * Delete the given licence
     * @param {Number} id - id of the licence link to delete
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async deleteLicenceLink(id, token) {
        this.set_auth_headers(token)
        return await this.delete(`/licence_links/${id}`)
    }

    /**
     * Update the licenceLink
     * @param {Object} licenceLink - the new values for the licence link
     * @param {String} token the user token
     * @returns {Promise}
     */
    async updateLicenceLink(licenceLink, token) {
        this.set_auth_headers(token)
        return await this.update(`/licence_links/${licenceLink.id}`, {licence_link: licenceLink})
    }


    /* PUBLICATIONS */

    async createPublication(publication, token) {
        this.set_auth_headers(token)
        return await this.create("/publications", {publication: publication})
    }

    async editPublication(publication, token) {
        this.set_auth_headers(token)
        return await this.update(`/publications/${publication.id}`, {publication: publication})
    }

    /* RELATIONSHIPS BETWEEN RECORDS */
    /**
     * Saves the relationships as an array of items containing a targetID, a sourceID and a labelID
     * @param {Object} options - the options to pass as {token: String, relations: Array}
     * @returns {Promise}
     */
    async saveRelations(options) {
        if (options.relations.length > 0) {
            this.set_auth_headers(options.token)
            return await this.update(`/fairsharing_records/${options.target}`, {fairsharing_record: {record_associations_attributes: options.relations}})
        }
        return {};
    }

    /**
     * Deletes the relationships as an array of items containing a targetID, a sourceID and a labelID
     * @param {Object} options - the options to pass as {token: String, relations: Array}
     * @returns {Promise}
     */
    async deleteRelations(options) {
        if (options.relations.length > 0) {
            this.set_auth_headers(options.token)
            return await this.update(`/fairsharing_records/${options.target}`, {fairsharing_record: {record_associations_attributes: options.relations}})
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
    async createOrganisation(organisation, userToken) {
        this.set_auth_headers(userToken)
        return await this.create(`/organisations`, {organisation: organisation})
    }

    /**
     * Create a given grant
     * @param {Object} grant
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createGrant(grant, userToken) {
        this.set_auth_headers(userToken)
        return await this.create(`/grants`, {grant: grant})
    }

    /**
     * Create a new link between an organisation, a record and an optional grant.
     * @param {Object} organisationLink - the organisation link to create
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async createOrganisationLink(organisationLink, userToken) {
        this.set_auth_headers(userToken)
        return await this.create(`/organisation_links`, {organisation_link: organisationLink})
    }

    /**
     * Update the organisationLink given from linkID input with the given organisationLink
     * @param {Object} organisationLink - the new organisation link value
     * @param {Number} linkID - ID of the organisationLink to update
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async updateOrganisationLink(organisationLink, linkID, userToken) {
        this.set_auth_headers(userToken)
        return await this.update(`/organisation_links/${linkID}`, {organisation_link: organisationLink})
    }

    /**
     * Delete the given organisation link
     * @param {Number} linkID - the id of the link to remove
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async deleteOrganisationLink(linkID, userToken) {
        this.set_auth_headers(userToken)
        return await this.delete(`/organisation_links/${linkID}`)
    }

    /**
     * Get the extra metadata fields for a RecordType
     * @param {String} type - name of the record type.
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async extraMetadataFields(type, userToken) {
        this.set_auth_headers(userToken)
        return await this.create(`/fairsharing_records/metadata_fields`, {type: type})
    }

    /* METHODS FOR CURATION */
    /**
     * Update the maintenanceRequest given the new status value
     * @param {Number} maintenanceRequest  ID of the maintenanceRequest to update
     * @param {string} newStatus - new status to update
     * @param {String} userToken - the user jwt
     * @returns {Promise}
     */
    async updateStatusMaintenanceRequest(maintenanceRequest, newStatus, userToken) {
        this.set_auth_headers(userToken)
        return await this.update(`/maintenance_requests/${maintenanceRequest}`, {maintenance_request: {status: newStatus}})
    }

    /**
     * Delete Record
     * @param {Number} id - id of the record link to delete
     * @param {String} token - the user token
     * @returns {Promise}
     */
    async deleteRecord(id, token) {
        this.set_auth_headers(token)
        return await this.delete(`/fairsharing_records/${id}`)
    }

    /**
     * Get the list of allowed relation types for editing record's relationships.
     * @returns {Promise}
     */
    /* EDITOR DATA */
    async getRelationsTypes() {
        return await this.get(`/record_associations/allowed`)
    }

    /**
     * Get the list of available profile types for a user.
     * @returns {Promise}
     */
    async getProfileTypes() {
        return await this.get(`/users/profile_types`)
    }

    /* EXTRA METHODS */

    /**
     * Trigger the given query with Axios
     * @param query
     * @returns {Promise<*>}
     */


    /**
     * Get records without DOIS
     * @param {String} userToken - the user token that needs to be a curator
     * @returns {Promise}
     */
    async getRecordsWoDOIs(userToken) {
        this.set_auth_headers(userToken)
        return await this.get(`/files/no_dois`)
    }

    async uploadLogo(formData) {
        this.set_auth_headers(formData.get("token"))
        const logoData = {
            fairsharing_record: {
                logo: {
                    filename: formData.get("logo").name,
                    // //encode to base 64
                    data: await toBase64(formData.get("logo")),
                    content_type: formData.get("logo").type,
                }
            }
        };
        const response = await this.update(`/fairsharing_records/${formData.get("id")}`, logoData)
        // here the data returned always should be either an array of images or one string of image
        return response.data.data.attributes['url-for-logo'];
    }

}

export default RESTClient;
