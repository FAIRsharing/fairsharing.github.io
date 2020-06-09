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
          <v-tab v-for="tab in tabs" :key="'tab_' + tab">
            {{ tab }}
          </v-tab>

          <!-- EDIT GENERAL INFO -->
          <v-tab-item class="px-10 py-3">
            <edit-general-info />
          </v-tab-item>

          <!-- EDIT KEYWORDS -->
          <v-tab-item class="px-10 py-3">
            <edit-keywords />
          </v-tab-item>

          <!-- EDIT SUPPORT -->
          <v-tab-item class="px-10 py-3">
            <edit-support />
          </v-tab-item>

          <!-- EDIT RELATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-relationships />
          </v-tab-item>

          <!-- EDIT LICENSES -->
          <v-tab-item class="px-10 py-3">
            <edit-licenses />
          </v-tab-item>

          <!-- EDIT MAINTAINERS -->
          <v-tab-item class="px-10 py-3">
            <edit-maintainers />
          </v-tab-item>

          <!-- EDIT ORGANIZATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-organisations />
          </v-tab-item>

          <!-- EDIT GRANTS -->
          <v-tab-item class="px-10 py-3">
            <edit-grants />
          </v-tab-item>

          <!-- EDIT ORGANIZATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-publications />
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
    import EditSupport from "../../components/Editor/EditSupport";
    import EditRelationships from "../../components/Editor/EditRelationships";
    import EditLicenses from "../../components/Editor/EditLicenses";
    import EditMaintainers from "../../components/Editor/EditMaintainers";
    import EditOrganisations from "../../components/Editor/EditOrganisations";
    import EditGrants from "../../components/Editor/EditGrants";
    import EditPublications from "../../components/Editor/EditPublications";

    export default {
        name: "Editor",
        components: {
          EditPublications,
          EditGrants,
          EditOrganisations,
          EditMaintainers,
          EditLicenses,
          EditRelationships,
          EditSupport,
          EditKeywords,
          EditGeneralInfo
        },
        data(){
          return {
            tabs: [
              "Edit General Information",
              "Edit Keywords",
              "Edit Support Information",
              "Edit Relations to other records",
              "Edit Licenses",
              "Edit Maintainers",
              "Edit Organisations",
              "Edit Grants",
              "Edit Publications"
            ]
          }
        },
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
