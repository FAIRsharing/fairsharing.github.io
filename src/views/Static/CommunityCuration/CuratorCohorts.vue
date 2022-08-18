<template>
  <main class="pa-15 mb-10">
    <div v-if="error">
      <NotFound />
    </div>
    <div v-else>
      <p>Curators for year {{ year }}. Under construction...</p>
      <pre>
        {{ currentCohort }}
      </pre>
    </div>
  </main>
</template>

<script>
import communityCurationCohorts from '@/data/communityCurationCohorts.json';
import NotFound from "@/views/Errors/404"

export default {
  name: "CuratorCohorts",
  components: { NotFound },
  data: () => {
    return {
      communityCurationCohorts: communityCurationCohorts,
      currentCohort: [],
      year: 0,
      error: false
    }
  },
  async mounted() {
    this.year = this.$route.params.year;
    if (this.year in communityCurationCohorts) {
      this.currentCohort = communityCurationCohorts[this.year];
    }
    else {
      this.error = true;
    }
  }
}
</script>