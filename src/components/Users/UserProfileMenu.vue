<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item-avatar
    style="height:auto !important"
  >
    <v-menu
      offset-y
      transition="scale-transition"
      origin="top center 0"
    >
      <template #activator="{ on }">
        <v-btn
          dark
          icon
          v-on="on"
        >
          <v-icon>
            fa-bars
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="item.name+'_'+index"
          :disabled="item.isDisabled"
          @click="item.action()"
        >
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list-item-avatar>
</template>

<script>
    import { mapActions, mapState } from "vuex"

    export default {
      name: "UserProfileMenu",
      // eslint-disable-next-line vue/require-prop-types
      props: {
        viewingId: {
          type: Number,
          default: null
        }
      },
      data: () => {
        return {
          dialog: false
        }
      },
      computed: {
          ...mapState('users', ['user']),
            menuItems: function () {
                const _module = this;
                let vecReturn = [];
                let auxV = [
                    {
                        name: "Edit profile",
                        isDisabled: _module.disableEdit(),
                        action: function(){
                          if (_module.viewingId === Number(_module.user().id)) {
                            _module.$router.push({
                              path: "/profiles/edit"
                            })
                          }
                          else if ((_module.viewingId !== Number(_module.user().id) && _module.viewingId) && (_module.user().role === 'developer' || _module.user().role === 'super_curator')) {
                            _module.$router.push({
                              path: "/profiles/editPublicProfile/" + _module.viewingId
                            })
                          }
                          else {
                            _module.$router.push({
                              path: "/profiles/edit"
                            })
                          }
                        }
                    },
                    {
                      name: "Users List",
                      isDisabled: _module.disableUserList(),
                      action: function () {
                          _module.$router.push({
                            path: "/profiles/usersList"
                          })
                      }
                    },
                    {
                      name: "Delete Account",
                      isDisabled: _module.disableEdit(),
                      action: function() {
                        _module.$emit('showConfirmDelete', true)
                      }
                    },
                    {
                        name: "Reset Password",
                        isDisabled: false,
                        action: async function(){
                          _module.$router.push({
                            path: _module.resetPasswordPath()
                          })
                        }
                    },
                    {
                        name: "Logout",
                        isDisabled: !_module.user().isLoggedIn,
                        action: async function(){
                            await _module.logoutUser()
                        }
                    }
                ];
                if (_module.user().role === 'super_curator' ||  _module.user().role === 'developer'){
                    vecReturn.push(
                      {
                          name: "Curator Panel",
                          isDisabled: false,
                          action: function(){
                              _module.$router.push({
                                path: "/curator"
                              })
                          }
                      }
                    );
                }
                for (let i = 0; i < auxV.length; i++) {
                  vecReturn.push(auxV[i]);
                }
                return vecReturn;
            }
        },
      methods: {
        ...mapActions('users', ['logout']),
        logoutUser: async function () {
          await this.logout();
          await this.$router.push({name: "Login"})
        },
        disableEdit: function () {
          let _module = this;
          if (_module.viewingId) {
            return !(Number(_module.viewingId) === Number(_module.user().id) || (_module.user().role === 'super_curator' || _module.user().role === 'developer'));
          }
          return false;
        },
        disableUserList: function () {
          const _module = this;
          return !_module.user().is_super_curator
        },
        resetPasswordPath: function() {
          if (this.user().isLoggedIn) {
            return "/users/password/edit"
          }
          else {
            return "/accounts/forgotPassword"
          }
        }
      }
    }
</script>
