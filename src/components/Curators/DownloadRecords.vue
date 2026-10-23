<template>
  <v-row>
    <v-col cols="12">
      <!-- Records Without DOIs -->
      <RecordsWithoutDois />
      <!-- Records Needing Review -->
      <RecordsNeedingReview />
      <!-- Curator Summary Statistics -->
      <CuratorSummaryStatistics />
      <!-- Records Created By Month -->
      <RecordsCreatedByMonth />
      <!-- Record Edit By Month -->
      <RecordEditsByMonth />
    </v-col>
  </v-row>
</template>

<script>
import {
  CuratorSummaryStatistics,
  RecordEditsByMonth,
  RecordsCreatedByMonth,
  RecordsNeedingReview,
  RecordsWithoutDois,
} from "@/components/Curators/DownLoadRecordsComponents";

export default {
  name: "DownloadRecords",
  components: {
    RecordsWithoutDois,
    RecordsNeedingReview,
    CuratorSummaryStatistics,
    RecordsCreatedByMonth,
    RecordEditsByMonth,
  },
};
</script>
