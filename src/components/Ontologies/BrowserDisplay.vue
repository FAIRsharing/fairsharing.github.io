<template>
  <div class="fixedHeight">
    <v-data-table
      :items="records"
      :headers="headers"
      :disable-pagination="true"
      :hide-default-footer="true"
      text-center
    >
      <template
        v-if="records.length > 0"
        #body="{items}"
      >
        <tbody>
          <tr
            v-for="(item, itemKey) in items"
            :key="`record_${itemKey}`"
          >
            <td class="cell">
              <div
                class="d-flex align-center cursor-pointer"
                @click="goTo(item.id)"
              >
                <v-avatar
                  size="30"
                  class="mr-3"
                >
                  <Icon
                    :item="item.type"
                    :height="30"
                    wrapper-class=""
                  />
                </v-avatar>
                {{ item.name }}
              </div>
            </td>
            <td class="cell">
              <div class="d-flex justify-center align-center flex-column">
                <div>{{ item.registry }} </div>
                <div>({{ cleanString(item.type) }}) </div>
              </div>
            </td>
            <td class="cell">
              <div class="d-flex justify-center align-center">
                <StatusPills :record-status="item.status" />
              </div>
            </td>
            <td class="cell">
              <div class="d-flex justify-center align-center">
                <StatusPills :recommended="item.isRecommended" />
              </div>
            </td>
          </tr>
        </tbody>
      </template>
      <template
        v-else
        #body
      >
        <tbody>
          <tr>
            <td class="cell">
              Cannot find any record with this {{ selectedOntology }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Icon from "@/components/Icon";
import StatusPills from "@/components/Users/Profiles/Private/StatusPills"
import stringUtils from "@/utils/stringUtils";

export default {
  name: "BrowserDisplay",
  components: { Icon, StatusPills },
  mixins: [stringUtils],
  props: {
    selectedOntology: {
      required: true,
      type: String
    },
    records: {
      required: true,
      type: Array
    }
  },
  data(){
    return {
      headers: [
        { text: "Record name", value: "name", align: "center" },
        { text: "Record registry and type", value: "registry", align: "center" },
        { text: "Record status", value: "status", align: "center" },
        { text: "Recommended", value: "isRecommended", align: "center"}
      ]
    }
  },
  methods: {
    goTo(id){
      this.$router.push({path: `/${id}`})
    }
  }
}
</script>

<style scoped>
  .cell {
    padding: 10px 20px !important
  }
  .fixedHeight {
    min-height: 40vh;
    max-height: 50vh;
    overflow-y: scroll;
  }
</style>
