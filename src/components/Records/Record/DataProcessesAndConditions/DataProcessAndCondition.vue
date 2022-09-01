<template>
  <v-card
    v-if="Object.keys(getField('metadata')).includes('data_processes_and_conditions')"
    class="pa-4 mt-15 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <!--  Container  -->
    <div
      v-for="(item,key,index) in generateProcessesData()"
      :key="key+'_'+index"
      class="mt-0 d-flex flex-column"
    >
      <div
        v-for="(subItem,subIndex) in item.data"
        :key="subItem.name+'_'+subIndex"
      >
        <div
          class="content-wrapper pa-4 mt-4 d-flex flex-row justify-space-between full-width"
          :class="{'flex-column': $vuetify.breakpoint.xs}"
        >
          <!--  Name, Access Method, URL    -->
          <div class="full-width min-width-200 max-width-500">
            <!--  Name    -->
            <div
              v-if="subItem.name"
              class="d-flex flex-row align-stretch min-height-40"
            >
              <b class="width-200">Name</b>
              <div class="d-flex full-width ml-md-12 ml-13">
                <a
                  class="underline-effect word-break"
                  :href="subItem.url"
                  target="_blank"
                >
                  {{ subItem.name }}
                </a>
              </div>
            </div>

            <!--  AccessMethod   -->
            <div
              v-if="subItem.access_method"
              class="d-flex flex-row align-stretch min-height-40"
            >
              <b class="width-200">Access Method</b>
              <div class="d-flex full-width ml-md-12 ml-13">
                {{ subItem.access_method }}
              </div>
            </div>
            <!--  Example URL    -->
            <div
                v-if="subItem.example_url"
                class="d-flex flex-row align-stretch min-height-40"
            >
              <b class="width-200">Example URL</b>
              <div class="d-flex full-width ml-md-12 ml-13">
                <a
                    class="underline-effect word-break"
                    :href="subItem.example_url"
                    target="_blank"
                >
                  {{ subItem.example_url }}
                </a>
              </div>
            </div>
            <!-- Documentation URL    -->
            <div
                v-if="subItem.documentation_url"
                class="d-flex flex-row align-stretch min-height-40"
            >
              <b class="width-200">Documentation URL
              </b>
              <div class="d-flex full-width ml-md-12 ml-13">
                <a
                    class="underline-effect word-break"
                    :href="subItem.documentation_url"
                    target="_blank"
                >
                  {{ subItem.documentation_url }}
                </a>
              </div>
            </div>
          </div>
          <!--  Type    -->
          <div
            v-if="subItem.type"
            class="d-flex flex-row align-top min-height-40 justify-end"
            :class="{'flex-column': $vuetify.breakpoint.xs}"
          >
            <div
              class="d-flex flex-row full-width ml-md-12"
              :class="{'flex-column': $vuetify.breakpoint.smAndUp}"
            >
              <b
                class="width-100"
                :class="{'mr-8': $vuetify.breakpoint.xs}"
              >Read</b>

              <span
                v-if="subItem.type === 'read'"
              >
                <v-icon
                  medium
                >
                  fas fa-check
                </v-icon>
              </span><span
                v-else-if="subItem.type === 'read and write'"
              >
                <v-icon
                  medium
                >
                  fas fa-check
                </v-icon>
              </span>
            </div>
            <div
              class="d-flex flex-row full-width ml-md-12"
              :class="{'flex-column': $vuetify.breakpoint.smAndUp}"
            >
              <b :class="{'width-100 mr-8': $vuetify.breakpoint.xs}">Write</b>
              <span
                v-if="subItem.type === 'write'"
              >
                <v-icon
                  medium
                >
                  fas fa-check
                </v-icon>
              </span><span
                v-else-if="subItem.type === 'read and write'"
              >
                <v-icon
                  medium
                >
                  fas fa-check
                </v-icon>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import clearString from '@/utils/stringUtils'

export default {
  name: "DataProcessAndCondition",
  mixins: [clearString],
  props:{
    backColor:{
      default:null,
      type: String,
    }
  },
  data: () => {
    return {
      processedDataConditions: {},
      finalData:{},
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods: {
    generateProcessesData() {
      let processedDataConditions = {};
      const data_processes_and_conditions = this.getField('metadata')['data_processes_and_conditions'];
      // initializing object's key and data dynamically based on any number of types coming from API
      if (data_processes_and_conditions) {
        data_processes_and_conditions.forEach(item => {
          if (!Object.prototype.hasOwnProperty.call(this.processedDataConditions, item.type)) {
            processedDataConditions[item.type] = {
              data: [],
              icon: null
            }
          }
        });
        // assigning data and icon to the different types came from API.
        data_processes_and_conditions.forEach(item => {
          processedDataConditions[item.type].icon = item.type.replace(/\s/g, '_');
          processedDataConditions[item.type].data.push(item)
        })
      }
      return processedDataConditions
    },
  },
}
</script>

<style scoped>
.content-wrapper {
  border: 1px lightgrey solid;
}
</style>