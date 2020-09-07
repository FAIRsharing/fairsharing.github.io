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
    >
    <template v-slot:item="props">
      <tr>
        <td>
          <a :href="'#/' + props.item.id"> {{ props.item.name }}</a>
        </td>
        <td>
          {{ props.item.registry }} <span v-if="props.item.type">({{ cleanString(props.item.type) }})</span>
        </td>
        <td>
          {{ props.item.recordAssocLabel }}
        </td>
        <td>
          {{ props.item.subject }}
        </td>
      </tr>
    </template>
    </v-data-table>
  </section>
</template>

<script>
  import stringUtils from '@/utils/stringUtils';

  export default {
    name: "AssociatedRecordsTable",
    props: {
        recordAssociations: {
            type: Array,
            default: null
        }
    },
    mixins: [stringUtils],
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

<style lang='scss'>

table th {
    min-width: 200px;
}

</style>
