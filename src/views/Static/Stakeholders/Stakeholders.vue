<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ stakeholdersData.main_title }}
    </h1>

    <!--  main_subtitle  -->
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="stakeholdersData.main_subtitle"
    />

    <!--  main_title_2 -->
    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ stakeholdersData.main_title_2 }}
    </h2>

    <!--  content  -->
    <div
      v-for="(item,index) in stakeholdersData.stakeholders_data"
      :key="index"
    >
      <h3 class="text-h6 text-xl-h5 mb-2">
        {{ item.title }}
      </h3>
      <p
        :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="item.content"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </main>
</template>

<script>
import {stakeholders} from '@/data/stakeholdersData.json'
    export default {
      name: "Stakeholders",
      data: () => {
        return {
          stakeholdersData: stakeholders,
        }
      }
    }
</script>
<style>
p {
  /* make the line of paragraph to break when reaching /n in a string
   same time having breaking lines and justify texts
   */
  white-space: pre-line;
  text-align: justify;
  -moz-text-align-last: justify;
}
</style>
