<template>
  <v-card
    class="pa-4 mt-2 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Associated Records" />
    <section class="mt-2">
      <v-card class="mt-3">
        <v-card-title>
          Data Table
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="recordAssociations"
          :search="search"
        />
      </v-card>
    </section>
  </v-card>
</template>

<script>
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "AssociatedRecords",
        components: {
            SectionTitle
        },
        // TODO: Is the use of props the correct way to do this?
        props: {
            recordAssociations: {
                type: Array,
                default: null
            }
        },
        data: () => {
            return {
                headers: [
                    {text: 'Name', value: 'name'},
                    {text: 'Registry', value: 'registry'},
                    {text: 'Relationship', value: 'recordAssocLabel'},
                    {text: 'Subject', value: 'subject'},
                ],
                search: '',
            }
        },
    }

</script>

<style scoped>

</style>
