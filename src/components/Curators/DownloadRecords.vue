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
    <!-- Record Edit By Month -->
    <RecordEditsByMonth />
  </v-col>
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
