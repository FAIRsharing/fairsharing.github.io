<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        md="8"
        lg="8"
        xl="6"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <h2>Edit your profile</h2>
          </v-card-title>

          <v-card-text
            v-if="formData"
            class="pt-3"
          >
            <v-form
              id="editProfileForm"
              ref="editProfileForm"
              v-model="valid"
            >
              <v-container>
                <!-- message -->
                <v-row
                  v-if="messages().updateProfile.message"
                  class="mb-5"
                >
                  <v-col cols="12">
                    <v-alert
                      v-if="messages().updateProfile.error"
                      type="error"
                    >
                      <ul>
                        <li
                          v-for="(errorLocal, errorName, index) in messages()
                            .updateProfile.message"
                          :key="'errorLocal_' + index"
                        >
                          {{ errorName }}: {{ errorLocal[0] }}
                        </li>
                      </ul>
                    </v-alert>
                    <v-alert
                      v-else
                      type="success"
                    >
                      {{ messages().updateProfile.message }}
                    </v-alert>
                  </v-col>
                </v-row>

                <!-- FIELDS -->

                <v-row>
                  <v-col
                    v-for="(field, fieldKey) in fields"
                    :id="'edit_' + field.name"
                    :key="'edit_field_' + fieldKey"
                    cols="12 py-0 mb-3"
                  >
                    <div v-if="field.type === 'select'">
                      <v-select
                        v-model="formData[field.name]"
                        outlined
                        :label="field.label"
                        :items="data[field.data]"
                        :rules="field.rules"
                      />
                    </div>
                    <div v-else-if="field.type === 'input'">
                      <span v-if="field.name === 'orcid'">
                        To set/change this field, log in with ORCID.
                      </span>
                      <v-text-field
                        v-model="formData[field.name]"
                        :label="field.label"
                        outlined
                        :type="field.type"
                        :disabled="isDisabled(field.name)"
                        :rules="field.rules"
                        :hint="field.hint"
                        class="pa-0"
                      />
                    </div>
                    <div v-else-if="field.type === 'checkbox'">
                      <v-checkbox
                        v-model="formData[field.name]"
                        :label="field.label"
                      />
                    </div>

                    <!-- ORGANISATIONS -->
                    <div v-else-if="field.type === 'autocomplete'">
                      <v-autocomplete
                        v-model="userOrganisations"
                        multiple
                        :items="data[field.data]"
                        :label="field.label"
                        :rules="field.rules"
                        item-text="name"
                        outlined
                        return-object
                        chips
                        deletable-chips
                        :loading="loading"
                      >
                        <template #prepend>
                          <v-tooltip top>
                            <template #activator="{ on, attrs }">
                              <v-icon
                                v-bind="attrs"
                                class="mt-2"
                                v-on="on"
                                @click="newOrganisation.show = true"
                              >
                                fa-plus-circle
                              </v-icon>
                            </template>
                            <span style="z-index: 5">Create a new organisation</span>
                          </v-tooltip>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>
                </v-row>

                <p>
                  If you would like to request an update to any non-editable
                  profile fields, please
                  <a
                    href="mailto:contact@fairsharing.org?subject=FAIRsharing user profile modification"
                  >
                    get in touch</a>.
                </p>
                <p v-if="!user().metadata.orcid">
                  <b>We strongly recommend including your ORCID ID to provide
                    extra information for the FAIRsharing community about you
                    and the resources you develop.</b>
                </p>
                <!-- ACTIONS -->
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      color="success"
                      class="mr-4"
                      :loading="loading"
                      @click="updateProfile()"
                    >
                      Update profile
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-overlay
        v-if="newOrganisation.show"
        :dark="false"
        opacity="0.8"
        style="z-index: 50"
      >
        <v-card
          class="elevation-0 lighten-3 grey mb-10 pb-3 px-3"
          style="
            border: 2px dashed grey !important;
            border-radius: 5px;
            max-width: 1200px;
          "
          width="800px"
        >
          <v-card-title class="mb-4">
            Create a new organisation
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="newOrganisation.error"
              type="error"
            >
              {{ newOrganisation.error }}
            </v-alert>
            <v-form
              id="createNewOrganisation"
              ref="createNewOrganisation"
              v-model="newOrganisation.formValid"
            >
              <v-text-field
                v-model="newOrganisation.data.name"
                label="Organisation name"
                outlined
                :rules="[rules.isRequired()]"
                class="mb-2"
              />
              <v-text-field
                v-model="newOrganisation.data.homepage"
                label="Organisation homepage"
                outlined
                :rules="[rules.isRequired(), rules.isURL()]"
                class="mb-2"
              />

              <v-autocomplete
                v-model="newOrganisation.data.organisation_type_ids"
                :items="organisationsTypes"
                multiple
                outlined
                item-text="name"
                item-value="id"
                label="Select the organisation type(s)"
                :rules="[rules.isRequired(), rules.isLongEnough(1)]"
                chips
                deletable-chips
              />
              <div>
                <v-file-input
                  v-model="newOrganisation.data.logo"
                  :rules="[rules.isImage(), imageSizeCorrect]"
                  clearable
                  :loading="logoLoading"
                  accept="image/png,image/jpeg"
                  label="Organisation Logo"
                  prepend-icon="fa-image"
                  show-size
                  counter
                />
                <div class="mt-n3 mb-3">JPEG or PNG, max. file size 3MB.</div>
              </div>

              <v-autocomplete
                v-model="newOrganisation.data.country_ids"
                label="Countries"
                :items="countries"
                item-text="name"
                item-value="name"
                multiple
                outlined
                return-object
                :rules="[
                  newOrganisation.data.country_ids &&
                    !(newOrganisation.data.country_ids.length === 0),
                ]"
              >
                <!-- autocomplete selected -->
                <template #selection="cnameData">
                  <v-chip
                    class="blue white--text removeStyle"
                    close
                    @click:close="removeCountry(cnameData.item)"
                  >
                    {{ cnameData.item.name }}
                  </v-chip>
                </template>

                <!-- autocomplete data -->
                <template #item="ccodeData">
                  <country-flag
                    v-if="ccodeData.item.code !== null"
                    :country="ccodeData.item.code"
                    size="normal"
                  />
                  <img
                    v-else
                    src="@/assets/placeholders/country.png"
                    class="ml-4 mr-3"
                  >
                  <div>{{ ccodeData.item.name }}</div>
                </template>
              </v-autocomplete>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="success"
              :disabled="!newOrganisation.formValid"
              :loading="newOrganisation.loading"
              @click="createOrganisation()"
            >
              Save new organisation
            </v-btn>
            <v-btn
              class="primary"
              @click="newOrganisation.show = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </v-container>
</template>

<script>
import CountryFlag from "vue-country-flag";
import { mapActions, mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient.js"
import {toBase64} from "@/utils/generalUtils";
import {isEmail, isImage,isLongEnough, isMastodon, isRequired, isUrl} from "@/utils/rules.js"

const restClient = new RESTClient();

export default {
  name: "EditProfile",
  components: { CountryFlag },
  data: () => {
    return {
      data: {
        profileTypes: [],
        organisations: [],
      },
      imageTooBig: false,
      allowedFileSize: 3145728,
      logoLoading: false,
      selectedProfileType: null,
      message: null,
      error: null,
      valid: false,
      fields: [
        {
          name: "username",
          label: "Username",
          hint: null,
          type: "input",
          disabled: true,
        },
        {
          name: "email",
          label: "Email address",
          hint: null,
          type: "input",
          rules: [isEmail(), isRequired()],
        },
        {
          name: "first_name",
          label: "First Name",
          hint: null,
          type: "input",
          rules: [isRequired()],
        },
        {
          name: "last_name",
          label: "Last Name",
          hint: null,
          type: "input",
          rules: [isRequired()],
        },
        {
          name: "homepage",
          label: "Homepage",
          hint: null,
          type: "input",
          rules: [isUrl()],
        },
        {
          name: "twitter",
          label: "Twitter",
          hint: null,
          type: "input",
        },
        {
          name: "mastodon",
          label: "Mastodon",
          hint: null,
          type: "input",
          rules: [
              isMastodon()
          ]
        },
        {
          name: "orcid",
          label: "Orcid ID",
          hint: "To change this field, log in with ORCID",
          type: "input",
        },
        {
          name: "profile_type",
          label: "Profile Type",
          hint: null,
          type: "select",
          rules: [isRequired()],
          data: "profileTypes",
        },
        {
          name: "organisations",
          label: "Organisations",
          hint: null,
          type: "autocomplete",
          data: "organisations",
        },
        {
          name: "preferences_hide",
          label: "Hide your email address on public pages.",
          hint: null,
          type: "checkbox",
        },
        {
          name: "preferences_send",
          label: "Receive record update emails from FAIRsharing.",
          hint: null,
          type: "checkbox",
        },
        {
          name: "preferences_orcid",
          label:
            "Allow the crediting of my FAIRsharing curation to my ORCID profile.",
          hint: null,
          type: "checkbox",
        },
      ],
      loading: false,
      userOrganisations: [],
      newOrganisation: {
        data: {
          name: null,
          homepage: null,
          organisation_type_ids: [],
          country_ids: [],
          logo: {},
          logoData: {}
        },
        formValid: true,
        show: false,
        loading: false,
        error: false,
      },
      rules: {
        isRequired: ()=> isRequired(),
        isURL: ()=> isUrl(),
        isImage: ()=> isImage(),
        isLongEnough: (val)=> isLongEnough(val),
      },
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
    ...mapState("editor", ["organisations", "organisationsTypes", "countries"]),
    formData: function () {
      if (this.user().metadata.preferences) {
        return {
          username: this.user().credentials.username,
          email: this.user().metadata.email,
          preferences_hide: this.user().metadata["preferences"]["hide_email"],
          preferences_send:
            this.user().metadata["preferences"]["email_updates"],
          preferences_orcid:
            this.user().metadata["preferences"]["push_to_orcid"],
          first_name: this.user().metadata.first_name,
          last_name: this.user().metadata.last_name,
          homepage: this.user().metadata.homepage,
          profile_type: this.user().metadata.profile_type,
          orcid: this.user().metadata.orcid,
          twitter: this.user().metadata.twitter,
          mastodon: this.user().metadata.mastodon,
        }
      }
      return null;
    },
  },
  watch: {
    'newOrganisation.data.logo': {
      async handler(logo) {
        let _module = this;
        // this.menus.newOrganisation.logoData
        if (logo === null || logo === undefined) {
          // This is to prevent a logo being deleted if a user fiddles about with the form and then
          // submits with no image uploaded.
          _module.newOrganisation.data.logoData = {}
          return;
        }
        _module.logoLoading = true;
        let convertedFile = await toBase64(logo);
        _module.newOrganisation.data.logoData = {
          filename: logo.name,
          content_type: logo.type,
          data: convertedFile
        };
        _module.logoLoading = false;
      },
      deep: true
    },
  },
  async created() {
    this.loading = true;
    await Promise.all([
      this.getUser(), // REST & GQL -- OK
      this.getUserMeta(), // REST -- OK
      this.getProfileTypes(), // REST -- OK
      this.getOrganisations(), // GQL
      this.getOrganisationsTypes(), // GQL
      this.getCountries(),
    ]);
    this.data.organisations = this.organisations;
    this.userOrganisations = this.user().records.organisations;
    this.loading = false;
  },
  methods: {
    ...mapActions("users", [
      "getUserMeta",
      "updateUser",
      "setMessage",
      "getUser",
    ]),
    ...mapActions("editor", [
      "getOrganisations",
      "getOrganisationsTypes",
      "getCountries",
    ]),
    async updateProfile() {
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.formData));
      data.preferences = {
        hide_email: this.formData.preferences_hide,
        email_updates: this.formData.preferences_send,
        push_to_orcid: this.formData.preferences_orcid,
      };
      data.organisation_ids = this.userOrganisations.map((item) => item.id);
      await this.updateUser(data);
      this.loading = false;
      if (!this.messages().updateProfile.error) {
        this.setMessage({
          field: "getUser",
          message: "Your profile was updated successfully.",
        });
        await this.$router.push({ path: "/accounts/profile" });
      }
    },
    isDisabled(name) {
      return (
        name === "username" ||
        name === "orcid" ||
        (name === "email" && this.user().metadata.third_party)
      );
    },
    async getProfileTypes() {
      this.data.profileTypes = await restClient.getProfileTypes();
    },
    async createOrganisation() {
      let organisationInput = JSON.parse(
        JSON.stringify(this.newOrganisation.data)
      );
      organisationInput.logo = organisationInput.logoData;
      delete organisationInput.logoData;

      /* istanbul ignore else */
      if (organisationInput.country_ids) {
        organisationInput.country_ids = organisationInput.country_ids.map(
          (obj) => obj.id
        );
      }
      this.newOrganisation.loading = true;
      this.newOrganisation.error = false;
      let data = await restClient.createOrganisation(
        organisationInput,
        this.user().credentials.token
      );
      if (!data.error) {
        let created = {
          id: data.data.id,
          name: data.data.attributes.name,
        };
        this.data.organisations.push(created);
        this.newOrganisation = {
          data: {
            name: null,
            homepage: null,
            organisation_type_ids: [],
            country_ids: [],
          },
          formValid: true,
          show: false,
          loading: false,
          error: false,
        };
        this.userOrganisations.push(created);
      } else this.newOrganisation.error = data.error.response.data;
      this.newOrganisation.loading = false;
    },
    removeCountry(country) {
      this.newOrganisation.data.country_ids =
        this.newOrganisation.data.country_ids.filter(
          (obj) => obj.label !== country.name && obj.id !== country.id
        );
    },
    imageSizeCorrect() {
      if (!this.newOrganisation.data.logo) {
        this.imageTooBig = false;
        return true;
      }
      if (this.newOrganisation.data.logo.size < this.allowedFileSize) {
        this.$emit('imageTooBig', false);
        this.imageTooBig = false;
        return true;
      }
      this.$emit('imageTooBig', true);
      this.imageTooBig = true;
      return false;
    }
  },
};
</script>

<style>
#edit_hide_email label {
  margin-bottom: 0 !important;
}
#edit_organisations .v-chip,
#edit_organisations .fa-times-circle {
  background: #27aae1;
  color: white;
}
.menuable__content__active.v-autocomplete__content .v-list-item__content {
  max-width: 1000px;
}
</style>
