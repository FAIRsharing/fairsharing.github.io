<template>
  <section>
    <div class="mt-2 d-flex justify-end">
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="fa-search"
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
      <template
        v-if="recordType"
        #item="props"
      >
        <tr>
          <td>
            <a :href="'#/' + props.item.id">
              <span
                v-if="props.item.type"
                class="mr-2"
              >
                <img
                  v-if="Object.keys(recordType).includes(props.item.type)"
                  :src="'./' + recordType[props.item.type].icon"
                  class="miniIcon"
                >
              </span>
              {{ props.item.name }}
            </a>
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
  import recordTypes from "@/data/recordsRegistries.json"


  export default {
    name: "AssociatedRecordsTable",
    mixins: [stringUtils],
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
            recordType: null
        }
    },
    created() {
      this.$nextTick(function () {
        this.recordType = recordTypes;
      });
    }
  }
</script>

<style scoped lang='scss'>

table th {
    min-width: 200px;
}

.miniIcon {
  width: 25px;
  height: auto;
}

</style>
