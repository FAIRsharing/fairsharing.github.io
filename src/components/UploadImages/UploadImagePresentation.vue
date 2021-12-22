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
    <!--  Upload  -->
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
          ref="fileInput"
          :value="selectedFiles"
          accept="image/*"
          show-size
          :multiple="multipleUpload"
          label="Select Images"
          hint="the image size must be below 2mb"
          :rules="[rules.isAllowedSize()]"
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
          @click="callUpload"
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

    <!--  Showing default single Image or list of Images  -->
    <v-card
      v-if="fileInfos.length > 0"
      class="mx-auto"
    >
      <v-list>
        <v-subheader>List of Images</v-subheader>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(file, index) in fileInfos"
            :key="file.size+''+index"
          >
            <v-list-item-content>
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
import {isAllowedSize} from "@/utils/rules";

export default {
  name: "UploadImagePresentation",
  // this component only is responsible for presentation and must not include any logic
  props: {
    multipleUpload: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    linearProgressBar: {type: Boolean, default: true},
    progressInfos: {type: Array, default:()=> []},
    fileInfos: {type: Array, default:()=> []},
    selectedFiles: {type: Array, default:null},
    selectFiles: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      rules: {
        isAllowedSize: ()=> isAllowedSize(),
      },
    };
  },
  computed:{
    hasError() {
      return this.$refs.fileInput.hasError
    }
  },
  methods:{
    callUpload() {
      this.$emit('uploadFiles',this.hasError)
    },
    async afterUpload(){
      await this.$refs.fileInput.reset()
    }
  }
}
</script>

<style scoped>

</style>