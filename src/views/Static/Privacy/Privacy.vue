<template>
  <main class="pa-5 mt-5 mb-10">
    <v-expansion-panels v-model="panel" multiple variant="accordion">
      <v-expansion-panel
        v-for="(item, i) in privacyData.bullet_points"
        :key="i"
      >
        <v-expansion-panel-title>
          <h3>{{ item.title }}</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- This html is from a safe source -->

          <p v-safe-html="item.content" class="lato-font-medium" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<script>
import privacyPolicyData from "@/data/PrivacyPolicyData.json";

export default {
  name: "Privacy",
  data: () => {
    return {
      privacyData: privacyPolicyData.privacy,
      panel: [],
    };
  },
  async mounted() {
    await this.$nextTick();
    this.panel = [
      ...Array(this.privacyData["bullet_points"].length).keys(),
    ].map((k, i) => i);
  },
};
</script>
<style scoped>
p {
  white-space: break-spaces;
}
</style>
