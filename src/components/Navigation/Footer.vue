<template>
  <v-row class="secondary white--text pt-5">
    <v-col
      v-for="(block,index) in footerData"
      :key="block.header+'_'+index"
      :cols="$vuetify.breakpoint.xsOnly?'12':4"
      lg="4"
      md="4"
      sm="12"
      xsm="12"
      class="flex-column align-center d-flex"
    >
      <h4 class="min-width-200 mb-2">
        {{ block.header }}
      </h4>
      <ul>
        <li
          v-for="(item,blockIndex) in block.content"
          :key="item.title+'_'+blockIndex"
        >
          <a
            class="underline-effect"
            :href="item.url"
            target="_blank"
          >
            <i
              v-if="item.icon"
              :class="item.icon"
            />
            {{ item.title }}
          </a>
        </li>
      </ul>
    </v-col>
    <v-row
      class="d-flex flex-row justify-center align-center mb-2"
    >
      <p class="mb-0 mr-2">
        © FAIRsharing 2009-Present | Licensed under
      </p>
      <a
        class="mr-2 underline-effect"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
      >Creative Commons
        by
        Share Alike 4.0 International</a>
      <a
        href="/licence"
        class="underline-effect"
      ><img
        src="https://fairsharing.org/static/img/home/FAIRsharingCC-BY-SA.png"
      ></a>
    </v-row>
  </v-row>
</template>

<script>
import footerData from '@/data/footerData.json'
export default {
  name: "Footer",
  data: () => {
    return {
      footerData
    }
  }
}
</script>
<style scoped>
li {
  min-width: 200px;
}
</style>
