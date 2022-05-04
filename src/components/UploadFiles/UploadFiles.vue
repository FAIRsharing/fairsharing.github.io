<template>
  <div class="upload-border">
    <span class="logo-title">Logo</span>
    <!-- Preview of the image or anything can be listed here   -->
    <div
      v-if="hasPreview"
      class="d-flex flex-column m-1"
    >
      <b class="mb-2">Update this resource's logo:</b>
      <div
        v-if="previewImages && previewImages.length"
        class="d-flex mb-2"
      >
        <div
          v-for="(file,index) in previewImages"
          :key="index"
        >
          <v-img
            :src="file"
            max-width="100px"
            max-height="100%"
            contain
            class="mr-2"
          />
        </div>
      </div>
    </div>
    <!-- It takes care of the presentation of the upload input   -->
    <UploadFilesPresentation
      ref="FileUpload"
      v-model="selectedFiles"
      :linear-progress-bar="linearProgressBar"
      :progress-infos="progressInfos"
      :select-files="hasPreview?selectFilesForPreview:selectFiles"
      :loading="loading"
      :file-infos="fileInfos"
      :download-files="downloadFiles"
      :clear-input="clearInput"
      :allowed-file-size-mb="allowedFileSizeMb"
      :mime-type="mimeType"
      :multiple-upload="multipleUpload"
      :has-preview="hasPreview"
      :title="title"
      :input-label="inputLabel"
      @uploadFiles="uploadFiles"
      @clearInput="clearInput"
    />
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
    hasPreview: {type: Boolean, default: true},
    inputLabel: {type: String, default: 'Select File'},
  },
  data() {
    return {
      selectedFiles: null,
      fileInfos: [],
      loading: false,
      progressInfos: [],
      previewImages: [],
      imagesForUpload:[],
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
    async promiseFunc(index,files) {
      let temp= this.previewImages;
      let uploadTemp= this.imagesForUpload;
      return new Promise((resolve) => {
      const reader = new FileReader();
      let file = files[index];
      if (index >= files.length) return
        reader.addEventListener('load',(e)=>{
          // get file content
          temp.push(e.target.result)
          uploadTemp[index] =  {filename: file.name, content_type: file.type, data: file}
          // recall read data
          resolve({
            temp,
            uploadTemp
          })
          this.promiseFunc(index + 1, files)
        })
      reader.readAsDataURL(file);
    })
    },
    async readMultipleFilesRecursive(files) {
      let {temp,uploadTemp} = await this.promiseFunc(0, files)
      this.previewImages = temp
      this.imagesForUpload = uploadTemp
      this.$emit("passDataToParent",this.imagesForUpload)
    },
    async selectFilesForPreview(files) {
      this.selectFiles(files);
      this.previewImages = []
      this.imagesForUpload = []
      if (!files) return;
      let temp = [];
      for (const [key, value] of Object.entries(files)) {
        temp[key] = value
      }
      await this.readMultipleFilesRecursive(temp)
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
    async clearInput(deleteExisting) {
      this.imagesForUpload = [];
      this.$emit("passDataToParent", this.imagesForUpload);
      if (deleteExisting) {
        await UploadService.clearLogoData(this.credentialInfo.id, this.credentialInfo.token);
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

<style scoped lang="scss">
.upload-border {
  position:relative;
  padding: 1rem 1rem 1rem;
  border: #b8b8b8 dashed 1px;
  border-radius: 1%;
  -moz-border-radius: 1%;
  -webkit-border-radius: 1%;

  .logo-title {
    @include absTopLeft;
    background:white;
    height:10px;
  }
}
</style>