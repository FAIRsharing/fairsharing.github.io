<template>
  <main class="pa-15 mb-10">
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text_1"
    />
    <div
      v-for="(item,index) in communityCurationData.first_section.items"
      :key="'T'+ index"
    >
      <p :class="['mb-2 ml-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
        {{ index+1 }} . <b>{{ item.black_text }}</b> {{ item.text }}
      </p>
    </div>
    <!-- eslint-enable vue/no-v-html -->
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['tb-4 mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text_2"
    />
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text_3"
    />
    <!-- eslint-enable vue/no-v-html -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCurationData.second_section.main_title }}
    </h1>
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-6 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.second_section.text"
    />
    <v-card-actions class="justify-center">
      <v-btn
        elevation="2"
        class="white--text green"
        height="40"
        href="/community_champions/our_champions"
      >
        Meet our community champions
      </v-btn>
    </v-card-actions>
    <br>

    <!-- pie chart of broad subjects goes here -->
    <PieChart
      ref-name="championBroadSubjectAreas"
      :fields-chart="broadSubjects"
    />

    <v-expansion-panels
      v-model="panel"
      :readonly="readonly"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCurationData.third_section.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- eslint-disable vue/no-v-html -->
          <p
            :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
            v-html="communityCurationData.third_section.text"
          />
          <div
            v-for="(item,index) in communityCurationData.third_section.subsections"
            :key="index"
          >
            <a :id="item.anchor" />
            <h3 class="text-h6 text-xl-h5 mb-2">
              {{ item.title }}
            </h3>
            <!-- eslint-disable vue/no-v-html -->
            <p
              :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
              v-html="item.content"
            />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- eslint-enable vue/no-v-html -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCurationData.fourth_section.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- eslint-disable vue/no-v-html -->
          <p
            :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
            v-html="communityCurationData.fourth_section.text"
          />
          <!-- eslint-enable vue/no-v-html -->
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCodeOfConductData.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-for="(item,index) in communityCodeOfConductData.sections"
            :key="'A'+ index"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p
              :class="['mb-6 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
              v-html="item.text"
            />
          </div>
          <div
            v-for="(item,index_two) in communityCodeOfConductData.commitments"
            :key="index_two"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p :class="['mb-2 ml-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
              {{ index_two+1 }} . <b>{{ item.black_text }}</b>  {{ item.text }}
            </p>
          </div>
          <!-- eslint-enable vue/no-v-html -->

          <h3 class="text-h6 text-xl-h5 mb-2 mt-4">
            Reporting
          </h3>
          <div
            v-for="(item,index) in communityCodeOfConductData.reporting"
            :key="'B'+index"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p
              :class="['mb-3 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
              v-html="item.text"
            />
          </div>
          <!-- eslint-enable vue/no-v-html -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<script>
import { capitalize } from "lodash"

import PieChart from "@/components/Static/Statistics/PieChart.vue";
import communityCurationCohorts from '@/data/communityCurationCohorts.json';
import communityCurationData from '@/data/communityCurationData.json';
import getHostname from "@/utils/generalUtils";
import cleanString from "@/utils/stringUtils"

  export default {
    name: "CommunityCuration",
    components: { PieChart },
    mixins: [ getHostname, cleanString ],
    data: () => {
      return {
        communityCurationData: communityCurationData.communityCuration,
        communityCodeOfConductData: communityCurationData.communityCodeOfConductData,
        communityCurationCohorts: communityCurationCohorts,
        broadSubjects: {
          "title": "Champions' Broad Specialisms",
          "data": []
        },
        readonly: true,
        panel: true
      }
    },
    mounted() {
      // This creates pie chart data from the champions' file
      let _module = this;
      let tempSubjects = {}
      _module.communityCurationCohorts.data.forEach((ch) => {
        let subj = ch.subject_area;
        if (!subj) {
          return;
        }
        if (tempSubjects[subj]) {
          tempSubjects[subj] = tempSubjects[subj] + 1;
        }
        else {
          tempSubjects[subj] = 1;
        }
      })
      for (let key in tempSubjects) {
        _module.broadSubjects.data.push({
          name: capitalize(_module.cleanString(key)),
          y: tempSubjects[key],
          //url: '' // TODO: Use later to link to tabs etc.
        })
      }
    },
    methods: {
      capitalize
    }
  }
</script>
<style scoped>
p {
  /* make the line of paragraph to break when reaching /n in a string
   same time having breaking lines and justify texts
   */
  white-space: pre-line;
  text-align: justify;
  -moz-text-align-last: justify;
}
</style>
