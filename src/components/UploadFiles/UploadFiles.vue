<template>
  <div>
    <UploadFilesPresentation
      ref="FileUpload"
      v-model="selectedFiles"
      :linear-progress-bar="linearProgressBar"
      :progress-infos="progressInfos"
      :select-files="selectFiles"
      :loading="loading"
      :file-infos="fileInfos"
      :download-files="downloadFiles"
      :allowed-file-size-mb="allowedFileSizeMb"
      :mime-type="mimeType"
      :multiple-upload="multipleUpload"
      :title="title"
      :input-label="inputLabel"
      @uploadFiles="uploadFiles"
    />
    <div class="d-flex flex-column">
      <div class="d-flex mb-2">
        <div
          v-for="(file,index) in previewImage"
          :key="file.name+'_'+index"
        >
          <v-img
            :src="file"
            :alt="file.name"
            width="80px"
            height="80px"
            cover
            class="mr-2"
          />
        </div>
      </div>
      <input
        ref="fileInput"
        type="file"
        multiple
        @input="pickFile"
      >
    </div>
  </div>
</template>

<script>
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import {isArray} from "lodash";
import UploadFilesPresentation from "@/components/UploadFiles/UploadFilesPresentation";

export default {
  name: "UploadFiles",
  // this component takes care of all the logic such as upload and download files
  components: {UploadFilesPresentation},
  props:{
    credentialInfo: {type: Object, default: null},
    initialImages: {type: [String , Array], default: null},
    uploadServiceName: {type: String, required: true},
    allowedFileSizeMb: {type: Number, required: true},
    baseApiEndpoint: {type: String, required: true},
    mimeType: {type: String, required: true},
    multipleUpload: {type: Boolean, default: false},
    linearProgressBar: {type: Boolean, default: true},
    multipleFilesPerRequest: {type: Boolean, default: false},
    fileKeyName: {type: String, default: null},
    title: {type: String, default: null},
    inputLabel: {type: String, default: 'Select File'},
  },
  data() {
    return {
      selectedFiles: null,
      fileInfos: [],
      loading: false,
      progressInfos: [],
      previewImage: [],
      ImagesForUpload:[],
      loadingPreview:false
    };
  },
  async mounted() {
    // initialize the selected model data to pass validation.
    this.selectFiles([])
    // if the credential is needed for upload process then set the formData default credential data / can be ignored in case we did not need credential for uploading
    await this.setFormCredential();
    // this method is used to  either call an api endpoint  or get file or list of files from store and update the list of presentation component.
    await this.downloadFiles()
  },
  methods: {
    async readMultipleFiles(files) {
      let reader = new FileReader();
      const temp = []
      const trimmedTemp = []

      async function readFile(index) {
        if (index >= files.length) return;
        let file = files[index];
        reader.onload = e => {
          // get file content
          temp.push(e.target.result)
          trimmedTemp.push(e.target.result.toString().split(',')[1])
          // do sth with bin
          readFile(index + 1)
        }
        reader.readAsDataURL(file);
      }

      await readFile(0);
      this.previewImage = temp;
      this.ImagesForUpload = trimmedTemp;
    },
    pickFile() {
      let input = this.$refs.fileInput
      let files = input.files
      this.previewImage = []
      this.ImagesForUpload = []
      if (!files) return;
      let temp = [];
      for (const [key, value] of Object.entries(files)) {
        temp[key] = value
      }
      this.readMultipleFiles(temp)
    },
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
      }
      else {
        this.selectedFiles = []
        this.selectedFiles[0] = files;
      }
    },
    async uploadFiles(hasError) {
      if (!this.selectedFiles || hasError) return
      // if we need to upload multiple file with one request
      if (this.multipleUpload && this.multipleFilesPerRequest) {
        await this.upload_multiple_files_once(this.selectedFiles);
      }
      // if we need to upload one file per request or more but one by one with having multiple request per file
      else {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          await this.upload(i, this.selectedFiles[i]);
        }
      }
      this.selectedFiles = null
      // calling afterUpdate from the FileUpload component to clear the error. this line is necessary in all cases
      await this.$refs.FileUpload.afterUpload();
    },
    async upload_multiple_files_once(files) {
      this.progressInfos = []
      this.loading = true
      this.progressInfos[0] = {percentage: 0};
      const response = await UploadService[this.uploadServiceName](files)
      // this.uploadServiceName which is a function of a method must be implemented the way to accept array of files
      this.progressInfos[0].percentage = 100;
      this.loading = false
      await this.downloadFiles(response);
    },
    async upload(idx, file) {
      this.loading = true
      this.progressInfos = []
      this.progressInfos[idx] = {percentage: 0, fileName: file.name};
      const response = await UploadService[this.uploadServiceName](file,this.fileKeyName)
      // this.uploadServiceName which is a function of a method must be implemented the way to accept one file per request
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
.imagePreviewWrapper {
  width: 80px;
  height: 80px;
  margin: 0 0 10px;
  background-size: cover;
  background-position: center center;
}
</style>