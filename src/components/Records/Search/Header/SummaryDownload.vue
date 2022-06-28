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
            :disabled="!downloadFile"
          >
            <a
              :href="downloadFile"
              download="fairsharing_results.csv"
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

export default {
  name: "SummaryDownload",
  mixins: [getHostname],
  data() {
    return {
      listControllerData: listControllerData,
      downloadFile: null
    }
  },
  computed: {
    ...mapState("records", ["records", "hits"]),
    ...mapState('users', ["user"])
  },
  watch: {
    records: {
      handler() {
        this.prepareFile();
      }
    }
  },
  methods: {
    prepareFile() {
      let _module = this;
      let output = [];
      let doi;
      _module.records.forEach(function(record) {
        if (record.doi) {
          doi = record.doi
        }
        else {
          doi = "N/A"
        }
        output.push(
            _module.getHostname() + record.id + "|" + doi + "|" + record.name
        )
      });
      this.downloadFile = "data:text/json;charset=utf-8," + encodeURIComponent(output.join("\n"));
    }
  }
}
</script>
