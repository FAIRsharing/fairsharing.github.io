<template>
  <div id="editLicences">
    <v-container fluid class="pt-3">
      <v-row>
        <b class="text-uppercase mb-2">Licences</b>
      </v-row>
      <v-row>
        <v-chip-group class="mb-5 px-4 bg-grey-lighten-3 large" column>
          <div v-if="currentLicences.length === 0" class="pt-2">
            <i class="mt-3">This record has no licence.</i>
          </div>
          <v-chip
            v-for="(licenceLink, index) in currentLicences"
            :key="'licence_' + index"
            class="pr-5"
            variant="flat"
            :class="[!isNew(licenceLink) ? 'bg-blue' : 'bg-white borderBlue']"
          >
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon
                  size="small"
                  class="mr-2 text-white"
                  v-bind="props"
                  @click="showEditItem(index)"
                >
                  fas fa-pen
                </v-icon>
              </template>
              <span> Change licence </span>
            </v-tooltip>
            <div @click="showEditItem(index)">
              {{ licenceLink.licence.name }}
              <span
                v-if="
                  licenceLink.relation && licenceLink.relation !== 'undefined'
                "
                class="ml-1 text-capitalize"
                >({{ cleanString(licenceLink.relation) }})</span
              >
            </div>
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon
                  size="small"
                  class="ml-3 text-white"
                  v-bind="props"
                  @click="removeLicenceLink(index)"
                >
                  fas fa-times-circle
                </v-icon>
              </template>
              <span> Remove licence </span>
            </v-tooltip>
          </v-chip>
          <v-spacer />
          <!--ADD NEW LICENCE -->
          <v-chip
            class="bg-green text-white pr-5 shadowChip"
            @click="showEditItem()"
          >
            <v-icon size="small" class="text-white mr-3">
              fas fa-plus-circle
            </v-icon>
            Add a new licence
          </v-chip>
        </v-chip-group>
      </v-row>
    </v-container>
    <v-dialog
      v-model="edit.show"
      class="py-0"
      opacity="0.8"
      persistent
      width="700px"
    >
      <v-container v-if="edit.template" fluid class="py-0">
        <v-row justify="center">
          <v-card
            class="flexCard text-black"
            width="100%"
            :class="{
              'bg-grey-lighten-0': showCreator,
              'bg-grey-lighten-3': !showCreator,
            }"
          >
            <v-card-title class="bg-green text-white">
              <span v-if="edit.id">Edit</span>
              <span v-else> Create new</span>
              <span class="ml-2">Licence Link</span>
            </v-card-title>
            <v-card-text class="pt-3">
              <v-form id="editLink" ref="editLink" v-model="formValid.link">
                <!-- LICENCE -->
                <v-card
                  class="d-flex flex-row bg-transparent elevation-0"
                  :disabled="!!showCreator"
                >
                  <v-autocomplete
                    v-model="edit.template.licence"
                    :items="availableLicences"
                    item-value="id"
                    item-title="name"
                    variant="outlined"
                    return-object
                    label="Select the Licence name"
                    :rules="[rules.isRequired()]"
                    chips
                    closable-chips
                    color="primary"
                    class="mt-2"
                  >
                    <template #chip="{ props, item }">
                      <v-chip
                        v-bind="props"
                        :text="item.raw.name"
                        color="blue"
                        variant="flat"
                      ></v-chip>
                    </template>
                  </v-autocomplete>
                  <v-btn
                    size="small"
                    class="bg-green text-white mt-2 ml-2"
                    icon=""
                    @click="showCreator = true"
                  >
                    <v-icon size="large"> fas fa-plus </v-icon>
                  </v-btn>
                </v-card>
                <!-- NEW LICENCE -->
                <v-form ref="newLicence" v-model="formValid.licence">
                  <v-card
                    v-if="showCreator"
                    class="elevation-0 bg-grey-lighten-3 mb-10 pb-3 px-3"
                    style="
                      border: 2px dashed grey !important;
                      border-radius: 5px;
                    "
                  >
                    <v-card-text class="pt-6">
                      <v-text-field
                        v-model="newLicence.name"
                        variant="outlined"
                        label="Licence's name"
                        :rules="[rules.isRequired()]"
                      />
                      <v-text-field
                        v-model="newLicence.url"
                        variant="outlined"
                        label="Licence's URL"
                        :rules="[rules.isRequired(), rules.isUrl()]"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        :disabled="!formValid.licence"
                        class="bg-success"
                        @click="createNewLicence()"
                      >
                        Create new licence
                      </v-btn>
                      <v-btn class="bg-error" @click="showCreator = false">
                        Cancel
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
                <!-- RELATION -->
                <v-card
                  class="d-flex flex-row bg-transparent elevation-0"
                  :disabled="!!showCreator"
                >
                  <v-autocomplete
                    v-model="edit.template.relation"
                    :items="cleanTextList"
                    variant="outlined"
                    return-object
                    label="Select the Licence relation"
                    :rules="[rules.isRequired()]"
                    auto-select-first
                    class="mt-2"
                  />
                </v-card>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="bg-success"
                :disabled="showCreator || !formValid.link"
                @click="updateLink()"
              >
                <span v-if="edit.id">Edit</span>
                <span v-else>Submit</span>
                <span class="ml-1">licence link</span>
              </v-btn>
              <v-btn class="bg-error" @click="hideEdit()"> Cancel </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
    <v-col cols="12">
      <v-switch
        v-model="fields.exhaustiveLicences"
        class="d-inline-block mr-2"
        color="green"
        label="List is exhaustive?"
      >
        <template #label>
          <span class="v-label-white">
            As described in our
            <a
              href="https://fairsharing.gitbook.io/fairsharing/record-sections-and-fields/licences-and-support-links/licences"
              target="_blank"
              >licence documentation </a
            >, you may choose to provide a complete list of all applicable
            licences, or a subset of licences that are recommended by your or
            most commonly used by your users. Please let us know if the licences
            you have provided are an exhaustive/complete list (if selected), or
            are non-exhaustive/partial list of licences (default).</span
          >
        </template>
      </v-switch>
    </v-col>
  </div>
</template>

<script>
import { capitalize, isEqual } from "lodash";
import { mapGetters, mapState } from "vuex";

import { isRequired, isUrl } from "@/utils/rules.js";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "EditLicences",
  mixins: [stringUtils],
  data() {
    return {
      edit: {
        show: false,
        id: null,
        template: null,
      },
      formValid: {
        link: false,
        licence: false,
      },
      showCreator: false,
      rules: {
        isRequired: function () {
          return isRequired();
        },
        isUrl: function () {
          return isUrl();
        },
      },
      newLicence: {
        name: null,
        url: null,
      },
    };
  },
  computed: {
    ...mapState("record", ["sections"]),
    ...mapState("editor", ["availableLicences", "licenceRelations"]),
    ...mapGetters("record", ["getSection"]),
    currentLicences() {
      return this.sections.dataAccess.data.licences;
    },
    initialLicences() {
      return this.sections.dataAccess.initialData.licences;
    },
    fields() {
      return this.getSection("dataAccess").data;
    },
    cleanTextList() {
      return this.licenceRelations.map((item) =>
        capitalize(this.cleanString(item)),
      );
    },
  },
  watch: {
    "edit.template": function () {
      this.$nextTick(() => {
        /* istanbul ignore else */
        if (this.$refs["editLink"]) {
          this.$refs["editLink"].validate();
        }
      });
    },
  },
  methods: {
    showEditItem(id) {
      this.edit = {
        show: true,
        id: id > -1 ? id : null,
        template: {
          relation: id > -1 ? this.currentLicences[id].relation : null,
          target: id > -1 ? this.currentLicences[id].id : null,
        },
      };
      if (id >= -1) {
        this.edit.template.licence = {
          name: this.currentLicences[id].licence.name,
          id: this.currentLicences[id].licence.id,
        };
      }
    },
    hideEdit() {
      this.edit = {
        show: false,
        id: null,
        template: null,
      };
      this.showCreator = false;
    },
    updateLink() {
      let id = this.edit.id;
      let newLink = JSON.parse(JSON.stringify(this.edit.template));
      if (id !== null) {
        let link = this.sections.dataAccess.data.licences[id];
        link.licence = newLink.licence;
        link.relation = newLink.relation;
      } else {
        let createLink = {
          fairsharingRecord: { id: this.$route.params["id"] },
          licence: newLink.licence,
          relation: newLink.relation,
        };
        this.sections.dataAccess.data.licences.push(createLink);
      }
      this.edit = {
        show: false,
        id: null,
        template: null,
      };
    },
    removeLicenceLink(id) {
      this.sections.dataAccess.data.licences.splice(id, 1);
    },
    createNewLicence() {
      // make sure name is unique !!!!!

      let newLicence = JSON.parse(JSON.stringify(this.newLicence));
      this.availableLicences.push(newLicence);
      this.edit.template.licence = newLicence;
      this.showCreator = false;
      this.newLicence = {
        name: null,
        url: null,
      };
    },
    isNew(item) {
      return !this.initialLicences.filter((obj) => isEqual(obj, item))[0];
    },
  },
};
</script>

<style scoped>
#editLicences .large {
  width: 100%;
}

#editLicences .v-overlay__content {
  width: 700px;
}

.menuItem {
  max-width: 580px;
}
</style>
