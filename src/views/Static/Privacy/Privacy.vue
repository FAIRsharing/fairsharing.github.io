<template>
  <main class="pa-5 mt-5 mb-10">
    <v-expansion-panels
      v-model="allOpen"
      multiple
      hover
      accordion
    >
      <v-expansion-panel
        v-for="(item,i) in privacyData.bullet_points"
        :key="i"
      >
        <v-expansion-panel-header>
          <h3>{{ item.title }}</h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p
            class="lato-font-medium"
            v-html="item.content"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<script>
import {privacy} from '@/data/PrivacyPolicyData.json'
export default {
  name: "Privacy",
  data: () => {
    return {
      privacyData: privacy,
      panel:[]
    }
  },
  methods:{
    allOpen () {
      const _module = this;
      return [...Array(_module.privacyData['bullet_points'].length).keys()].map((k, i) => i)
    }
  }
}
</script>

<style scoped>
p {
  white-space: pre-wrap;
  /* make the line of paragraph to break when reaching /n in a string */
  line-height: 1.6;
}
</style>
