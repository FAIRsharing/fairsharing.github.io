<template>
  <v-container
    id="recordEditor"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <edit-general-info />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapActions } from "vuex"
    import EditGeneralInfo from "@/components/Editor/EditGeneralInfo";

    export default {
        name: "Editor",
        components: {EditGeneralInfo},
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
