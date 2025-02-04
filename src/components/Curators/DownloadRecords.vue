<template>
  <v-col cols12>
    <!-- Records Without DOIs -->
    <RecordsWithoutDois />
    <!-- Records Needing Review -->
    <RecordsNeedingReview />
    <!-- Curator Summary Statistics -->
    <CuratorSummaryStatistics />
  </v-col>
</template>

<script>
import {
  CuratorSummaryStatistics,
  RecordsNeedingReview,
  RecordsWithoutDois} from "@/components/Curators/DownLoadRecordsComponents"

export default {
  name: "DownloadRecords",
  components: {
    RecordsWithoutDois,
    RecordsNeedingReview,
    CuratorSummaryStatistics
  },
};
</script>
