<template>
  <v-container
    id="recordEditor"
    fluid
  >
    <v-row>
      <!--<v-col cols="12">
        <edit-general-info />
      </v-col>-->
      <v-col cols="12">
        <edit-keywords></edit-keywords>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapActions } from "vuex"
    // import EditGeneralInfo from "@/components/Editor/EditGeneralInfo";
    import EditKeywords from "../../components/Editor/EditKeywords";

    export default {
        name: "Editor",
        components: {EditKeywords},
        async mounted(){
            let id = this.$route.params.id;
            await this.fetchRecord(id)
        },
        methods: {
            ...mapActions("record", ["fetchRecord"])
        },

    }
</script>

<style scoped>

</style>
