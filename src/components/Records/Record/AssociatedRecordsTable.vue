<template>
  <section>
    <div class="mt-2 d-flex justify-end">
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="flex-shrink-1"
        label="Search"
        single-line
        hide-details
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="recordAssociations"
      :search="search"
    />
  </section>
</template>

<script>
  export default {
    name: "AssociatedRecordsTable",
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
