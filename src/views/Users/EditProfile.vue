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
            v-if="user()"
            class="pt-3"
          >
            <v-form v-model="valid">
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
                          v-for="(error, errorName, index) in messages().updateProfile.message "
                          :key="'error_'+index"
                        >
                          {{ errorName }}: {{ error[0] }}
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
                    cols="12 py-0"
                  >
                    <div
                      v-if="field.type !== 'checkbox'"
                    >
                      <v-text-field
                        v-model="formData[field.name]"
                        :label="field.label"
                        outlined
                        :type="field.type"
                        :disabled="field.disabled"
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

    export default {
        name: "EditProfile",
        data: () => {
            return {
              message: null,
              error: null,
              valid: false,
              fields: [
                {
                  name: "username",
                  label: "Username",
                  hint: null,
                  type: "input",
                  disabled: true
                },
                {
                  name: "email",
                  label: "Email address",
                  hint: null,
                  type: "input"
                },
                {
                  name: "first_name",
                  label: "First Name",
                  hint: null,
                  type: "input"
                },
                {
                  name: "last_name",
                  label: "Last Name",
                  hint: null,
                  type: "input"
                },
                {
                  name: "homepage",
                  label: "Homepage",
                  hint: null,
                  type: "input"
                },
                {
                  name: "current_password",
                  label: "Current Password",
                  type: "password"
                },
                {
                  name: "hide_email",
                  label: "Hide your email address on public pages.",
                  hint: null,
                  type: "checkbox"
                },
              ],
              loading: false
            }
        },
        computed: {
          ...mapState("users", ["user", "messages"]),
          formData: function(){
              return {
                username: this.user().credentials.username,
                email: this.user().metadata.email,
                hide_email: this.user().metadata.hide_email,
                first_name: this.user().metadata.first_name,
                last_name: this.user().metadata.last_name,
                homepage: this.user().metadata.homepage
              }
          }
        },
        async created(){
            await this.getUserMeta();
        },
        methods: {
          ...mapActions('users', ['getUserMeta', "updateUser"]),
          updateProfile: async function(){
            this.loading = true;
            await this.updateUser(this.formData);
            this.loading = false;
          }
        },

    }
</script>

<style>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
