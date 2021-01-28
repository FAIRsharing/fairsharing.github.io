<template>
  <v-card
    height="100%"
    class="flexCard"
  >
    <v-card-title>
      Access Points
    </v-card-title>
    <v-card-text>
      <v-row
        v-for="(ap, index) in currentFields.access_points"
        :key="'selected_' + index"
      >
        {{ ap }}
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import {mapGetters} from "vuex"
//import {mapGetters, mapState} from "vuex"
//import { isRequired, isUrl } from "@/utils/rules.js"

export default {
  name: "AccessPoints",
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    section(){
      return this.getSection('additionalInformation');
    },
    initialFields(){
      return this.getSection("additionalInformation").initialData
    },
    currentFields(){
      return this.getSection("additionalInformation").data || []
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