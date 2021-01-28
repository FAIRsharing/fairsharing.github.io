<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle title="General Information" />

    <!-- Title and DOI -->
    <DOITitle />
    <!--  other data  -->
    <div class="d-flex flex-column ml-2">
      <!--Type-->
      <Type />
      <!--Year of Creation-->
      <YearOfCreation />
      <!--Registry-->
      <Registry />
      <!--Description-->
      <Description />
      <!--Home Page-->
      <HomePage />
      <!--Developed Countries-->
      <Countries />
      <!--Maintainers-->
      <Maintainers
        :can-claim="canClaim"
        @requestOwnership="callRequestOwnership"
      />
      <!--Keywords-->
      <Keywords />
      <!--How to cite & publication for record named Citations-->
      <Citations />
      <!--updates and creation date-->
      <UpdateCreateDetail />
    </div>
    <section />
  </v-card>
</template>

<script>
import SectionTitle from '@/components/Records/Record/SectionTitle';
import Keywords from "@/components/Records/Record/GeneralInfo/Keywords";
import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle";
import Type from "@/components/Records/Record/GeneralInfo/Type";
import YearOfCreation from "@/components/Records/Record/GeneralInfo/YearOfCreation";
import Registry from "@/components/Records/Record/GeneralInfo/Registry";
import Description from "@/components/Records/Record/GeneralInfo/Description";
import HomePage from "@/components/Records/Record/GeneralInfo/HomePage";
import Countries from "@/components/Records/Record/GeneralInfo/Countries";
import Citations from "@/components/Records/Record/GeneralInfo/Citations";
import UpdateCreateDetail from "@/components/Records/Record/GeneralInfo/UpdateCreateDetail";
import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers";


export default {
  name: "GeneralInfo",
  components: {
    Maintainers,
    UpdateCreateDetail,
    Citations,
    Countries,
    HomePage,
    Description,
    Registry,
    YearOfCreation,
    Type,
    DOITitle,
    Keywords,
    SectionTitle,
  },
  props: {
    canClaim: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    callRequestOwnership() {
      this.$emit('requestOwnership')
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;
    outline: 0;
  }
}
</style>
