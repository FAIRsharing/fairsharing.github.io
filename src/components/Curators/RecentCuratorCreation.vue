<template>
  <v-col cols12>
    <v-card class="mb-2">
      <v-card-text v-if="recordsCreatedCuratorsLastWeek">
        <v-card-title
          id="text-curator-search-3"
          class="green white--text"
        >
          <b> RECORDS CREATED BY CURATORS IN THE PAST WEEK </b>
          <v-spacer />
          <v-text-field
            v-model="searches"
            label="Search"
            color="white--text"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :loading="loading"
          :headers="headerItems"
          :items="recordsCreatedCuratorsLastWeek"
          :search="searches"
          :footer-props="{ 'items-per-page-options': [10, 20, 30, 40, 50] }"
        >
          <template
            v-if="recordType"
            #item="props"
          >
            <tr>
              <td>
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
              </td>
              <td>
                {{ props.item.createdAt }}
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
import getRecentCuratorCreations from "@/lib/GraphClient/queries/curators/getRecentCuratorCreations.json"
import formatDate from "@/utils/generalUtils";

const client = new GraphClient();

export default {
  name: "RecentCuratorCreation",
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
      recordsCreatedCuratorsLastWeek:[],
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
    let recentCuratorCreations = await client.executeQuery(getRecentCuratorCreations);
    this.prepareRecordsCuratorCreationsLastWeek(recentCuratorCreations)
    this.loading = false;
  },
  methods: {

    /**
     * Method to fetch recent curator creation records
     * @param dataCuration
     */
    prepareRecordsCuratorCreationsLastWeek(dataCuration) {
      let records = dataCuration.recentCuratorCreations;
      records.forEach((item) => {
        let object = {
          recordNameID: `${item.name} (${item.id})`,
          type: item.type,
          id: item.id,
        };
        object.createdAt = this.formatDate(item.createdAt);
        if (item.creator) {
          object.creator = item.creator.username;
          object.idCreator = item.creator.id;
        } else {
          object.creator = "unknown";
        }
        this.recordsCreatedCuratorsLastWeek.push(object);
      });
    },
  },
};
</script>
