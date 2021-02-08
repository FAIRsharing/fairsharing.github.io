<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Associated Records" />

    <v-card-text>
      <v-tabs left>
        <v-tab>
          Table
        </v-tab>
        <v-tab disabled>
          Graph
        </v-tab>

        <v-tab-item>
          <AssociatedRecordsTable :record-associations="recordAssociations" />
        </v-tab-item>

        <v-tab-item>
          <AssociatedRecordsGraph :record-associations="recordAssociations" />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
    import SectionTitle from '@/components/Records/Record/SectionTitle';
    import AssociatedRecordsGraph from "@/components/Records/Record/AssociatedRecordsGraph"
    import AssociatedRecordsTable from "@/components/Records/Record/AssociatedRecordsTable"

    export default {
        name: "AssociatedRecords",
        components: {
            SectionTitle,
            AssociatedRecordsGraph,
            AssociatedRecordsTable
        },
        props: {
            recordAssociations: {
                type: Array,
                default: null
            }
        }
    }

</script>

<style scoped>

</style>
