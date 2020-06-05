<template>
  <v-container
    id="recordEditor"
    fluid
  >
    <v-row>
      <v-col>
        <v-toolbar
          flat
          color="primary"
          dark
        >
          <v-toolbar-title>Edit Record</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical dark>
          <v-tab>
            Edit General Information
          </v-tab>
          <v-tab>
            Edit Keywords
          </v-tab>

          <v-tab-item class="px-10 py-3">
            <edit-general-info />
          </v-tab-item>

          <v-tab-item class="px-10 py-3">
            <edit-keywords />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapActions } from "vuex"
    import EditGeneralInfo from "@/components/Editor/EditGeneralInfo";
    import EditKeywords from "@/components/Editor/EditKeywords";

    export default {
        name: "Editor",
        components: {EditKeywords, EditGeneralInfo},
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
