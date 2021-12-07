import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        this.formData = new FormData();
    }

    async setFormData(data) {
        this.formData.append("id",data.id)
        this.formData.append("token",data.token)
    }

    async upload(file) {
        this.formData.append("logo",file)
        return await restClient.uploadImages(this.formData);
    }
}

export default new UploadFilesService();
