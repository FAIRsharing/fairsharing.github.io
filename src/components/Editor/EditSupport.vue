<template>
  <v-card id="editSupport">
    <v-card-title class="grey lighten-4 blue--text">
      <v-btn
        class="blue mr-4"
        fab
        x-small
      >
        <v-icon
          class="white--text"
          small
        >
          fa fa-info
        </v-icon>
      </v-btn>
      <b> EDIT SUPPORT INFORMATION </b>
    </v-card-title>
    <v-card-text v-if="error">
      <v-alert type="error">
        {{ error.data }}
      </v-alert>
    </v-card-text>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col class="col-12 pt-0">
            <v-btn
              class="primary"
              style="display:inline-block"
              fab
              x-small
              dark
              @click="addContact()"
            >
              <v-icon>fa-plus</v-icon>
            </v-btn>
            <div
              class="ml-3"
              style="display:inline-block"
            >
              ADD A NEW CONTACT
            </div>
            <v-divider />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            v-for="(contact, contactIndex) in contacts"
            :key="'contact_' + contactIndex"
            class="col-3"
            :class="{'leftBorder': contactIndex > 0}"
          >
            <v-card>
              <v-card-text>
                <v-text-field
                  v-model="contact['contact_name']"
                  label="Contact Name"
                  outlined
                />
                <v-text-field
                  v-model="contact['contact_email']"
                  label="Contact Email"
                  outlined
                />
                <v-text-field
                  v-model="contact['contact_orcid']"
                  label="Contact ORCID"
                  outlined
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  style="display:inline-block"
                  fab
                  x-small
                  dark
                  class="red"
                  @click="removeContact(contact)"
                >
                  <v-icon> fa-minus </v-icon>
                </v-btn>
                <div
                  class="ml-3 pt-1"
                  style="display:inline-block"
                >
                  REMOVE CONTACT
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        @click="editRecord()"
      >
        Submit new contact(s)
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import { mapState, mapActions } from "vuex"
    import routerUtils from "@/utils/routerUtils";

    export default {
        name: "EditSupport",
        mixins: [routerUtils],
      data(){
          return {
            contacts: [],
            error: false
          }
        },
        computed: {
            ...mapState("record", ["currentRecord", "recordUpdate"]),
            ...mapState("users", ["user"])
        },
        mounted(){
          this.$nextTick(async function () {
            this.contacts = await this.currentRecord['fairsharingRecord']['metadata']['contacts'];
          })
        },
        methods: {
            ...mapActions("record", ["updateRecord"]),
            addContact: function(){
                this.contacts.push({
                    contact_name: "",
                    contact_email: "",
                    contact_orcid: ""
                });
            },
            removeContact: function(contact){
              this.contacts = this.contacts.filter(obj =>
              obj.contact_name !== contact.contact_name || obj.contact_email !== contact.contact_email || obj.contact_orcid !== contact.contact_orcid)
            },
            editRecord: async function(){
                let record = {
                    id: this.$route.params.id,
                    token: this.user().credentials.token,
                    record: {
                        metadata: this.currentRecord['fairsharingRecord']["metadata"]
                    }
                };
                record.record.metadata.contacts = this.contacts;
                await this.updateRecord(record);
                if (!this.recordUpdate.error){
                    let ID = this.recordUpdate.id.data.id;
                    this.goto({Path: "/" + ID});
                }
                else {
                  this.error = this.recordUpdate.message;
                }
            }
        }
    }
</script>

<style scoped>

</style>
