<template>
  <v-form
    id="editContact"
    ref="editContact"
    v-model="formValid"
    @submit.prevent="addItem()"
  >
    <div>Edit Contact information:</div>
    <v-chip-group class="mb-5 px-4 bg-grey-lighten-3 pt-1 pb-2" column>
      <v-chip
        v-for="(contact, index) in contacts"
        :key="'contact_' + index"
        :class="[
          !isNew(contact)
            ? 'text-white bg-blue'
            : 'text-blue bg-white borderBlue',
        ]"
        class="pr-3 my-1 mr-2 ml-0"
        variant="flat"
      >
        <div>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon
                class="mr-2 text-white"
                size="small"
                v-bind="props"
                @click="editContact(contact, index)"
              >
                fas fa-pen
              </v-icon>
            </template>
            <span> Edit contact </span>
          </v-tooltip>
          <span @click="editContact(contact, index)">
            {{ contact["contact_name"] }} ({{ contact["contact_email"] }})<span
              v-if="contact['contact_orcid']"
              >: {{ contact["contact_orcid"] }}</span
            >
          </span>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon
                class="ml-3 text-white"
                size="small"
                v-bind="props"
                @click="removeContact(index)"
              >
                fas fa-times-circle
              </v-icon>
            </template>
            <span> Remove contact </span>
          </v-tooltip>
        </div>
      </v-chip>
      <v-spacer />
      <!--ADD NEW CONTACT -->
      <v-chip
        class="bg-green text-white pr-5 shadowChip"
        @click="createNewContact()"
      >
        <v-icon class="mr-3 text-white" size="small">
          fas fa-plus-circle
        </v-icon>
        Add a new contact point
      </v-chip>
    </v-chip-group>
    <v-overlay
      v-model="menu.show"
      class="align-center justify-center"
      opacity="0.8"
    >
      <v-card width="800px">
        <v-card-title class="bg-green text-white">
          {{ menu.label }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-text-field
            v-model="menu.content['contact_name']"
            :rules="[rules.isRequired()]"
            label="Contact Name"
            variant="outlined"
          />
          <v-text-field
            v-model="menu.content['contact_email']"
            :rules="[rules.isRequired(), rules.isEmail()]"
            label="Contact Email"
            variant="outlined"
          />
          <v-text-field
            v-model="menu.content['contact_orcid']"
            :rules="[rules.isOrcid(false)]"
            label="Contact ORCID"
            placeholder="0000-0000-0000-0000"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!formValid"
            class="bg-success"
            type="submit"
            @click="addItem()"
          >
            {{ menu.label }}
          </v-btn>
          <v-btn class="bg-error" @click="menu.show = false"> Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-form>
</template>

<script>
import { isEqual } from "lodash";
import { mapGetters } from "vuex";

import { isEmail, isOrcid, isRequired } from "@/utils/rules.js";

export default {
  name: "Contact",
  data() {
    return {
      menu: {
        show: false,
        label: "Create new contact point",
        content: null,
        index: null,
      },
      rules: {
        isRequired: function () {
          return isRequired();
        },
        isEmail: function () {
          return isEmail();
        },
        isOrcid: function (val) {
          return isOrcid(val);
        },
      },
      formValid: false,
      submitted: false,
    };
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    contacts: {
      get() {
        return this.getSection("generalInformation").data.metadata.contacts;
      },
      set(val) {
        this.$store.commit("record/setContacts", val);
      },
    },
    initialContact() {
      return this.getSection("generalInformation").initialData.metadata
        .contacts;
    },
  },
  watch: {
    "menu.show": function (val) {
      if (val)
        this.$nextTick(() => {
          this.$refs["editContact"].validate();
        });
    },
  },
  methods: {
    createNewContact() {
      this.submitted = false;
      this.menu.show = true;
      this.menu.label = "Create new contact point";
      this.menu.index = null;
      this.menu.content = {
        contact_name: null,
        contact_email: null,
        contact_orcid: null,
      };
    },
    removeContact(contactIndex) {
      this.contacts.splice(contactIndex, contactIndex + 1);
    },
    editContact(contact, contactIndex) {
      this.submitted = false;
      this.menu.show = true;
      this.menu.label = "Apply changes to contact point";
      this.menu.index = contactIndex;
      this.menu.content = JSON.parse(JSON.stringify(contact));
    },
    addItem() {
      if (this.formValid && !this.submitted) {
        if (this.menu.index || this.menu.index === 0) {
          this.contacts[this.menu.index] = this.menu.content;
        }
        else {
          this.contacts[this.contacts.length] = this.menu.content;
        }
        this.menu.show = false;
        this.submitted = true;
      }
    },
    isNew(term) {
      return !this.initialContact.filter((obj) => isEqual(obj, term))[0];
    },
  },
};
</script>

<style scoped>
#editContact .v-overlay__content {
  min-width: 700px;
}

#editContact .borderBlue {
  border: 1px solid #2a9af4 !important;
  background-color: white !important;
  border-color: #2a9af4 !important;
}

#editContact .v-chip.white {
  border-color: #2a9af4 !important;
}

#editContact .borderBlue * {
  color: #2a9af4 !important;
}
</style>
