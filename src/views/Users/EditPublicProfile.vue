<template>
  <v-container class="mb-10">
    <v-row
      v-if="!messages().getPublicUser.message"
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
          v-model="valid"
          @submit.prevent="valid ? updatePublicProfile() : valid=false"
        >
          <v-card-title class="primary white--text">
            <h2> Edit Public profile of User ID: {{ $route.params.id }}</h2>
          </v-card-title>
          <v-container class="text-center elevation-3 pa-5">
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
                    :label="formData[field.name]?'Switch off to activate user account':field.label"
                  />
                </div>
                <div v-if="field.type === 'select'">
                  <v-select
                    v-model="formData[field.name]"
                    outlined
                    :label="field.label"
                    :items="data[field.data]"
                    :rules="field.rules"
                  />
                </div>
                <div v-if="field.type === 'input'">
                  <v-text-field
                    v-model="formData[field.name]"
                    :label="field.label"
                    outlined
                    :type="field.type"
                    :disabled="field.disabled"
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
              @click.prevent="deleteAccount()"
            >
              Delete Account!
            </v-btn>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
    <v-alert
      v-else
      class="white--text"
      type="error"
    >
      {{ messages().getPublicUser.message }}
    </v-alert>
  </v-container>
</template>

<script>
import { isEmail, isRequired, isUrl } from "@/utils/rules.js"
import {mapActions, mapState} from "vuex";
import RESTClient from "@/lib/Client/RESTClient";

const restClient = new RESTClient();

export default {
  name: "EditPublicProfile",
  data: () => {
    return {
      message: null,
      error: null,
      valid: false,
      loading: false,
      rules: {
        isRequired: () => isRequired(),
        isEmail: () => isEmail(),
        isUrl: () => isUrl(),
      },
      data: {
        profileTypes: []
      },
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
          rules: [
            isRequired()
          ]
        },
        {
          name: "last_name",
          label: "Last Name",
          hint: null,
          type: "input",
          rules: [
            isRequired()
          ]
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
          label: "Switch on to deactivate user account",
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
        deactivated:null
      }
    }
  },
  computed: {
    ...mapState('users',['currentPublicUser','messages']),
  },
  async created() {
    await this.getPublicUserForModification(this.$route.params.id);
    this.data.profileTypes = await restClient.getProfileTypes();
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
      this.formData.orcid = this.currentPublicUser.orcid;
      this.formData.twitter = this.currentPublicUser.twitter;
      this.formData.deactivated = this.currentPublicUser.deactivated;
    }
  },
  methods: {
    ...mapActions('users', ['getPublicUserForModification','updatePublicUser','deletePublicUser']),
    async updatePublicProfile () {
      this.loading = true;
      let data = JSON.parse(JSON.stringify(this.formData));
      data.preferences = {
        hide_email: this.formData.preferences_hide,
        email_updates: this.formData.preferences_send
      };
      await this.updatePublicUser(data);
      this.loading = false;
      this.$scrollTo('body',1000,{})
    },
    async deleteAccount() {
      this.loading = true;
      await this.deletePublicUser(this.$route.params.id);
      this.loading = false;
      this.$scrollTo('body',1000,{})
    }
  }
}
</script>

<style scoped>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
