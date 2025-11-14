<template>
  <v-form ref="form" v-model="formValid">
    <v-fade-transition>
      <div>
        <v-overlay
          v-model="logoLoading"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <Loaders />
        </v-overlay>
      </div>
    </v-fade-transition>

    <v-row>
      <v-col xl="4" lg="6" md="12" sm="12" xs="12" cols="12">
        <!-- Upload (Logo) -->
        <!-- current logo to go here -->
        <span> A record logo is optional (png or jpeg, max. 3MB). </span>
        <v-file-input
          v-model="recordLogo"
          :rules="[rules.isImage(), imageSizeCorrect]"
          clearable
          accept="image/png,image/jpeg"
          label="Logo"
          :loading="logoLoading"
          prepend-icon="fas fa-image"
          color="primary"
          variant="underlined"
          counter
          show-size
        />
        <v-row>
          <v-img
            v-if="currentLogo"
            :src="getAPIEndPoint() + currentRecord.fairsharingRecord.urlForLogo"
            max-height="300"
            max-width="500"
          />
          <v-btn
            v-if="currentLogo"
            class="bg-red text-white ma-1"
            size="small"
            @click="deleteLogo"
          >
            Delete logo
          </v-btn>
        </v-row>
      </v-col>

      <v-col xl="4" lg="6" md="12" sm="12" xs="12" cols="12">
        <!-- name -->
        <v-text-field
          v-model="fields.metadata.name"
          label="Record Name"
          :rules="[rules.isRequired()]"
          variant="outlined"
        >
          <template #prepend>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["name"] }}
            </v-tooltip>
          </template>
        </v-text-field>
        <!-- abbreviation -->
        <v-text-field
          v-model="fields.metadata.abbreviation"
          label="Abbreviation"
          variant="outlined"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["abbreviation"] }}
            </v-tooltip>
          </template>
        </v-text-field>
        <!-- homepage -->
        <v-text-field
          v-model="fields.metadata.homepage"
          label="Homepage"
          :rules="[rules.isRequired(), rules.isUrl()]"
          variant="outlined"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["homepage"] }}
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>

      <!-- Duplicate warning box to go here -->
      <v-col v-if="possibleDuplicates.length > 0" cols="12">
        <v-expand-transition>
          <v-card
            v-if="possibleDuplicates.length > 0"
            class="mx-auto bg-deep-orange-darken-4 mb-5"
            dark
          >
            <v-card-title>
              <span class="text-h5 font-weight-bold">
                This record may duplicate an existing FAIRsharing record!
              </span>
            </v-card-title>
            <v-card-text class="text-h6 font-weight-light">
              <p>
                Please see below for details of records we have detected that
                may be similar to yours:
              </p>
              <ul>
                <li
                  v-for="(dup, dupIndex) in possibleDuplicates"
                  :key="'dup_' + dupIndex"
                >
                  <a :href="'/' + dup.id" target="_blank">
                    {{ dup.name }}
                  </a>
                  <span v-if="dup.abbreviation">
                    ({{ dup.abbreviation }}) /
                  </span>
                  <span v-else> / </span>
                  <a :href="dup.homepage" target="_blank">
                    {{ dup.homepage }}
                  </a>
                </li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="bg-white text-black"
                :disabled="submitAnywayDisabled"
                @click="submitAnyway"
              >
                I know what I'm doing...
              </v-btn>
              <v-btn class="bg-black text-white" @click="tryAgain">
                Clear and retry
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-expand-transition>
      </v-col>

      <v-col xl="4" lg="12" md="12" sm="12" xs="12" cols="12">
        <!-- creation year -->
        <v-select
          v-model="fields.metadata.year_creation"
          label="Year of creation"
          :items="years()"
          variant="outlined"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["year"] }}
            </v-tooltip>
          </template>
        </v-select>
        <!-- countries -->
        <v-select
          v-model="fields.countries"
          label="Countries"
          :items="countries"
          item-title="name"
          item-value="name"
          multiple
          variant="outlined"
          return-object
          density="compact"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["countries"] }}
            </v-tooltip>
          </template>

          <!-- Item selected -->
          <template #chip="data">
            <v-chip
              class="bg-blue text-white removeStyle"
              closable
              @click:close="removeCountry(data.item.raw)"
            >
              {{ data.item.raw.name }}
            </v-chip>
          </template>

          <!-- select list data -->
          <template #item="{ props, item }">
            <v-list-item v-bind="props">
              <template #prepend>
                <country-flag
                  v-if="item.raw.code !== null"
                  :country="item.raw.code"
                  size="normal"
                  class="mr-1 mt-n2"
                />
                <v-img
                  v-else
                  src="@/assets/placeholders/country.png"
                  class="ml-4 mr-3"
                />
              </template>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
        <!-- registry -->
        <v-select
          ref="editRecordType"
          v-model="fields.type"
          label="Registry and type"
          :rules="[rules.isRequired()]"
          :items="recordTypes"
          item-title="name"
          item-value="name"
          variant="outlined"
          return-object
          density="compact"
          :disabled="typeChangeDisabled()"
        >
          <template #chip="data">
            <v-chip
              v-if="data.item.raw.name"
              class="bg-blue text-white text-capitalize"
            >
              {{ data.item.raw.name.replace(/_/g, " ") }}
            </v-chip>
            <v-chip v-else class="bg-blue text-white text-capitalize">
              {{ data.item.raw.replace(/_/g, " ") }}
            </v-chip>
          </template>
          <!-- select list data -->
          <template #item="{ props, item }">
            <v-tooltip location="bottom">
              <template #activator="{ props: activatorProps }">
                <v-list>
                  <v-list-subheader v-if="item.raw.header" class="full-width">
                    <v-divider
                      v-if="item.raw.header !== 'Collection'"
                      class="ma-0 opacity-100 full-width pb-7"
                    />
                    <span>{{ item.raw.header }}</span></v-list-subheader
                  >
                  <v-list-item
                    v-if="item.raw.name"
                    v-bind="props"
                    class="cursor-pointer registryList"
                  >
                    <template #prepend>
                      <Icon
                        :item="item.raw.name"
                        wrapper-class=""
                        :height="40"
                      />
                    </template>
                    <div class="py-0 pl-4">
                      <div v-bind="activatorProps">
                        <b>{{
                          item.raw.name.replace(/_/g, " ").toUpperCase()
                        }}</b>
                      </div>
                      <v-list-item-subtitle>
                        {{ item.raw.description }}
                      </v-list-item-subtitle>
                    </div>
                  </v-list-item>
                </v-list>
              </template>
              <span>{{ item.raw.description }}</span>
            </v-tooltip>
          </template>
        </v-select>
      </v-col>

      <v-col cols="12">
        <!-- status -->
        <v-autocomplete
          v-model="fields.status"
          label="Status"
          :items="status"
          item-title="name"
          item-value="name"
          variant="outlined"
        >
          <!-- autocomplete selected -->
          <template #selection="{ item }">
            {{ item.raw.name.replace(/_/g, " ") }}
          </template>

          <!-- autocomplete data -->
          <template #item="data">
            <v-tooltip location="left">
              <template #activator="{ props }">
                <v-list-item class="registryList" v-bind="props">
                  <v-list-item>
                    <status-pills :status="data.item.name" />
                  </v-list-item>
                  <v-list-item-title>
                    <b
                      >{{ data.item.name.replace(/_/g, " ").toUpperCase() }}
                    </b></v-list-item-title
                  >
                  <v-list-item-subtitle>
                    {{ data.item.description }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
              <span> {{ data.item.description }} </span>
            </v-tooltip>
          </template>
        </v-autocomplete>
      </v-col>

      <!-- does this database only implement internal identifiers -->
      <v-col cols="12">
        <p v-if="isDatabase()">
          FAIRsharing requires that each database record provide the type of
          identifier(s) used. Either add the persistent identifier schema to
          your record using the implements relationship type, or tick the box
          below that confirms that the database instead uses an internal
          identifier schema. More information is available in our
          <a
            href="https://fairsharing.gitbook.io/fairsharing/record-sections-and-fields/general-information/identifier-type"
            target="_blank"
          >
            identifier type
          </a>
          documentation.
        </p>
        <v-checkbox
          v-if="isDatabase()"
          v-model="fields.metadata['internal_identifiers']"
          class="mr-2"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fa-question-circle </v-icon>
              </template>
              {{ tooltips["internal_identifiers"] }}
            </v-tooltip>
          </template>
          <template #label>
            <span class="v-label-white"
              >This database uses internal identifiers rather than a
              community-standard identifier schema.</span
            >
          </template>
        </v-checkbox>
      </v-col>

      <!-- deprecation reasons -->
      <v-col v-if="fields.status === 'deprecated'" cols="12">
        <v-expand-transition>
          <v-textarea
            v-if="fields.status === 'deprecated'"
            v-model="fields.metadata['deprecation_reason']"
            label="Reason for deprecation"
            variant="outlined"
          >
            <template #prepend>
              <v-tooltip
                location="bottom"
                max-width="300px"
                class="text-justify"
              >
                <template #activator="{ props }">
                  <v-icon v-bind="props"> fas fa-question-circle </v-icon>
                </template>
                {{ tooltips["deprecation_reason"] }}
              </v-tooltip>
            </template>
          </v-textarea>
        </v-expand-transition>
      </v-col>

      <!-- description -->
      <v-col cols="12">
        <v-textarea
          v-model="fields.metadata.description"
          label="Description"
          :rules="[rules.isRequired(), rules.isLongEnough(40)]"
          variant="outlined"
        >
          <template #prepend>
            <v-tooltip location="bottom" max-width="300px" class="text-justify">
              <template #activator="{ props }">
                <v-icon v-bind="props"> fas fa-question-circle </v-icon>
              </template>
              {{ tooltips["description"] }}
            </v-tooltip>
          </template>
        </v-textarea>
      </v-col>

      <!-- curator notes -->
      <v-col cols="12">
        <v-expand-transition>
          <v-textarea
            v-if="user().is_curator"
            v-model="fields.curator_notes"
            label="Curator notes"
            variant="outlined"
          >
            <template #prepend>
              <v-tooltip
                location="bottom"
                max-width="300px"
                class="text-justify"
              >
                <template #activator="{ props }">
                  <v-icon v-bind="props"> fas fa-question-circle </v-icon>
                </template>
                {{ tooltips["curator_notes"] }}
              </v-tooltip>
            </template>
          </v-textarea>
        </v-expand-transition>
      </v-col>

      <!-- isHidden -->
      <v-col cols="12">
        <v-checkbox
          v-if="user().is_curator"
          v-model="fields.isHidden"
          class="d-inline-block mr-2"
          label="hide record"
        >
          <template #label>
            <span class="v-label-white">Hidden if selected.</span>
          </template>
        </v-checkbox>
      </v-col>

      <database-warning />
      <!-- create record button -->
      <v-card-actions v-if="createMode">
        <v-btn
          class="bg-primary"
          :loading="loading"
          :disabled="disableSubmit()"
          @click="createNewRecord()"
        >
          Create Record
        </v-btn>
      </v-card-actions>
    </v-row>
  </v-form>
</template>

<script>
import CountryFlag from "vue-country-flag-next";
import { mapGetters, mapState } from "vuex";

import Icon from "@/components/Icon";
import Loaders from "@/components/Navigation/Loaders.vue";
import StatusPills from "@/components/Records/Shared/StatusPills";
import RESTClient from "@/lib/Client/RESTClient";
import getAPIEndPoint, { toBase64 } from "@/utils/generalUtils";
import { isImage, isLongEnough, isRequired, isUrl } from "@/utils/rules.js";

import DatabaseWarning from "./DatabaseWarning";

let restClient = new RESTClient();

export default {
  name: "BaseFields",
  components: { DatabaseWarning, CountryFlag, StatusPills, Icon, Loaders },
  mixins: [getAPIEndPoint],
  props: {
    createMode: { type: Boolean, default: false },
    submitRecord: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      rules: {
        isRequired: function () {
          return isRequired();
        },
        isUrl: function () {
          return isUrl();
        },
        isLongEnough: function (val) {
          return isLongEnough(val);
        },
        isImage: function (val) {
          return isImage(val);
        },
      },
      submitAnywayDisabled: false,
      formValid: false,
      initialType: "",
      allowedFileSize: 1048576,
      recordLogo: null,
      logoLoading: false,
      currentLogo: null,
    };
  },
  computed: {
    ...mapGetters("record", ["getSection", "getCreatingNewRecord", "getField"]),
    ...mapState("editor", [
      "countries",
      "years",
      "tooltips",
      "recordTypes",
      "status",
      "possibleDuplicates",
    ]),
    ...mapState("users", ["user"]),
    ...mapState("record", ["currentRecord"]),
    fields() {
      return this.getSection("generalInformation").data;
    },
    imageSizeCorrect() {
      if (!this.recordLogo) {
        this.$emit("imageTooBig", false);
        return true;
      }
      if (this.recordLogo.size < this.allowedFileSize) {
        this.$emit("imageTooBig", false);
        return true;
      }
      this.$emit("imageTooBig", true);
      return false;
    },
  },
  watch: {
    recordLogo: {
      async handler(logo) {
        let _module = this;
        if (logo === null || logo === undefined) {
          // This is to prevent a logo being deleted if a user fiddles about with the form and then
          // submits with no image uploaded.
          if (_module.currentRecord.fairsharingRecord.urlForLogo) {
            _module.fields.delete("logo");
          } else {
            _module.fields.logo = {};
          }
          return;
        }
        _module.logoLoading = true;
        let convertedFile = await toBase64(logo);
        _module.fields.logo = {
          filename: logo.name,
          content_type: logo.type,
          data: convertedFile,
        };
        _module.logoLoading = false;
      },
    },
  },
  mounted() {
    this.$refs.form.validate();
    if (
      this.$router.currentRoute.path !== "/create" &&
      this.currentRecord.fairsharingRecord.urlForLogo
    ) {
      this.currentLogo = this.currentRecord.fairsharingRecord.urlForLogo;
    }
  },
  methods: {
    async deleteLogo() {
      this.logoLoading = true;
      let response;
      response = await restClient.clearLogo(
        this.currentRecord.fairsharingRecord.id,
        this.user().credentials.token,
      );
      if (!response.error) {
        this.currentLogo = null;
      }
      this.logoLoading = false;
    },
    removeCountry(country) {
      this.fields.countries = this.fields.countries.filter(
        (obj) => obj.label !== country.name && obj.id !== country.id,
      );
    },
    typeChangeDisabled() {
      let _module = this;
      if (_module.getCreatingNewRecord) {
        return false;
      }
      return !_module.user().is_curator;
    },
    submitAnyway() {
      this.submitAnywayDisabled = true;
      this.$emit("submission");
    },
    tryAgain() {
      this.fields.metadata.homepage = null;
      this.fields.metadata.name = null;
      this.fields.metadata.abbreviation = null;
      this.$emit("clearing");
    },
    disableSubmit() {
      let _module = this;
      if (!_module.formValid) {
        return true;
      }
      if (_module.possibleDuplicates.length > 0) {
        if (_module.submitRecord) {
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    createNewRecord() {
      this.$emit("createnewrecord");
    },
    isDatabase() {
      if (
        this.fields.type.name === "repository" ||
        this.fields.type.name === "knowledgebase" ||
        this.fields.type.name === "knowledgebase_and_repository" ||
        this.fields.type === "repository" ||
        this.fields.type === "knowledgebase" ||
        this.fields.type === "knowledgebase_and_repository"
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.registryList {
  max-width: 780px;
}
.removeStyle button {
  color: white !important;
  margin-left: 12px !important;
}
:deep(.v-list-item-title) {
  display: none;
}
:deep .v-list-subheader {
  &__text {
    width: 100%;
  }
}
</style>
