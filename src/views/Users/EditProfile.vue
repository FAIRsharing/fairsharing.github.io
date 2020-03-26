<template>
  <div class="container-fluid">
    <v-card class="my-10">
      <v-card-title>
        <h2> Edit your profile</h2>
      </v-card-title>

      <v-card-text
        v-if="user()"
        class="body-1"
      >
        <v-form v-model="valid">
          <v-container>
            <!-- message -->
            <v-row class="mb-5" v-if="messages().updateProfile.message">
              <v-col cols="12">
                <div
                  :class="{'alert-danger': messages().updateProfile.error, 'alert-success': !messages().updateProfile.error}"
                  class="alert"
                >
                  {{ messages().updateProfile.message }}
                </div>
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
  </div>
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
              ]
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
            await this.updateUser(this.formData);
          }
        },

    }
</script>

<style>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
