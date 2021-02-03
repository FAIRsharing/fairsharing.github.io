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
          <v-toolbar-title> Edit Record - {{ sections.generalInformation.initialData.metadata.name }} </v-toolbar-title>
          <v-spacer />

          <v-btn
            v-for="(panelData) in confirmPanels"
            :id="panelData.name + '_button'"
            :key="panelData.name"
            class="default"
            @click="panelData.show = true"
          >
            {{ panelData.name }}
          </v-btn>
          <v-btn
            class="ml-2 default"
            :href="'#/' + $route.params.id"
          >
            Exist editing
          </v-btn>
        </v-toolbar>
        <v-tabs
          dark
          slider-color="primary"
          slider-size="5"
        >
          <v-tab
            v-for="tab in tabs"
            :key="'tab_' + tab.name"
            :disabled="tab.disabled"
          >
            <div>
              <div>{{ tab.name }}</div>
              <div
                v-if="tab.target && getChanges[tab.target] > 0"
                class="orange--text ml-2 font-weight-bold"
              >
                ({{ getChanges[tab.target] }})
              </div>
            </div>
          </v-tab>

          <!-- EDIT GENERAL INFO -->
          <v-tab-item class="px-10 py-3">
            <edit-general-info />
          </v-tab-item>

          <!-- EDIT LICENSES -->
          <v-tab-item class="px-10 py-3">
            <edit-data-access />
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
  import EditDataAccess from "@/components/Editor/DataAccess/EditDataAccess";
  import EditOrganisations from "@/components/Editor/Organisations/Organisations";
  import EditPublications from "@/components/Editor/EditPublications";
  import Unauthorized from "@/views/Errors/403"
  import RESTClient from "@/components/Client/RESTClient.js"

  const client = new RESTClient();

  export default {
    name: "Editor",
    components: {
      EditPublications,
      EditOrganisations,
      EditDataAccess,
      EditRelationships,
      EditGeneralInfo,
      Unauthorized
    },
    beforeRouteLeave(to, from, next){
      let changes = this.getAllChanges;
      if (changes === 0) {
        next();
      }
      else {
        const answer = window.confirm(`Are you sure you want to leave this page? You have ${changes} unsaved modifications.`);
        if (answer) next();
      }
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
          }
        ],
        tabs: [
          {
            name: "General Information",
            disabled: false,
            target: "generalInformation",
            icon: "fa-info"
          },
          {
            name: "Data Access",
            disabled: false,
            target: "dataAccess"
          },
          {
            name: "Publications",
            disabled: false,
            target: "publications",
            icon: "fa-info"
          },
          {
            name: "Organisations & Grants",
            disabled: false,
            target: "organisations"
          },
          {
            name: "Relations to other records",
            disabled: true
          }
        ]
      }
    },
    computed: {
      ...mapState('record', ['currentRecord', 'sections']),
      ...mapGetters('record', ['getChanges', 'getAllChanges']),
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
        this.$store.commit("record/setEditingRecord");
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
      async confirmReloadData() {
        const _module = this;
        let recordID = _module.currentRecord['fairsharingRecord'].id;
        await _module.fetchRecord(recordID);
      }
    },
  }
</script>

<style scoped>

  .tabSquare {
      width: 140px;
      height: 140px !important;
      white-space: initial !important;
  }

</style>

<style>
  #recordEditor .expand-transition-enter-active,
  #recordEditor .expand-transition-leave-active,
  #recordEditor .delayed-transition .slide-x-transition-enter-active,
  #recordEditor .delayed-transition .slide-x-transition-leave-active
  {
    transition-duration: 0.7s !important;
  }

  #recordEditor .delayed-transition .scroll-x-transition-enter-active,
  #recordEditor .delayed-transition .scroll-x-transition-leave-active
  {
    transition-duration: 1s !important;
  }

  #recordEditor .delayed-transition .scroll-x-transition-enter-active
  {
    transition-delay: 0.1s !important;
  }

  #recordEditor .delayed-transition .scroll-x-transition-leave-active
  {
    transition-delay: 0.6s !important;
  }

  .short{
    max-width:550px;
  }

  .short span{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
