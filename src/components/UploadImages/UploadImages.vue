<template>
  <div>
    <UploadImagePresentation
      ref="FileUpload"
      linear-progress-bar
      :progress-infos="progressInfos"
      :selected-files="selectedFiles"
      :select-files="selectFiles"
      :loading="loading"
      :file-infos="fileInfos"
      :download-files="downloadFiles"
      :allowed-file-size-mb="allowedFileSizeMb"
      :mime-type="mimeType"
      @uploadFiles="uploadFiles"
    />
  </div>
</template>

<script>
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import {isArray} from "lodash";
import UploadImagePresentation from "@/components/UploadImages/UploadImagePresentation";

export default {
  name: "UploadImages",
  // this component takes care of all the logic such as upload and download files
  components: {UploadImagePresentation},
  props:{
    credentialInfo: {type: Object, default: null},
    initialImages: {type: [String , Array], default: null},
    uploadServiceName: {type: String, required: true},
    allowedFileSizeMb: {type: Number, required: true},
    baseApiEndpoint: {type: String, required: true},
    mimeType: {type: String, required: true},
    multipleUpload: {type: Boolean, default: false},
  },
  data() {
    return {
      selectedFiles: null,
      fileInfos: [],
      loading: false,
      progressInfos: []
    };
  },
  async mounted() {
    // if the credential is needed for upload process then set the formData default credential data / can be ignored in case we did not need credential for uploading
    await this.setFormCredential();
    // this method is used to  either call an api endpoint  or get file or list of files from store and update the list of presentation component.
    await this.downloadFiles()
  },
  methods: {
    async setFormCredential() {
      // write the code for credentials here ..
      if (this.credentialInfo) {
        let data = {
          id: this.credentialInfo.id,
          token: this.credentialInfo.token
        }
        await UploadService.setFormData(data)
      }
    },
    selectFiles(files) {
      if (isArray(files)) {
        this.selectedFiles = files;
      } else {
        this.selectedFiles = []
        this.selectedFiles[0] = files;
      }
    },
    async uploadFiles(hasError) {
      if (!this.selectedFiles || hasError) return
      for (let i = 0; i < this.selectedFiles.length; i++) {
        await this.upload(i, this.selectedFiles[i]);
      }
      this.selectedFiles = null
      // calling afterUpdate from the FileUpload component to clear the error. this line is necessary in all cases
      await this.$refs.FileUpload.afterUpload();
    },
    async upload(idx, file) {
      this.loading = true
      this.progressInfos[idx] = {percentage: 0, fileName: file.name};
      const response = await UploadService[this.uploadServiceName](file)
      this.progressInfos[idx].percentage = 100;
      this.loading = false
      await this.downloadFiles(response);
    },
    async downloadFiles(response = null) {
      // response is defined for those API that immediately response back the updated data
      // if there is an initial image or images then add it to list
      this.fileInfos = []
      // connect your data either from store or a get response from an endpoint and assign it to filesSource.
      let filesSource = this.initialImages;
      // currentImages can be filled with any other source of data either array of images or one string of image / in case there is a response it will fill with response back from update operation
      let currentImages = response ? response : filesSource
      if (!currentImages) return
      // Image addresses needs to be relative and the endpoint MUST be passed as prop its either string image or array of image url
      if (isArray(currentImages)) {
        this.fileInfos = currentImages.map(image=>{
          return {url:`${this.baseApiEndpoint}${image}`,name:image.name}
        })
      } else {
        this.fileInfos.push({
          url: `${this.baseApiEndpoint}${currentImages}`,
          name: 'fileName'
        });
      }
    }
  }
}
</script>

<style scoped>

</style>