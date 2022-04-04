<template>
  <main class="pa-15 mb-10">
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCodeOfConductData.main_title }}
    </h1>
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
    <p :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
      <it>Removed examples of poor word choice, felt quite aggressive.</it>
    </p>
    <!-- eslint-enable vue/no-v-html -->
  </main>
</template>

<script>
import {communityCodeOfConductData} from '@/data/communityCodeOfConductData.json'
import getHostname from "@/utils/generalUtils";
    export default {
      name: "CommunityCodeOfConduct",
      mixins: [ getHostname ],
      data: () => {
        return {
          communityCodeOfConductData: communityCodeOfConductData
        }
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
