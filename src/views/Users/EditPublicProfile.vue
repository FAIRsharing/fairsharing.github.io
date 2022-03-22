<template>
  <v-container
    class="mb-10"
    fluid
  >
    <v-alert
      v-if="!currentPublicUser.username && !pageLoad"
      type="error"
    >
      No user found with id {{ $route.params.id }}.
    </v-alert>

    <v-alert
      v-if="messages().getPublicUser.message && !pageLoad"
      class="white--text"
      type="error"
    >
      {{ messages().getPublicUser.message }}
    </v-alert>

    <v-row
      class="justify-center"
    >
      <v-col
        cols="12"
        sm="12"
        md="8"
        lg="10"
        xl="8"
      >
        <!--   Error Handling for update user action     -->
        <div v-if="messages().updateProfile.message">
          <v-alert
            v-if="messages().updateProfile.error"
            class="white--text"
            type="error"
          >
            {{ messages().updateProfile.error }}
          </v-alert>
          <v-alert
            v-else
            type="success"
          >
            {{ messages().updateProfile.message }}
          </v-alert>
        </div>

        <!--   Error Handling for delete user action     -->
        <div v-if="messages().deletePublicUser.message">
          <v-alert
            v-if="messages().deletePublicUser.error"
            class="white--text"
            type="error"
          >
            {{ messages().deletePublicUser.error }}
          </v-alert>
          <v-alert
            v-else
            type="success"
          >
            {{ messages().deletePublicUser.message }}
          </v-alert>
        </div>


        <v-form
          v-if="currentPublicUser.username"
          v-model="valid"
          @submit.prevent="valid ? updatePublicProfile() : valid=false"
        >
          <v-card-title class="primary white--text">
            <h2> Edit Public profile of User ID: {{ $route.params.id }} </h2>
          </v-card-title>
          <v-container
            fluid
            class="text-center elevation-3 pa-5"
          >
            <v-row>
              <v-col
                v-for="(field, fieldKey) in fields"
                :id="'edit_' + field.name"
                :key="field.name+'_' + fieldKey"
                cols="12"
              >
                <div v-if="field.type === 'switch'">
                  <v-switch
                    v-model="formData[field.name]"
                    :label="formData[field.name]?'Switch off to deactivate user account':field.label"
                  />
                </div>
                <div v-if="field.type === 'select'">
                  <v-select
                    v-model="formData[field.name]"
                    outlined
                    :label="field.label"
                    :items="data[field.data]"
                    :rules="field.rules"
                    item-text="name"
                  />
                </div>
                <div v-if="field.type === 'input'">
                  <v-text-field
                    v-model="formData[field.name]"
                    :label="field.label"
                    outlined
                    :type="field.type"
                    :disabled="isDisabled(field.name)"
                    :rules="field.rules"
                    class="pa-0"
                  />
                </div>
                <div v-if="field.type === 'checkbox'">
                  <v-checkbox
                    v-model="formData[field.name]"
                    :label="field.label"
                  />
                </div>
              </v-col>
            </v-row>
            <v-btn
              class="primary mr-5 white--text"
              type="submit"
              outlined
            >
              Update Profile
            </v-btn>
            <v-btn
              color="error"
              text
              outlined
              @click.prevent="dialog=true"
            >
              Delete Account!
            </v-btn>
          </v-container>
        </v-form>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h6">
          Are you sure you want to delete the user account?
        </v-card-title>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="gray darken-1"
            text
            @click="dialog = false;"
          >
            No
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="dialog = false;deleteAccount()"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card
      v-if="currentPublicUser.username"
      height="100%"
      class="d-flex flex-column rounded-0 mb-10"
    >
      <v-card-title class="primary white--text py-3">
        Organisations
      </v-card-title>
      <v-card-text
        class="pa-0"
        style="flex-grow: 1"
      >
        <EditOrganisations />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { isEmail, isRequired, isUrl } from "@/utils/rules.js"
import {mapActions, mapMutations, mapState} from "vuex";
import RESTClient from "@/lib/Client/RESTClient";
import EditOrganisations from "@/components/Users/Profiles/Private/EditOrganisations";

const restClient = new RESTClient();

export default {
  name: "EditPublicProfile",
  components: {EditOrganisations},
  data: () => {
    return {
      valid: false,
      loading: false,
      pageLoad: true,
      dialog: false,
      data: {
        profileTypes: [],
        userRoles: []
      },
      fields: [
        {
          name: "username",
          label: "Username",
          hint: null,
          type: "input",
        },
        {
          name: "email",
          label: "Email address",
          hint: null,
          type: "input",
          rules: [
            isEmail(),
            isRequired()
          ]
        },
        {
          name: "first_name",
          label: "First Name",
          hint: null,
          type: "input",
          rules: []
        },
        {
          name: "last_name",
          label: "Last Name",
          hint: null,
          type: "input",
          rules: []
        },
        {
          name: "homepage",
          label: "Homepage",
          hint: null,
          type: "input",
          rules: [
            isUrl()
          ]
        },
        {
          name: "twitter",
          label: "Twitter",
          hint: null,
          type: "input"
        },
        {
          name: "orcid",
          label: "Orcid ID",
          hint: null,
          type: "input"
        },
        {
          name: "profile_type",
          label: "Profile Type",
          hint: null,
          type: "select",
          rules: [
            isRequired()
          ],
          data: "profileTypes"
        },
        {
          name: "role",
          label: "Role",
          hint: null,
          type: "select",
          rules: [
            isRequired()
          ],
          data: "userRoles"
        },
        {
          name: "preferences_hide",
          label: "Hide your email address on public pages.",
          hint: null,
          type: "checkbox"
        },
        {
          name: "preferences_send",
          label: "Receive record update emails from FAIRsharing.",
          hint: null,
          type: "checkbox"
        },
        {
          name: "deactivated",
          label: "Switch on to activate user account",
          hint: null,
          type: "switch"
        }
      ],
      formData:{
        username: null,
        id: null,
        email: null,
        preferences_hide: null,
        preferences_send: null,
        first_name: null,
        last_name: null,
        homepage: null,
        profile_type: null,
        orcid: null,
        twitter: null,
        deactivated:null,
        role: null
      }
    }
  },
  computed: {
    ...mapState('users',['currentPublicUser','messages', 'user'])
  },
  async mounted() {
    await this.getPublicUserForModification(this.$route.params.id);
    this.data.profileTypes = await restClient.getProfileTypes();
    /* istanbul ignore else */
    if (this.currentPublicUser.preferences) {
      this.formData.username = this.currentPublicUser.username;
      this.formData.id = this.$route.params.id;
      this.formData.email = this.currentPublicUser.email;
      this.formData.preferences_hide = this.currentPublicUser['preferences']['hide_email'];
      this.formData.preferences_send = this.currentPublicUser['preferences']['email_updates'];
      this.formData.first_name = this.currentPublicUser.first_name;
      this.formData.last_name = this.currentPublicUser.last_name;
      this.formData.homepage = this.currentPublicUser.homepage;
      this.formData.profile_type = this.currentPublicUser.profile_type;
      this.formData.role = this.currentPublicUser.role;
      this.formData.orcid = this.currentPublicUser.orcid;
      this.formData.twitter = this.currentPublicUser.twitter;
      this.formData.deactivated = !this.currentPublicUser.deactivated;
    }
    this.pageLoad = false;
  },
  beforeDestroy() {
    this.cleanStore();
  },
  methods: {
    ...mapActions('users', ['getPublicUserForModification','updatePublicUser','deletePublicUser']),
    ...mapMutations('users', ['cleanStore']),
    async updatePublicProfile () {
      this.loading = true;
      this.data.userRoles = await restClient.getUserRoles(this.user().credentials.token);
      let data = JSON.parse(JSON.stringify(this.formData));
      data.preferences = {
        hide_email: this.formData.preferences_hide,
        email_updates: this.formData.preferences_send
      };
      data.deactivated = !data.deactivated;
      let role_id = this.data.userRoles.filter(role => this.formData.role === role.name)[0].id;
      data.role_id = role_id;
      await this.updatePublicUser(data);
      this.loading = false;
      this.$router.go();
    },
    async deleteAccount() {
      this.loading = true;
      await this.deletePublicUser(this.$route.params.id);
      this.loading = false;
      this.$router.go();
    },
    isDisabled(name) {
      const _module = this;
      /* istanbul ignore if */
      if (name === 'username') {
        return true;
      }
      else if (name === 'email' && _module.currentPublicUser.third_party) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
