<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text v-if="incompleteRecords">
        <v-card-title
          id="text-curator-search-2"
          class="green white--text"
        >
          <b> INCOMPLETE RECORDS </b>
          <v-spacer />
          <v-text-field
            v-model="searches"
            label="Search"
            color="white"
            single-line
            hide-details
            solo
            class="searchField"
            clearable
          />
        </v-card-title>
        <v-data-table
          :loading="loading"
          :headers="headerItems"
          :items="incompleteRecords"
          :search="searches"
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
        >
          <template
            v-if="recordType"
            #item="props"
          >
            <tr>
              <td>
                <div class="d-flex align-center">
                  <v-avatar
                    v-if="props.item.type"
                    class="mr-2"
                    :height="40"
                  >
                    <Icon
                      :item="props.item.type"
                      :height="40"
                      wrapper-class=""
                    />
                  </v-avatar>
                  <a :href="'/' + props.item.id">
                    {{ props.item.recordNameID }}
                  </a>
                </div>
              </td>
              <td>
                {{ props.item.createdAt }}
              </td>
              <td>
                {{ props.item.required }}
              </td>
              <td>
                {{ props.item.recommended }}
              </td>
              <td>
                {{ props.item.optional }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapState } from "vuex";

import Icon from "@/components/Icon";
import GraphClient from "@/lib/GraphClient/GraphClient";
import getIncompleteRecords from "@/lib/GraphClient/queries/curators/getIncompleteRecords.json"
import formatDateIso from "@/utils/generalUtils";

const client = new GraphClient();

export default {
  name: "IncompleteRecords",
  components: {
    Icon,
  },
  mixins: [formatDateIso],
  props:{
    headerItems: {
      type: Array,
      default: null
    },
  },
  data: () => {
    return {
      incompleteRecords:[],
      searches: "",
      recordType: {},
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
  },

  async mounted() {
    this.loading = true;
    client.setHeader(this.user().credentials.token);
    //Fetching incomplete records
    let records = await client.executeQuery(getIncompleteRecords);
    this.prepareIncompleteRecords(records)
    this.loading = false;
  },
  methods: {

    /**
     * Method to fetch incomplete records
     * @param dataCuration
     */
    prepareIncompleteRecords(dataCuration) {
      let records = dataCuration.incompleteRecords;
      records.forEach((item) => {
        let recommended = [];
        item.incomplete.recommended.forEach(rec => {
          recommended.push(rec.field)
        });
        let required = [];
        item.incomplete.required.forEach(req => {
          required.push(req.field)
        });
        let optional = [];
        item.incomplete.optional.forEach(req => {
          optional.push(req.field)
        });
        let object = {
          recordNameID: `${item.name} (${item.id})`,
          type: item.type,
          id: item.id,
          recommended: recommended.sort().join(', '),
          required: required.sort().join(', '),
          optional: optional.sort().join(', ')
        };
        object.createdAt = this.formatDateIso(item.createdAt);
        this.incompleteRecords.push(object);
      });
    },
  },
};
</script>

<style scoped>
::v-deep .v-data-table-header tr th {
  white-space: nowrap;
}
.searchField {
  width: 100%;
  max-width: 400px
}
</style>