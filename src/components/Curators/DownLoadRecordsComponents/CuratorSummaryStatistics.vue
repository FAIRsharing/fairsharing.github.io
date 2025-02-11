<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text>
        <v-card-title
          id="download-curator-summary"
          class="green white--text"
        >
          CURATOR SUMMARY STATISTICS
          <v-btn
            class="info ml-5"
            :loading="loading"
          >
            <a
              v-if="downloadCuratorContent"
              :href="downloadCuratorContent"
              download="curatorSummaryStatistics.txt"
            >
              <v-icon
                color="white"
                class="mr-1"
              > fa fa-download </v-icon>
              <span class="white--text">Obtain file</span>
            </a>
          </v-btn>
        </v-card-title>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapState } from "vuex";

import GraphClient from "@/lib/GraphClient/GraphClient";
import getCuratorSummaryStatistics from "@/lib/GraphClient/queries/curators/getCuratorSummaryStatistics.json"
const client = new GraphClient();

export default {
  name: "CuratorSummaryStatistics",
  data: () => {
    return {
      downloadCuratorContent: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
  },

  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching records which needs to be reviewed
    let data = await client.executeQuery(getCuratorSummaryStatistics);
    await this.obtainFileRecordsCuratorSummary(data);
    this.loading = false;
  },
  methods: {

    /**
     * Method to download file having records having curator
     * summary statistics
     */
    async obtainFileRecordsCuratorSummary(data) {
      let curatorSummary = data.curatorSummaryStatistics || [];
      this.downloadCuratorContent =
          "data:text/json;charset=utf-8," +
          encodeURIComponent(curatorSummary.join("\n"));
    },
  },
};
</script>
