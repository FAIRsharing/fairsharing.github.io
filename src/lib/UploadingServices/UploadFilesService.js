import RESTClient from "@/lib/Client/RESTClient.js"

let restClient = new RESTClient();

class UploadFilesService {
    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        return restClient.uploadImages("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    getFiles() {
        return restClient.downloadImages("/files");
    }
}

export default new UploadFilesService();
