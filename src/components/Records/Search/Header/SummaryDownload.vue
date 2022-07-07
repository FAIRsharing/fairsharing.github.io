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
            :disabled="buttonDisabled"
            x-small
            class="info mr-10"
            v-on="on"
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
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import downloadSearchResults from "@/lib/GraphClient/queries/downloadSearchResults.json";

const client = new GraphClient();

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
      const _module = this;
      let queryParams = {};
      // TODO: This is duplicated in Records.vue and perhaps could be refactored.
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = _module.$route.query[prop];
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
      params['searchUrl'] = this.getHostname().slice(0, -1) + this.$route.fullPath;
      const notAllowed = ['orderBy', 'page', 'perPage']
      notAllowed.forEach(function(na) {
        if (na in params) {
          delete params[na];
        }
      });
      if ('q' in params) {
        // TODO: Is it worth preserving foreign characters as discussed here?
        // https://stackoverflow.com/questions/22192458/how-to-remove-non-alphanumeric-characters-and-space-but-keep-foreign-language-i
        const cleaned = params['q'].replace(/[^0-9a-z\s]/gi, '');
        const newParams = { ...params, q: cleaned }
        downloadSearchResults.queryParam = newParams;
      }
      else {
        downloadSearchResults.queryParam = params;
      }
      let ts = Math.round((new Date()).getTime() / 1000);
      let filename = "fairsharing_download_" + ts + ".csv"

      client.initalizeHeader();
      client.setHeader(this.user().credentials.token);
      let data = await client.executeQuery(downloadSearchResults);
      //console.log(JSON.stringify(data));

      const blob = new Blob([data.downloadSearchResults.fileData.join('\n')], { type: 'text/csv' });
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
