<template>
  <v-col cols12>
    <!-- Records without DOIs -->
    <v-card class="mb-2">
      <v-card-text>
        <v-card-title id="text-curator-search-1" class="bg-green text-white">
          RECORDS WITHOUT DOIS
          <v-btn class="bg-info ml-5" :loading="loading">
            <a
              v-if="downloadContent"
              :href="downloadContent"
              download="recordWithoutDOIs.txt"
            >
              <v-icon color="white" class="mr-1"> fa fa-download </v-icon>
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
  name: "RecordsWithoutDois",
  data: () => {
    return {
      downloadContent: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
  },

  async mounted() {
    this.loading = true;
    await this.obtainFileRecordsWODois();
    this.loading = false;
  },
  methods: {
    /**
     * Method to download file having records without DOI
     */
    async obtainFileRecordsWODois() {
      let data = await restClient.getRecordsWoDOIs(
        this.user().credentials.token,
      );
      if (data) {
        let content = JSON.stringify(data)
          .replace(/^\[(.+)\]$/, "$1")
          .replace(/","/g, '"\r\n"')
          .replace(/['"]+/g, "");
        this.downloadContent =
          "data:text/json;charset=utf-8," + encodeURIComponent(content);
      } else {
        this.downloadContent = "data:text/json;charset=utf-8," + "";
      }
    },
  },
};
</script>
