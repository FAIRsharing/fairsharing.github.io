<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text>
        <v-card-title
          id="download-review-needed"
          class="bg-green text-white"
        >
          RECORDS NEEDING REVIEW
          <v-btn
            class="bg-info ml-5"
            :loading="loading"
          >
            <a
              v-if="downloadReviewContent"
              :href="downloadReviewContent"
              download="recordsNeedingReview.txt"
            >
              <v-icon
                color="white"
                class="mr-1"
              > fa fa-download </v-icon>
              <span class="text-white">Obtain file</span>
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
import getNeedsReview from "@/lib/GraphClient/queries/curators/getNeedsReview.json"
const client = new GraphClient();

export default {
  name: "RecordsNeedingReview",
  data: () => {
    return {
      downloadReviewContent: null,
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
    let data = await client.executeQuery(getNeedsReview);
    await this.obtainFileRecordsNeedTOBeReviewed(data);
    this.loading = false;
  },
  methods: {

    /**
     * Method to download file having records which needs to be
     * reviewed
     */
    async obtainFileRecordsNeedTOBeReviewed(data) {
      let review = data.needsReview || [];
      this.downloadReviewContent =
          "data:text/json;charset=utf-8," + encodeURIComponent(review.join("\n"));
    },
  },
};
</script>
