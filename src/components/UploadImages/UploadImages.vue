<template>
  <div>
    <v-row
      no-gutters
      justify="center"
      align="center"
    >
      <v-col cols="8">
        <v-file-input
            v-model="selectedFiles"
          accept="image/*"
          multiple
          show-size
          label="Select Images"
          @change="selectFiles"
        />
      </v-col>

      <v-col
        cols="4"
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
          >
            mdi-cloud-upload
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
export default {
  name: "UploadImages",
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
    selectFiles(files) {
      this.selectedFiles = files;
    },
     uploadFiles() {
      this.message = "";
      for (let i = 0; i < this.selectedFiles.length; i++) {
         this.upload(i, this.selectedFiles[i]);
      }
      this.selectedFiles = null
     },
     async upload(idx, file) {
       const response = await UploadService.upload(file)
       this.fileInfos = response.data.urlForLogo || [];
       console.log(response)
    }
  },
}
</script>

<style scoped>

</style>