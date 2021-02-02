<template>
  <v-container
    id="editSupportLinks"
    fluid
    class="pt-3"
  >
    <v-row>
      <b class="text-uppercase mb-2">Support links</b>
    </v-row>
    <v-row>
      <v-list class="mb-5 px-4 grey lighten-3 large">
        <v-list-item
          v-for="(supportLink, index) in currentSupportLinks"
          :key="'supportLink_' + index"
        >
          <v-chip class="blue white--text pr-5 d-block">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="mr-2 white--text"
                  v-on="on"
                >
                  fas fa-pen
                </v-icon>
              </template>
              <span> Edit support link </span>
            </v-tooltip>
            <div>
              <b>{{ supportLink.type }}</b>: {{ supportLink.url }}
            </div>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  small
                  class="ml-3 white--text"
                  v-on="on"
                >
                  fa-times-circle
                </v-icon>
              </template>
              <span> Remove support link </span>
            </v-tooltip>
          </v-chip>
        </v-list-item>
        <!--ADD NEW SUPPORT LINK -->
        <div class="d-flex borderTop">
          <v-spacer />
          <v-chip
                  class="green white--text pr-5 shadowChip"
          >
            <v-icon
                    small
                    class="white--text mr-3"
            >
              fa-plus-circle
            </v-icon> Add a support link
          </v-chip>
        </div>
      </v-list>
    </v-row>
  </v-container>
</template>

<script>
    import { mapState } from "vuex"
    import { orderBy } from "lodash"

    export default {
        name: "EditSupportLinks",
        computed: {
            ...mapState('record', ['sections']),
            ...mapState('editor', ['supportLinksTypes']),
            recordData(){
                return this.sections["dataAccess"].data
            },
            currentSupportLinks(){
              return orderBy(this.recordData.metadata['support_links'], ['type'], ['asc'])
            }
        }
    }
</script>

<style scoped>
  #editSupportLinks .large {
    width: 100%;
  }

  .borderTop {
    border-top: 1px solid #ccc;
    margin-top:5px;
    padding-top: 10px;
  }
</style>
