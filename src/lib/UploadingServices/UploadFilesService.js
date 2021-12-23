import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        this.formData = new FormData();
    }

    async setFormData(data) {
        // can be passed or added any type of data we need to include before uploading the files like credentials
        this.formData.append("id",data.id)
        this.formData.append("token",data.token)
    }

    async uploadLogo(file) {
        // tailored specially for uploading files and showing progress of upload as logo
        if (this.formData.get('logo')) {
            this.formData.set("logo", file)
        }
        else {
            this.formData.append("logo", file)
        }
        return await restClient.uploadLogo(this.formData);
    }

    /*
        // example of other upload classes that can be passed to UploadImage component as upload-service-name
        async uploadFilesToMyEndpoint(file, onUploadProgress) {
            // put your code to upload to other endpoint here
            for example sending as multiple-form data
        }
    */

}

export default new UploadFilesService();
