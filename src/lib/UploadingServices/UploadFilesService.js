import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        this.formData = new FormData();
    }

    async setFormData(data) {
        this.formData.append("id",data.id)
        this.formData.append("token",data.token)
        console.log(this.formData)
    }

    upload(file, onUploadProgress) {

        console.log(file)
        this.formData.append("logo",file)

        // //encode to base 64
        // file = btoa(file)
        console.log(this.formData)

        return restClient.uploadImages(this.formData, {
            onUploadProgress
        });
    }

    getFiles() {
        return restClient.downloadImages("/files");
    }
}

export default new UploadFilesService();
