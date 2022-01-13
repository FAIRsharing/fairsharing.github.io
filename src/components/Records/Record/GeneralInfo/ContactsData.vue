<template>
  <div
    v-if="getField('metadata').contacts && getField('metadata').contacts.length"
    class="d-flex align-center flex-wrap"
  >
    <b class="width-15-percent-flex">Contacts</b>
    <div class="d-flex flex-wrap ml-md-12 ml-13">
      <div
        v-for="(contact,index) in getField('metadata').contacts"
        :key="contact+'_'+index"
        style="min-height: 40px"
        class="d-flex align-center"
      >
        <a
          v-if="contact.contact_name"
          :class="[{'ml-1':index!==0},'pr-0 underline-effect']"
          :href="contact.contact_email.toString().includes('@')?`mailto:${contact.contact_email}`:contact.contact_email"
          target="_blank"
        >
          <span
            class="mr-1"
          >{{ contact.contact_name }}</span>
        </a>
        <a
          v-if="contact.contact_orcid"
          :href="`https://orcid.org/${contact.contact_orcid}`"
          target="_blank"
        >
          <Icon
            class="mr-1"
            item="Orcid"
            :height="25"
            size="30"
            wrapper-class=""
          />
        </a><span v-if="getField('metadata').contacts.length-1!==index">,</span>
      </div>
    </div>
  </div>
  <div
    v-else
    class="align-center d-flex flex-row mb-2"
  >
    <b class="width-15-percent-flex">Contacts</b>
    <span class="ma-0 full-width ml-md-12 ml-13">None</span>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Icon from "@/components/Icon";
export default {
  name: "ContactsData",
  components:{Icon},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>