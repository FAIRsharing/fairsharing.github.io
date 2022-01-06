<template>
  <div
    v-if="getField('metadata').contacts && getField('metadata').contacts.length"
    class="d-flex align-center"
  >
    <b style="width: 210px">Contacts</b>
    <div
      v-for="(contact,index) in getField('metadata').contacts"
      :key="contact+'_'+index"
      class="ma-0"
    >
      <div
        style="min-height: 40px"
        class="d-flex align-center mr-2"
      >
        <b
          v-if="contact.contact_name"
          class="mr-1"
        >{{ contact.contact_name }}</b>
        <span
          v-if="contact.contact_email"
          class="mr-1"
        >{{ contact.contact_email }}</span>
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
    <b class="width-200">Contacts</b>
    <span class="ma-0 full-width ml-md-12 ml-13">None</span>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Icon from "@/components/Icon";
export default {
  name: "Contacts",
  components:{Icon},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
