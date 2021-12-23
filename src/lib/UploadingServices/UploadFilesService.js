import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        // it is a singleton class so once created it will be remained in the memory
        if (UploadFilesService._instance){
            return UploadFilesService._instance
        }
        UploadFilesService._instance = this;
        this.formData = new FormData();
    }

    async setFormData(data) {
        let _upload = this;
        // can be passed or added any type of data we need to include before uploading the files like credentials
        _upload.formData.append("id",data.id)
        _upload.formData.append("token",data.token)
    }

    async uploadLogo(file) {
        let _upload = this;
        // tailored specially for uploading files and showing progress of upload as logo
        if (_upload.formData.get('logo')) {
            _upload.formData.set("logo", file)
        }
        else {
            _upload.formData.append("logo", file)
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

export default UploadFilesService;
