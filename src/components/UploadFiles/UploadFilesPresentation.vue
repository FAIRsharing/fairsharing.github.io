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
        :md="hasPreview?12:11"
      >
        <v-file-input
          ref="fileInput"
          :value="value"
          :accept="mimeType"
          show-size
          :multiple="multipleUpload"
          :label="inputLabel"
          :hint="`images must be less than ${allowedFileSizeMb} MB`"
          :rules="[rules.isAllowedSize()]"
          @change="selectFiles"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        :md="hasPreview?12:1"
        class="pl-2"
      >
        <v-btn
          v-if="!hasPreview"
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
      v-if="fileInfos.length > 0 && !cleared"
      class="mx-auto mt-1"
    >
      <v-list>
        <b class="ml-2">{{ multipleUpload?'Uploaded Files':'Uploaded File' }}</b>
        <v-subheader>{{ title }}</v-subheader>
        <!--   Images list     -->
        <v-list-item-group
          v-if="mimeType.includes('image')"
          color="primary"
        >
          <v-list-item
            v-for="(file, index) in fileInfos"
            :key="file.size+''+index"
          >
            <v-list-item-content>
              <v-list-item-subtitle>
                <v-img
                  :src="file.url"
                  :alt="file.name"
                  max-width="100px"
                  max-height="100%"
                  contain
                />
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <!--   PDF list     -->
        <v-list-item-group
          v-if="mimeType.includes('pdf')"
          color="primary"
        >
          <v-list-item
            v-for="(file, index) in imageInfo"
            :key="file.size+''+index"
          >
            <v-list-item-content>
              <v-list-item-subtitle>
                {{ file.url }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <!--   Can be extended for more input types   -->
      </v-list>
      <v-card-actions>
        <v-btn
          class="primary"
          :disabled="false"
          small
          @click="clearImages()"
        >
          Clear
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import {isAllowedSize} from "@/utils/rules";

export default {
  name: "UploadFilesPresentation",
  // this component only is responsible for presentation and must not include any logic
  props: {
    multipleUpload: {type: Boolean, default: false},
    loading: {type: Boolean, default: false},
    hasPreview: {type: Boolean, default: true},
    linearProgressBar: {type: Boolean, default: true},
    progressInfos: {type: Array, default:()=> []},
    fileInfos: {type: Array, default:()=> []},
    value: {type: Array, default:null},
    allowedFileSizeMb: {type: Number, required: true},
    mimeType: {type: String, required: true},
    title: {type: String, default: null},
    inputLabel: {type: String, default: 'Select File'},
    selectFiles: {
      type: Function,
      default: () => {}
    },
    downloadFiles: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      rules: {
        isAllowedSize: ()=> isAllowedSize(this.allowedFileSizeMb),
      },
      imageInfo: [...this.fileInfos],
      cleared: false
    };
  },
  computed:{
    hasError() {
      return this.$refs.fileInput.hasError;
    },
    imageMod: {
      set: function(newValue) {
        this.imageInfo = newValue;
      }
    }
  },
  methods:{
    callUpload() {
      this.$emit('uploadFiles',this.hasError)
    },
    async afterUpload(){
      await this.$refs.fileInput.reset();
    },
    clearImages(){
      this.$emit('clearInput', true);
      this.imageMod = [];
      this.cleared = true;
    }
  }
}
</script>