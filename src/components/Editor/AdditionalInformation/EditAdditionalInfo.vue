<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
  >
    <v-card
      v-if="initialized"
      class="delayed-transition"
    >
      <v-card-title class="grey lighten-4 blue--text">
        Edit Additional Information
      </v-card-title>

      <Alerts target="additionalInformation" />

      <v-row
        v-for="(field, index) in allowedFields"
        :key="'selected_' + index"
      >
        <v-col
          cols="12"
          class="pa-6"
        >
          <!-- Dynamically loads components -->
          <component
            :is="componentMapping[field]"
            @update-counts="updateCounts"
          />
        </v-col>
      </v-row>

      <v-card-text />
      <v-card-actions>
        <v-btn
          class="primary"
          :disabled="false"
          :loading="loading"
          @click="saveRecord(false)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :disabled="false"
          :loading="loading"
          class="primary"
          @click="saveRecord(true)"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-fade-transition>
      <v-overlay
        v-if="!initialized"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
  </v-form>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import Alerts from "@/components/Editor/Alerts";
import AccessPoints from "@/components/Editor/AdditionalInformation/AccessPoints";
import AssociatedTools from "@/components/Editor/AdditionalInformation/AssociatedTools";
import DataProcesses from "@/components/Editor/AdditionalInformation/DataProcesses";
import Loaders from "@/components/Navigation/Loaders";
import RestClient from "@/components/Client/RESTClient.js"

let restClient = new RestClient();

export default {
  name: "EditAdditionalInfo",
  components: { Alerts, AccessPoints, AssociatedTools, DataProcesses, Loaders },
  data() {
    return {
      initialized: false,
      loading: true,
      allowedFields: [],
      componentMapping: {
        "access_points": "AccessPoints",
        "associated_tools": "AssociatedTools",
        "data_processes": "DataProcesses"
      },
      counts: {
        access_points: 0,
        associated_tools: 0,
        data_processes: 0
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    fields() {
      return this.getSection("additionalInformation").data
    }
  },
  mounted(){
    this.$nextTick(async () => {
      //this.allowedFields = await this.getFieldNames();
      // TODO: Modify this when all sections have been completed.
      this.allowedFields = [
        'access_points',
        'associated_tools',
        'data_processes'
      ];
      //console.log(JSON.stringify(this.allowedFields));
      this.initialized = true;
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("record", ["updateAdditionalInformation"]),
    async getFieldNames() {
      return restClient.extraMetadataFields(
          this.fields.type,
          this.user().credentials.token
      );
    },
    async saveRecord(redirect){
      this.openEditor = false;
      this.loading = true;
      await this.updateAdditionalInformation({
        token: this.user().credentials.token,
        id: this.$route.params.id
      });
      this.loading = false;
      if (!redirect) {
        this.$scrollTo("#mainHeader");
        this.$store.commit("record/setChanges", {
          section: "additionalInformation",
          value: 0
        })
      }
      if (redirect && !this.getSection("additionalInformation").error){
        await this.$router.push({path: '/' + this.$route.params.id})
      }
    },
    updateCounts(count) {
      /*
       * Multiple sections may be updating the counts, with different means of calculating changes,
       * so the updates to the page are all handled here.
       */
      let _module = this;
      let changes = 0;
      Object.keys(count).forEach( (key) => {
        _module.counts[key] = count[key];
      });
      Object.keys(_module.counts).forEach( (key) => {
        changes += _module.counts[key];
      });
      _module.$store.commit("record/setChanges", {
        section: "additionalInformation",
        value: changes
      });
    }
  }
}
</script>

<style>
</style>
