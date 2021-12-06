import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    async setFormData(data) {
        this.formData = data;
        console.log(this.formData)
    }

    upload(file, onUploadProgress) {
        //encode to base 64
        file = btoa(file)


        this.formData = {...this.formData, logo: file}
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
