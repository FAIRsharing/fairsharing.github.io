<template>
  <v-col cols12>
    <!-- Records Without DOIs -->
    <RecordsWithoutDois />
    <!-- Records Needing Review -->
    <RecordsNeedingReview />
    <!-- Curator Summary Statistics -->
    <CuratorSummaryStatistics />
    <!-- Records Created By Month -->
    <RecordsCreatedByMonth />
  </v-col>
</template>

<script>
import {
  CuratorSummaryStatistics,
  RecordsCreatedByMonth,
  RecordsNeedingReview,
  RecordsWithoutDois} from "@/components/Curators/DownLoadRecordsComponents"

export default {
  name: "DownloadRecords",
  components: {
    RecordsWithoutDois,
    RecordsNeedingReview,
    CuratorSummaryStatistics,
    RecordsCreatedByMonth
  },
};
</script>
