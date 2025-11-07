<template>
  <div id="editDataAccess">
    <v-card>
      <v-card-title class="bg-grey-lighten-4 text-blue">
        Edit Data Access
      </v-card-title>
      <Alerts target="dataAccess" />
      <v-card-text>
        <edit-licences />
        <v-divider />
        <edit-support-links />
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="bg-primary"
          :loading="continueLoader"
          variant="elevated"
          @click="saveRecord(false, $event.target)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :loading="exitLoader"
          class="bg-primary"
          variant="elevated"
          @click="saveRecord(true, $event.target)"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-fade-transition>
      <div>
        <v-overlay
          v-if="!initialized"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import { isEqual } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

import Loaders from "../../Navigation/Loaders";
import Alerts from "../Alerts";
import EditLicences from "./EditLicenceLinks";
import EditSupportLinks from "./EditSupportLinks";

export default {
  name: "EditDataAccess",
  components: {
    Alerts,
    Loaders,
    EditLicences,
    EditSupportLinks,
  },
  data() {
    return {
      initialized: false,
      exitLoader: false,
      continueLoader: false,
    };
  },
  computed: {
    ...mapState("record", ["sections"]),
    ...mapState("users", ["user"]),
    dataAccess() {
      return this.sections["dataAccess"].data;
    },
  },
  watch: {
    dataAccess: {
      deep: true,
      handler(val) {
        let changes = 0;
        let initialLicences = this.sections["dataAccess"].initialData.licences,
          initialSupportLinks =
            this.sections["dataAccess"].initialData["support_links"],
          licences = val.licences,
          exhaustive =
            this.sections["dataAccess"].initialData.exhaustiveLicences,
          supportLinks = val["support_links"];
        if (!isEqual(initialLicences, licences)) {
          changes += 1;
        }
        if (!isEqual(initialSupportLinks, supportLinks)) {
          changes += 1;
        }
        if (exhaustive !== this.dataAccess.exhaustiveLicences) {
          changes += 1;
        }
        this.$store.commit("record/setChanges", {
          section: "dataAccess",
          value: changes,
        });
      },
    },
  },
  mounted() {
    this.$nextTick(async function () {
      await this.getLicences();
      this.initialized = true;
    });
  },
  methods: {
    ...mapActions("editor", ["getLicences"]),
    ...mapActions("record", ["updateDataAccess"]),
    ...mapGetters("record", ["getSection"]),
    async saveRecord(redirect, item) {
      if (item.textContent.trim() === "Save and continue") {
        this.continueLoader = true;
        this.exitLoader = false;
      } else if (item.textContent.trim() === "Save and exit") {
        this.continueLoader = false;
        this.exitLoader = true;
      }
      if (!redirect) this.$scrollTo("#mainHeader");
      await this.updateDataAccess({
        id: this.$route.params.id,
        token: this.user().credentials.token,
      });
      this.continueLoader = false;
      this.exitLoader = false;
      if (redirect && !this.getSection("dataAccess").error) {
        await this.$router.push({ path: "/" + this.$route.params.id });
      }
    },
  },
};
</script>

<style>
#editDataAccess .borderBlue,
#editLicences .borderBlue:before {
  border: 1px solid #2a9af4 !important;
  background-color: white !important;
  border-color: #2a9af4 !important;
}

#editDataAccess .v-chip.white {
  border-color: #2a9af4 !important;
}
#editDataAccess .borderBlue * {
  color: #2a9af4 !important;
}
</style>
