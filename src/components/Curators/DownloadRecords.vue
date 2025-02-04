<template>
  <v-col cols12>
    <!-- Records without DOIs -->
    <RecordsWithoutDois />
  </v-col>
</template>

<script>
import {
  RecordsWithoutDois
} from "@/components/Curators/DownLoadRecordsComponents"

export default {
  name: "DownloadRecords",
  components: {
    RecordsWithoutDois
  },
};
</script>
