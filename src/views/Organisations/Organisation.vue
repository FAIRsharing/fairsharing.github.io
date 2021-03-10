<template>
  <span>
    This will be the page for organisation: {{ $route.params.id }}.<br/>
    It will display this organisation:<br/>
    <pre>
      {{ organisation }}
    </pre>
  </span>
</template>

<script>
import GraphClient from "@/components/GraphClient/GraphClient.js"
import getOrganisationQuery from "@/components/GraphClient/queries/Organisations/getOrganisation.json"

let graphClient = new GraphClient();

export default {
  name: "Organisation",
  data: () => {
    return {
      organisation: {}
    }
  },
  async created() {
    getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
    let org = await graphClient.executeQuery(getOrganisationQuery);
    if (org.organisation != null) {
      this.organisation = JSON.parse(JSON.stringify(org.organisation));
    }
  }
}
</script>

<style scoped>

</style>