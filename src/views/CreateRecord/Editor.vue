<template>
  <v-container
    id="recordEditor"
    fluid
  >
    <!-- TODO: Loop through the buttons -->
    <!-- popup to confirm exit from editing -->
    <v-row>
      <v-col
        v-for="(panelData) in confirmPanels"
        :key="panelData.name"
      >
        <v-dialog
          v-model="panelData.show"
          max-width="600px"
        >
          <v-card>
            <v-card-title class="headline">
              {{ panelData.name }}
            </v-card-title>
            <v-card-text>{{ panelData.description }}</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                @click="panelData.method()"
              >
                Yes.
              </v-btn>
              <v-btn
                color="green darken-1"
                text
                @click="panelData.show = false"
              >
                No, keep editing.
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

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
            v-for="(panelData) in confirmPanels"
            :id="panelData.name + '_button'"
            :key="panelData.name"
            class="default ml-2"
            @click="panelData.show = true"
          >
            {{ panelData.name }}
          </v-btn>
        </v-toolbar>
        <v-tabs dark>
          <v-tab
            v-for="tab in tabs"
            :key="'tab_' + tab.name"
            :disabled="tab.disabled"
          >
            {{ tab.name }}
            <span
              v-if="tab.target && getChanges[tab.target] > 0"
              class="orange--text ml-2 font-weight-bold"
            > ({{ getChanges[tab.target] }})</span>
          </v-tab>

          <!-- EDIT GENERAL INFO -->
          <v-tab-item class="px-10 py-3">
            <edit-general-info />
          </v-tab-item>

          <!-- EDIT LICENSES -->
          <v-tab-item class="px-10 py-3">
            <edit-licences />
          </v-tab-item>

          <!-- EDIT PUBLICATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-publications />
          </v-tab-item>

          <!-- EDIT ORGANIZATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-organisations />
          </v-tab-item>

          <!-- EDIT RELATIONS -->
          <v-tab-item class="px-10 py-3">
            <edit-relationships />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapState, mapGetters } from "vuex"
  import EditGeneralInfo from "@/components/Editor/GeneralInformation/GeneralInformation.vue";
  import EditRelationships from "@/components/Editor/EditRelationships";
  import EditLicences from "@/components/Editor/EditLicences";
  import EditOrganisations from "@/components/Editor/Organisations/EditOrganisations";
  import EditPublications from "@/components/Editor/EditPublications";
  import Unauthorized from "@/views/Errors/403"
  import RESTClient from "@/components/Client/RESTClient.js"

  const client = new RESTClient();

  export default {
    name: "Editor",
    components: {
      EditPublications,
      EditOrganisations,
      EditLicences,
      EditRelationships,
      EditGeneralInfo,
      Unauthorized
    },
    data(){
      let _module = this;
      return {
        error: false,
        hasLoaded: false,
        dataChanged: false,
        confirmPanels: [
          {
            name: "Reload data",
            description: "This will reload your record from the database, discarding any unsaved changes.\n" +
                    "Are you sure you'd like to do this?",
            method: function() {
              this.show = false;
              return _module.confirmReloadData()
            },
            show: false
          },
          {
            name: "Exit editing",
            description: "This will return to the record page without saving. Are you sure you'd like to do this?",
            method: function() { return _module.confirmReturnToRecord() },
            show: false
          }
        ],
        tabs: [
          {
            name: "Edit General Information",
            disabled: false,
            target: "generalInformation"
          },
          {
            name: "Edit Data Access",
            disabled: false
          },
          {
            name: "Edit Publications",
            disabled: false
          },
          {
            name: "Edit Organisations & Grants",
            disabled: false
          },
          {
            name: "Edit Relations to other records",
            disabled: true
          }
        ]
      }
    },
    computed: {
      ...mapState('record', ['currentRecord']),
      ...mapGetters('record', ['getChanges']),
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
        if (id.includes('FAIRsharing.')) id = "10.25504/" + id;
        await _module.fetchRecord(id);
        let canEdit = await client.canEdit(_module.currentRecord['fairsharingRecord'].id, userToken);
        if (canEdit.error) _module.error = true;
        _module.hasLoaded = true;
      },
      confirmReturnToRecord() {
        const _module = this;
        let recordID = _module.currentRecord['fairsharingRecord'].id;
        _module.exitPageCheck = true;
        _module.$router.push({ path: `/${recordID}` });
      },
      async confirmReloadData() {
        const _module = this;
        let recordID = _module.currentRecord['fairsharingRecord'].id;
        await _module.fetchRecord(recordID);
      }
    },
  }
</script>

<style>
</style>
