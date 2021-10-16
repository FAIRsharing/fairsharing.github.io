<template>
  <div>
    <div class="inputGroup d-flex flex-row align-center pr-5 mb-5">
      <v-spacer />
      <span class="mr-5"> Row per page:</span>
      <v-select
        v-model="pagination.perPage"
        :items="[10, 20, 50, 100]"
        style="flex-grow: 0"
        class="mr-5"
      />
      <span class="mx-10"> {{ min }} - {{ min + pagination.perPage -1 }}</span>
      <div class="pager ml-5">
        <v-icon
          class="mr-10"
          :disabled="pagination.page ===1"
          @click="setPage(-1)"
        >
          fa-chevron-left
        </v-icon>
        <v-icon
          :disabled="pagination.page === totalPages"
          @click="setPage(1)"
        >
          fa-chevron-right
        </v-icon>
      </div>
    </div>
    <v-data-table
      :items="records"
      :headers="headers"
      :disable-pagination="true"
      :hide-default-footer="true"
      text-center
      class="fixedHeight d-block"
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
              <a
                class="d-flex align-center cursor-pointer"
                :href="`/#/${item.id}`"
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
              </a>
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
    selectedOntology: { required: true, type: String },
    records: { required: true, type: Array },
    pagination: { type: Object, required: true },
    totalPages: { type: Number, required: true}
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
  computed: {
    min() {
      return ((this.pagination.page - 1) * this.pagination.perPage) + 1
    },
  },
  methods: {
    setPage(offset) {
      this.pagination.page += offset
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

  .inputGroup .v-input {
    width: 70px;
  }
</style>
