<template>
  <main class="pa-5 mt-5 mb-10">
    <v-expansion-panels
      v-model="panel"
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
          <!-- This html is from a safe source -->
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="lato-font-medium"
            v-html="item.content"
          />
          <!-- eslint-enable vue/no-v-html -->
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
  async mounted () {
    await this.$nextTick()
    this.panel = [...Array(this.privacyData['bullet_points'].length).keys()].map((k, i) => i)
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
