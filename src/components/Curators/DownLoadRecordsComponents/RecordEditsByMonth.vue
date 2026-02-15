<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text>
        <v-card-title id="download-curator-summary" class="bg-green text-white">
          RECORD EDITS BY MONTH
          <v-btn :loading="loading" class="bg-info ml-5">
            <a
              v-if="downloadEditsByMonth"
              :href="downloadEditsByMonth"
              download="editsPerformedByMonth.txt"
            >
              <v-icon class="mr-1" color="white"> fas fa-download</v-icon>
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

import RestClient from "@/lib/Client/RESTClient";

const restClient = new RestClient();

export default {
  name: "RecordEditsByMonth",
  data: () => {
    return {
      downloadEditsByMonth: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
  },

  async mounted() {
    this.loading = true;
    await this.obtainFileEditByMonth();
    this.loading = false;
  },
  methods: {
    /**
     * Method to download file having record edits by month
     */
    async obtainFileEditByMonth() {
      let data = await restClient.getEditByMonth(this.user().credentials.token);
      if (data) {
        let content = JSON.stringify(data)
          .replace(/^\[(.+)\]$/, "$1")
          .replace(/","/g, '"\r\n"')
          .replace(/['"]+/g, "");
        this.downloadEditsByMonth =
          "data:text/json;charset=utf-8," + encodeURIComponent(content);
      } else {
        this.downloadEditsByMonth = "data:text/json;charset=utf-8," + "";
      }
    },
  },
};
</script>
