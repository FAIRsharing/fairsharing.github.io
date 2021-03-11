<template>
  <div v-if="error">
    <NotFound />
  </div>
  <div v-else>
    This will be the page for organisation: {{ $route.params.id }}.<br/>
    It will display this organisation:<br/>
    <pre>
      {{ organisation }}
    </pre>
  </div>
</template>

<script>
import GraphClient from "@/components/GraphClient/GraphClient.js"
import NotFound from "@/views/Errors/404"
import getOrganisationQuery from "@/components/GraphClient/queries/Organisations/getOrganisation.json"

let graphClient = new GraphClient();

export default {
  name: "Organisation",
  components: { NotFound },
  data: () => {
    return {
      error: true,
      organisation: {}
    }
  },
  async created() {
    getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
    let org = await graphClient.executeQuery(getOrganisationQuery);
    if (org.organisation != null) {
      this.organisation = JSON.parse(JSON.stringify(org.organisation));
      this.error = false;
    }
  }
}
</script>

<style scoped>

</style>