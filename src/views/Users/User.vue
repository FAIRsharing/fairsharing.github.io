<template>
  <v-container
    id="userPage"
    fluid
    class="standard"
  >
    <v-row v-if="messages()['getUser'].message">
      <v-alert
        type="success"
        class="mb-0"
      >
        {{ messages()['getUser'].message }}
      </v-alert>
    </v-row>
    <v-row>
      <v-col cols12>
        <v-card v-if="!messages()['getUser'].error">
          <v-toolbar
            flat
            color="primary"
            dark
          >
            <v-toolbar-title>My User Profile</v-toolbar-title>
            <v-spacer />
            <user-profile-menu />
          </v-toolbar>
          <v-tabs vertical>
            <!-- tabs selector -->
            <v-tab class="justify-start">
              <span> General Information </span>
            </v-tab>
            <v-tab class="justify-start">
              <span> Maintenance Requests </span>
            </v-tab>
            <v-tab class="justify-start">
              <span> Created Records </span>
            </v-tab>
            <v-tab class="justify-start">
              <span> Maintained Records </span>
            </v-tab>
            <v-tab class="justify-start">
              <span> Watched Records </span>
            </v-tab>
            <v-tab
              v-if="user().is_curator"
              class="justify-start"
            >
              <span>Records in Curation</span>
            </v-tab>

            <!-- tab content -->
            <v-tab-item class="pa-5">
              <v-card>
                <v-card-title class="primary white--text">
                  General Information
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="(field, fieldName, fieldKey) in getUserMeta"
                      :key="'userMeta' + fieldKey"
                      class="body-1"
                    >
                      <div v-if="!hideFields.includes(fieldName)">
                        <b class="blue--text">{{ fieldName | cleanString }}: </b>
                        <span v-if="field"> {{ field }} </span>
                        <span v-else> None </span>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item class="pa-5">
              <RecordCard records-type="maintenanceRequests" />
            </v-tab-item>
            <v-tab-item class="pa-5">
              <RecordCard records-type="createdRecords" />
            </v-tab-item>
            <v-tab-item class="pa-5">
              <RecordCard records-type="maintainedRecords" />
            </v-tab-item>
            <v-tab-item class="pa-5">
              <RecordCard records-type="watchedRecords" />
            </v-tab-item>
            <v-tab-item
              v-if="user().is_curator"
              class="pa-5"
            >
              <RecordCard records-type="recordsInCuration" />
            </v-tab-item>
          </v-tabs>
        </v-card>
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-overlay
        v-if="loading"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
  </v-container>
</template>

<script>
    import { mapActions, mapState } from "vuex"
    import UserProfileMenu from "@/components/Users/UserProfileMenu";
    import Loaders from "@/components/Navigation/Loaders";
    import RecordCard from "@/components/Users/Profiles/Private/RecordCard";

    /**
     * @vue-data {Object} hideFields - an array of field to NOT display
     * */

    export default {
      name: "User",
      components: {Loaders, UserProfileMenu, RecordCard},
      filters: {
          cleanString: function(str){
            return str.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
          }
        },
      data: () => {
        return {
            panel: 0,
            hideFields: ["role_id", "deactivated", "id", "created_at", "updated_at", "username"],
            loading: false
        }
      },
      computed: {
        ...mapState('users', ['user', "userResetPwdMessage", "messages"]),
        getUserMeta: function(){
          let userMeta = {};
          const _module = this;
          Object.keys(_module.user().metadata).forEach(function(field) {
            if (!_module.hideFields.includes(field)) {
              userMeta[field] = _module.user().metadata[field]
            }
          });
          return userMeta;
        }
      },
      async created(){
          this.loading = true;
          await this.getUser();
          if (this.messages()["getUser"].error){
            this.setError({field:"login", message:"You've been logged out automatically"});
            this.$router.push({path: "/accounts/login"})
          }
          this.loading = false;
      },
      methods: {
          ...mapActions('users', ['getUser', 'resetPwd', 'setError'])
      }
    }
</script>

<style>
  #userPage .text-truncate {
    max-width: 80%;
  }

  .v-window.v-item-group {
    min-height: 70vh;
  }

</style>
