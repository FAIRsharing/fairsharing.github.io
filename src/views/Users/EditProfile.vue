<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <h2> Edit your profile</h2>
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
                          v-for="(errorLocal, errorName, index) in messages().updateProfile.message "
                          :key="'errorLocal_'+index"
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
                    <div v-else-if="field.type !== 'checkbox'">
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
  </v-container>
</template>

<script>
    import { mapState, mapActions } from "vuex"
    import { isEmail, isRequired, isUrl } from "@/utils/rules.js"
    import RESTClient from "@/lib/Client/RESTClient.js"

    const restClient = new RESTClient();

    export default {
        name: "EditProfile",
        data: () => {
            return {
              data: {
                profileTypes: []
              },
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
              ],
              loading: false,
            }
        },
        computed: {
          ...mapState("users", ["user", "messages"]),
          formData: function(){
            if (this.user().metadata.preferences) {
              return {
                username: this.user().credentials.username,
                email: this.user().metadata.email,
                preferences_hide: this.user().metadata['preferences']['hide_email'],
                preferences_send: this.user().metadata['preferences']['email_updates'],
                first_name: this.user().metadata.first_name,
                last_name: this.user().metadata.last_name,
                homepage: this.user().metadata.homepage,
                profile_type: this.user().metadata.profile_type
              }
            }
            return null;
          }
        },
        async created(){
            await this.getUserMeta();
            this.data.profileTypes = await restClient.getProfileTypes();
        },
        methods: {
          ...mapActions('users', ['getUserMeta', "updateUser", "setMessage"]),
          updateProfile: async function(){
            this.loading = true;
            let data = JSON.parse(JSON.stringify(this.formData));
            data.preferences = {
              hide_email: this.formData.preferences_hide,
              email_updates: this.formData.preferences_send
            };
            await this.updateUser(data);
            this.loading = false;
            if (!this.messages().updateProfile.error){
              this.setMessage({field: 'getUser', message: "Your profile was updated successfully."});
              this.$router.push({path: "/accounts/profile"})
            }
          }
        },

    }
</script>

<style scoped>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
