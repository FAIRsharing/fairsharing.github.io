<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Access Points
    </v-card-title>
    <v-card-text>
      Some info. here about Access Points.
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters, mapState} from "vuex"
import { isRequired, isUrl } from "@/utils/rules.js"

export default {
  name: "AccessPoints",
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters("record"),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      return this.getSection("additionalInformation").data
    },
    message(){
      let error = this.getSection("additionalInfomation").error;
      return {
        error: error,
        value: this.getSection("generalInformation").message,
        type: function(){if (error){return "error"} else {return "success"}}
      };
    }
  }
}
</script>

<style scoped>

</style>