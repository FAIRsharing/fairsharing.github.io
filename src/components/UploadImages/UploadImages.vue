<template>
  <div>
    <UploadImagePresentation
      ref="ImageUpload"
      linear-progress-bar
      :progress-infos="progressInfos"
      :selected-files="selectedFiles"
      :select-files="selectFiles"
      :loading="loading"
      :file-infos="fileInfos"
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
    // if the credential is needed for upload process then set the formData default credential data / can be ignored in case we did not need and included any credential prop
    await this.setFormCredential();
    // set current record url-for-logo using initialImages props so this can be decoupled from the context / can be ignored if initialImages is not passed as prop.
    this.setDefaultImageList();
  },
    methods: {
      setDefaultImageList() {
        // if its an array as default images to show then map it with extra API(VUE_APP_API_ENDPOINT) endpoint/map part is tailored for this app can be changed on different situation
        if (isArray(this.initialImages)) {
          this.initialImages.map(imageItem => imageItem.url = process.env.VUE_APP_API_ENDPOINT + imageItem.url)
        }

        if (this.initialImages) {
          let response = {
            data: {
              attributes: {
                'url-for-logo': this.initialImages
              }
            }
          }
          this.downloadFiles(response)
        }
      },
      async setFormCredential() {
        if (this.credentialInfo) {
          let data = {
            id: this.credentialInfo.id,
            token: this.credentialInfo.token
          }
          await UploadService.setFormData(data)
        }
      },
      selectFiles: function (files) {
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
      for (let i = 0; i < this.selectedFiles.length; i++) {
         await this.upload(i, this.selectedFiles[i]);
      }
      this.selectedFiles = null
      // calling afterUpdate from the ImageUpload component to clear the error. this line is necessary in all cases
      await this.$refs.ImageUpload.afterUpload();
     },
     async upload(idx, file) {
      this.loading = true
       this.progressInfos[idx] = { percentage: 0, fileName: file.name };
       const response = await UploadService.upload(file,(event)=>{
         this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
       })
       this.loading = false
       await this.downloadFiles(response);
    },
     async downloadFiles(response) {
          // this part is tailored for fairsharing application and its logic can be changed according to requirements
          // handling multiple images
        if (isArray(response.data.attributes['url-for-logo'])) {
          this.fileInfos = response.data.attributes['url-for-logo']
        }
        else if(response.data.attributes['url-for-logo']){
          // handling single image
          this.fileInfos = []
          this.fileInfos.push({
            url: `${process.env.VUE_APP_API_ENDPOINT}${response.data.attributes['url-for-logo']}`,
            name: 'logo'
          });
        }
        else  {
          // no image returned so reset the fileInfos
          this.fileInfos = []
        }
      }
  },
}
</script>

<style scoped>

</style>