<template>
  <div
    v-if="hits"
    class="mt-2"
  >
    <p
      v-if="user().id"
      class="text-center"
    >
      <v-tooltip top>
        <!-- eslint-disable-next-line  vue/no-template-shadow -->
        <template #activator="{ on }">
          <v-btn
            x-small
            class="info ml-5"
            v-on="on"
            :disabled="buttonDisabled"
          >
            <a
              @click="commenceDownload()"
            >
              <span class="white--text">Download</span>
            </a>
          </v-btn>
        </template>
        <span>{{ listControllerData.download }}</span>
      </v-tooltip>
      <!-- eslint-enable-next-line  vue/no-template-shadow -->
    </p>
  </div>
</template>

<script>
import {mapState} from "vuex";
import listControllerData from "@/data/ListControllerData.json";
import getHostname from "@/utils/generalUtils";
import recordsLabels from "@/data/recordsTypes.json";
import RESTClient from "@/lib/Client/RESTClient.js"

const client = new RESTClient();

export default {
  name: "SummaryDownload",
  mixins: [getHostname],
  data() {
    return {
      listControllerData: listControllerData,
      recordTypes: recordsLabels['recordTypes'],
      buttonDisabled: false
    }
  },
  computed: {
    ...mapState("records", ["records", "hits"]),
    ...mapState('users', ["user"]),
    currentPath: function () {
      let title = this.$route.path.replace('/', '');
      const client = this;
      let queryParams = {};
      // TODO: This is duplicated in Records.vue and perhaps could be refactored.
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = client.$route.query[prop];
        if (queryVal) {
          queryParams[prop] = decodeURI(queryVal);
        }
      });
      /* istanbul ignore if */
      if (this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]) {
        title = this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]
      }
      else title = title.charAt(0).toUpperCase() + title.slice(1);
      return [title, queryParams];
    },
  },
  methods: {
    // Please refer to SummaryDownload.spec.js for comments on why this is ignored.
    /* istanbul ignore next */
    async commenceDownload() {
      this.buttonDisabled = true;
      let params = this.$store.getters["introspection/buildQueryParameters"](this.currentPath);
      params['search_url'] = this.getHostname().slice(0, -1) + this.$route.fullPath;
      let ts = Math.round((new Date()).getTime() / 1000);
      let filename = "fairsharing_download_" + ts + ".csv"
      let data = await client.downloadSearch(params, this.user().credentials.token);
      // TODO: Stream this as a file.
      const blob = new Blob([data.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      a.click();
      a.remove();
      this.buttonDisabled = false;
    }
  }
}
</script>
