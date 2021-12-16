<template>
  <div>
    <!--  progressBar  -->
    <div v-if="progressInfos && linearProgressBar">
      <div
        v-for="(progressInfo, index) in progressInfos"
        :key="index"
        class="mb-2"
      >
        <span>{{ progressInfo.fileName }}</span>
        <v-progress-linear
          :value="progressInfo.percentage"
          color="light-blue"
          height="25"
          striped
        >
          <strong>{{ progressInfo.percentage }} %</strong>
        </v-progress-linear>
      </div>
    </div>

    <v-row
      no-gutters
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="12"
        md="11"
      >
        <v-file-input
          v-model="selectedFiles"
          accept="image/*"
          show-size
          :multiple="multipleUpload"
          label="Select Images"
          @change="selectFiles"
        />
      </v-col>

      <v-col
        cols="12"
        sm="12"
        md="1"
        class="pl-2"
      >
        <v-btn
          color="success"
          dark
          small
          :loading="loading"
          @click="uploadFiles"
        >
          Upload
          <v-icon
            right
            dark
            small
          >
            fa-upload
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-alert
      v-if="message"
      border="left"
      color="teal"
      outlined
      class="multi-line"
    >
      {{ message }}
    </v-alert>

    <v-card
      v-if="fileInfos.length > 0"
      class="mx-auto"
    >
      <v-list>
        <v-subheader>List of Images</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(file, index) in fileInfos"
            :key="index"
          >
            <v-list-item-content>
              <v-list-item-title class="mb-3">
                <a :href="file.url">{{ file.name }}</a>
              </v-list-item-title>
              <v-list-item-subtitle>
                <img
                  :src="file.url"
                  :alt="file.name"
                  height="80px"
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import {isArray} from "lodash";

export default {
  name: "UploadImages",
  props:{
    multipleUpload: {type: Boolean, default: false},
    linearProgressBar: {type: Boolean, default: true},
    credentialInfo: {type: Object, default: null},
    currentRecordLogo: {type: String, default: null},
  },
  data() {
    return {
      selectedFiles: null,
      message: "",
      fileInfos: [],
      loading: false,
      progressInfos: []
    };
  },
  async mounted() {
    // if the credential is needed for upload process then set the formData default credential data / can be ignored in case we did not need and included any credential prop
    await this.setFormCredential();
    // set current record url-for-logo using props so this can be decoupled from the context / can be ignored if currentRecordLogo is not passed as prop.
    this.setDefaultImageList();
  },
    methods: {
      setDefaultImageList() {
        const API_ENDPOINT = 'https://api.fairsharing.org';
        if (this.currentRecordLogo) {
          let response = {
            data: {
              attributes: {
                'url-for-logo': API_ENDPOINT + this.currentRecordLogo
              }
            }
          }
          this.updateImageList(response)
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
     async uploadFiles() {
      if (!this.selectedFiles) return
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
         await this.upload(i, this.selectedFiles[i]);
      }
      this.selectedFiles = null
     },
     async upload(idx, file) {
      this.loading = true
       this.progressInfos[idx] = { percentage: 0, fileName: file.name };
       const response = await UploadService.upload(file,(event)=>{
         this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
       })
       this.updateImageList(response);
        this.loading = false
    },
     updateImageList(response) {
          // handling multiple images
        if (isArray(response.data.attributes['url-for-logo'])) {
          this.fileInfos = response.data.attributes['url-for-logo']
        }
        else if(response.data.attributes['url-for-logo']){
          // handling single image
          this.fileInfos.push({url: response.data.attributes['url-for-logo'].replace("api", "dev-api"), name: 'logo'});
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