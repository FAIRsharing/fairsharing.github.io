import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {

    constructor() {
        this.formData = new FormData();
    }

    async setFormData(data) {
        // can be passed or added any type of data we need to include BEFORE uploading the files like credentials
        for (const [key, value] of Object.entries(data)) {
            this.formData.append(key, String(value))
        }
    }

    async uploadOneFilePerRequest(file,key="file") {
        this.formData.delete(key)
        this.formData.append(key, file)
        // the below line is tailored specially for uploading files for FAIRsharing app.
        return await restClient.uploadLogo(this.formData);
    }

    async clearLogoData(id, token) {
        return await restClient.clearLogo(id, token);
    }

    async uploadMultipleFilesPerRequest(files) {
        // by doing the below line, the formData deletes all the previous 'files' keys
        for (let key in JSON.parse(JSON.stringify(Object.fromEntries(this.formData)))) {
            if (key.includes('files')) {
                this.formData.delete(key);
            }
        }

        // can add multiple files in one request
        for (let i = 0; i < files.length; i++) {
            this.formData.append('files[' + i + ']', files[i])
        }

        // write your code for sending multiple files in one request to call API endpoint
        // for test purpose I have returned an array of items
        return files.map((file, index) => {
            return {url: 'url' + index, name: file.name}
        })

    }

}

export default new UploadFilesService();
