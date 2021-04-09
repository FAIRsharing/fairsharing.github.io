<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editContact"
    ref="editContact"
    v-model="formValid"
    @submit.prevent="addItem()"
  >
    <div>Edit Contact information:</div>
    <v-chip-group
      class="mb-5 px-4 grey lighten-3"
      column
    >
      <v-chip
        v-for="(contact, index) in contacts"
        :key="'contact_' + index"
        class="pr-3"
        :class="[!isNew(contact) ? 'white--text blue' : ' blue--text white borderBlue']"
      >
        <div>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                v-bind="attrs"
                small
                class="mr-2 white--text"
                v-on="on"
                @click="editContact(contact, index)"
              >
                fas fa-pen
              </v-icon>
            </template>
            <span> Edit contact </span>
          </v-tooltip>
          <span @click="editContact(contact, index)">
            {{ contact['contact_name'] }} ({{ contact['contact_email'] }})<span v-if="contact['contact_orcid']">: {{ contact['contact_orcid'] }}</span>
          </span>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                class="ml-3 white--text"
                v-bind="attrs"
                small
                @click="removeContact(index)"
                v-on="on"
              >
                fa-times-circle
              </v-icon>
            </template>
            <span> Remove contact </span>
          </v-tooltip>
        </div>
      </v-chip>
      <v-spacer />
      <!--ADD NEW CONTACT -->
      <v-chip
        class="green white--text pr-5 shadowChip"
        @click="createNewContact()"
      >
        <v-icon
          small
          class="mr-3 white--text"
        >
          fa-plus-circle
        </v-icon> Add a new contact point
      </v-chip>
    </v-chip-group>

    <v-expand-transition class="ma-5">
      <v-overlay
        v-if="menu.content && menu.show"
        class="py-0"
        :dark="false"
        opacity="0.8"
      >
        <v-card width="800px">
          <v-card-title class="green white--text">
            {{ menu.label }}
          </v-card-title>
          <v-card-text class="pt-4">
            <v-text-field
              v-model="menu.content['contact_name']"
              label="Contact Name"
              :rules="[rules.isRequired()]"
              outlined
            />
            <v-text-field
              v-model="menu.content['contact_email']"
              label="Contact Email"
              :rules="[rules.isRequired(), rules.isEmail()]"
              outlined
            />
            <v-text-field
              v-model="menu.content['contact_orcid']"
              label="Contact ORCID"
              :rules="[rules.isOrcid(false)]"
              placeholder="0000-0000-0000-0000"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="success"
              :disabled="!formValid"
              type="submit"
              @click="addItem()"
            >
              {{ menu.label }}
            </v-btn>
            <v-btn
              class="error"
              @click="menu.show = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </v-form>
</template>

<script>
    import { mapGetters } from "vuex"
    import { isEqual } from 'lodash'
    import { isRequired, isEmail, isOrcid } from "@/utils/rules.js"

    export default {
        name: "Contact",
        data(){
            return {
                menu: {
                    show: false,
                    label: "Create new contact point",
                    content: null,
                    index: null
                },
                rules: {
                    isRequired: function(){return isRequired()},
                    isEmail: function(){return isEmail()},
                    isOrcid: function(val){return isOrcid(val)},
                },
                formValid: false,
                submitted: false
            }
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            contacts:{
                get(){
                    return this.getSection("generalInformation").data.metadata.contacts
                },
                set(val){
                    this.$store.commit("record/setContacts", val);
                }
            },
            initialContact(){
              return this.getSection('generalInformation').initialData.metadata.contacts
            }
        },
        methods: {
            createNewContact(){
                this.submitted = false;
                this.menu.show = true;
                this.menu.label = "Create new contact point";
                this.menu.index = null;
                this.menu.content = {
                    contact_name: null,
                    contact_email: null,
                    contact_orcid: null
                }
            },
            removeContact(contactIndex){
                this.contacts.splice(contactIndex, contactIndex+1)
            },
            editContact(contact, contactIndex){
                this.submitted = false;
                this.menu.show = true;
                this.menu.label = "Apply changes to contact point";
                this.menu.index = contactIndex;
                this.menu.content = JSON.parse(JSON.stringify(contact))
            },
            addItem(){
                if (this.formValid && !this.submitted) {
                    if (this.menu.index || this.menu.index === 0){
                        this.$set(this.contacts, this.menu.index, this.menu.content)
                    }
                    else {
                        this.$set(this.contacts, this.contacts.length, this.menu.content);
                    }
                    this.menu.show = false;
                    this.submitted = true;
                }
            },
            isNew(term){
              return !this.initialContact.filter(obj => isEqual(obj, term))[0];
            }
        }
    }
</script>

<style scoped>
  #editContact .v-overlay__content {
    min-width: 700px;
  }
  #editContact .borderBlue {
    border: 1px solid #2A9AF4 !important;
    background-color: white !important;
    border-color: #2A9AF4 !important;
  }
  #editContact .v-chip.white {
    border-color: #2A9AF4 !important;
  }
  #editContact .borderBlue * {
    color: #2A9AF4 !important;
  }
</style>
