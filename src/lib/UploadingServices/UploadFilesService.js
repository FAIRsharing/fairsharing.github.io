import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        this.formData = new FormData();
    }

    async setFormData(data) {
        // can be passed or added any type of data we need to include before uploading the files
        this.formData.append("id",data.id)
        this.formData.append("token",data.token)
    }

    async upload(file, onUploadProgress) {
        // tailored specially for uploading files and showing progress of upload
        this.formData.append("logo",file)
        return await restClient.uploadImages(this.formData,onUploadProgress);
    }
}

export default new UploadFilesService();
