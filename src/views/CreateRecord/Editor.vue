<template>
  <v-container
    id="recordEditor"
    fluid
  >
    <!-- popup to confirm exit from editing -->
    <v-dialog
      v-model="exitPageCheck"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          Exit editing
        </v-card-title>
        <v-card-text>This will return to the record page without saving. Are you sure you'd like to do this?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="confirmReturnToRecord()"
          >
            Yes.
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="exitPageCheck = false"
          >
            No, keep editing.
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- popup to confirm reloading data -->
    <v-dialog
      v-model="reloadDataCheck"
      max-width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          Reload data
        </v-card-title>
        <v-card-text>
          This will reload your record from the database, discarding any unsaved changes.
          Are you sure you'd like to do this?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="confirmReloadData()"
          >
            Yes.
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="reloadDataCheck = false"
          >
            No, keep editing.
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-if="hasLoaded">
      <v-col v-if="error">
        <Unauthorized />
      </v-col>

      <v-col v-else>
        <v-toolbar
          flat
          color="primary"
          dark
        >
          <v-toolbar-title> Edit Record - {{ currentRecord['fairsharingRecord'].name }} </v-toolbar-title>
          <v-spacer />
          <v-btn
            id="reloadDataButton"
            class="default ml-2"
            @click="reloadDataCheck = true"
          >
            Reload Data
          </v-btn>
          <v-btn
            id="exitEditButton"
            class="default ml-2"
            @click="exitPageCheck = true"
          >
            Stop Editing
          </v-btn>
        </v-toolbar>
        <v-tabs dark>
          <v-tab
            v-for="tab in tabs"
            :key="'tab_' + tab.name"
            :disabled="tab.disabled"
          >
            {{ tab.name }}
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

          <!-- EDIT LICENSES -->
          <v-tab-item class="px-10 py-3">
            <edit-licences />
          </v-tab-item>

          <!-- EDIT PUBLICATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-publications />
          </v-tab-item>

          <!-- EDIT RELATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-relationships />
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
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapState } from "vuex"
  import EditGeneralInfo from "@/components/Editor/EditGeneralInfo";
  import EditKeywords from "@/components/Editor/EditKeywords";
  import EditSupport from "@/components/Editor/EditSupport";
  import EditRelationships from "@/components/Editor/EditRelationships";
  import EditLicences from "@/components/Editor/EditLicences";
  import EditMaintainers from "@/components/Editor/EditMaintainers";
  import EditOrganisations from "@/components/Editor/EditOrganisations";
  import EditGrants from "@/components/Editor/EditGrants";
  import EditPublications from "@/components/Editor/EditPublications";
  import Unauthorized from "@/views/Errors/403"
  import RESTClient from "@/components/Client/RESTClient.js"

  const client = new RESTClient();

  export default {
    name: "Editor",
    components: {
      EditPublications,
      EditGrants,
      EditOrganisations,
      EditMaintainers,
      EditLicences,
      EditRelationships,
      EditSupport,
      EditKeywords,
      EditGeneralInfo,
      Unauthorized
    },
    data(){
      return {
        error: false,
        hasLoaded: false,
        dataChanged: false,
        exitPageCheck: false,
        reloadDataCheck: false,
        tabs: [
          {
            name: "Edit General Information",
            disabled: false
          },
          {
            name: "Edit Keywords",
            disabled: false
          },
          {
            name: "Edit Support Information",
            disabled: false
          },
          {
            name: "Edit Licenses",
            disabled: false
          },
          {
            name: "Edit Publications",
            disabled: false
          },
          {
            name: "Edit Relations to other records",
            disabled: true
          },
          {
            name: "Edit Maintainers",
            disabled: true
          },
          {
            name: "Edit Organisations",
            disabled: true
          },
          {
            name: "Edit Grants",
            disabled: true
          }
        ]
      }
    },
    computed: {
      ...mapState('record', ['currentRecord']),
      ...mapState('users', ['user']),
      userToken(){
        const _module = this;
        return (_module.user().credentials) ? _module.user().credentials.token : null ;
      }
    },
    watch: {
      async userToken(){
        await this.getData();
      }
    },
    async mounted() {
      this.$nextTick(async () => {
        await this.getData();
      })
    },
    methods: {
      ...mapActions("record", ["fetchRecord"]),
      async getData(){
        const _module = this;
        _module.hasLoaded = false;
        _module.error = false;

        let userToken = _module.userToken;
        let id = _module.$route.params.id;
        if (id.includes('FAIRsharing.')){
          id = "10.25504/" + id;
        }
        await _module.fetchRecord(id);
        let canEdit = await client.canEdit(_module.currentRecord['fairsharingRecord'].id, userToken);
        if (canEdit.error) {
          _module.error = true;
        }
        _module.hasLoaded = true;
      },
      confirmReturnToRecord() {
        const _module = this;
        let recordID = _module.currentRecord['fairsharingRecord'].id;
        _module.exitPageCheck = true;
        _module.$router.push({ path: `/${recordID}` });
      },
      async confirmReloadData() {
        this.reloadDataCheck = false;
        const _module = this;
        let recordID = _module.currentRecord['fairsharingRecord'].id;
        await _module.fetchRecord(recordID);
      }
    },
  }
</script>

<style scoped>

</style>
