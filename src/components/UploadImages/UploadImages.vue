<template>
  <div>
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
import {mapGetters, mapState} from "vuex";
import {isArray} from "lodash";

export default {
  name: "UploadImages",
  props:{
    multipleUpload: {type: Boolean, default: false}
  },
  data() {
    return {
      selectedFiles: null,
      message: "",
      fileInfos: [],
    };
  },
  computed: {
    ...mapState('users', ["user"]),
    ...mapGetters('record', ['getField']),
  },
  async mounted() {
    const _module = this;
    let data = {
      id: _module.getField('id'),
      token: _module.user().credentials.token
    }
    await UploadService.setFormData(data)
  },
    methods: {
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
       const response = await UploadService.upload(file)
       this.updateImageList(response);
    },
     updateImageList(response) {
          // handling multiple images
        if (isArray(response.data.attributes['url-for-logo'])) {
          this.fileInfos = response.data.attributes['url-for-logo']
        }
        else if(response.data.attributes['url-for-logo']){
          // handling single image
          this.fileInfos[0] = {url: response.data.attributes['url-for-logo'].replace("api", "dev-api"), name: 'logo'};
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