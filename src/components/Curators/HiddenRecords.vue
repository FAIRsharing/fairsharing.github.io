<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text v-if="hiddenRecords">
        <v-card-title
          id="text-curator-search-2"
          class="green white--text"
        >
          <b> HIDDEN RECORDS </b>
          <v-spacer />
          <v-text-field
            v-model="searches"
            label="Search"
            color="white"
            single-line
            hide-details
            solo
            class="searchField"
          />
        </v-card-title>
        <v-data-table
          :loading="loading"
          :headers="headerItems"
          :items="hiddenRecords"
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
                {{ props.item.curator }}
              </td>
              <td>
                <div v-if="props.item.creator === 'unknown'">
                  {{ props.item.creator }}
                </div>
                <div v-else>
                  <a :href="'/users/' + props.item.idCreator">
                    {{ props.item.creator }}
                  </a>
                </div>
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
import getHiddenRecords from "@/lib/GraphClient/queries/curators/getHiddenRecords.json"
import formatDate from "@/utils/generalUtils";

const client = new GraphClient();

export default {
  name: "HiddenRecords",
  components: {
    Icon,
  },
  mixins: [formatDate],
  props:{
    headerItems: {
      type: Array,
      default: null
    },
  },
  data: () => {
    return {
      hiddenRecords:[],
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
    //Fetching hidden records
    let hiddenRecords = await client.executeQuery(getHiddenRecords);
    this.prepareHiddenRecords(hiddenRecords)
    this.loading = false;
  },
  methods: {

    /**
     * Method to fetch hidden records
     * @param dataCuration
     */
    prepareHiddenRecords(dataCuration) {
      let records = dataCuration.hiddenRecords;
      records.forEach((item) => {
        let object = {
          recordNameID: `${item.name} (${item.id})`,
          type: item.type,
          id: item.id,
        };
        object.createdAt = this.formatDate(item.createdAt);
        if (item.curator) {
          object.curator = item.curator.username;
        } else {
          object.curator = "none";
        }
        if (item.creator) {
          object.creator = item.creator.username;
          object.idCreator = item.creator.id;
        } else {
          object.creator = "unknown";
        }
        this.hiddenRecords.push(object);
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