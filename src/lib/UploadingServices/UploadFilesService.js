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
        this.formData.delete('logo')
        this.formData.append("logo", file)
        return await restClient.uploadLogo(this.formData);
    }

    async uploadMultipleFilesPerRequest(files) {
        // by doing the below line, the formData deletes all the previous 'files' keys
        for (let key in JSON.parse(JSON.stringify(Object.fromEntries(this.formData)))) {
            if (key.includes('files')) {
                this.formData.delete(key);
            }
        }

        // can upload multiple files in one request
        for (let i = 0; i < files.length; i++) {
            this.formData.append('files[' + i + ']', files[i])
        }

        // write the code to send multiple files in one request and calling an endpoint perhaps..
        // for test purpose I have returned an array  of items
        return files.map((file, index) => {
            return {url: 'url' + index, name: file.name}
        })

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
