<template>
  <v-row class="text-white pt-5 footer-container justify-center">
    <!--  Footer Blocks  -->
    <v-col
      v-for="(block, index) in footerData"
      :key="block.header + '_' + index"
      xl="auto"
      class="flex-column align-center d-flex"
    >
      <h4 class="min-width-200 mb-2">
        {{ block.header }}
      </h4>
      <ul>
        <li
          v-for="(item, blockIndex) in block.content"
          :key="item.title + '_' + blockIndex"
        >
          <router-link
            v-if="item['urlType'] === 'internal'"
            class="underline-effect"
            :to="item.url"
          >
            <i v-if="item.icon" :class="item.icon" />
            {{ item.title }}
          </router-link>
          <a
            v-else
            class="underline-effect"
            :href="item.url"
            rel="noreferer,noopener"
            target="_blank"
          >
            <i v-if="item.icon" :class="item.icon" />
            {{ item.title }}
          </a>
        </li>
      </ul>
    </v-col>
    <!--  Dash style for footer  -->
    <div class="footer-dash" />
    <!--  JumpToTop button  -->
    <v-slide-y-reverse-transition>
    <v-fab
      v-show="fab"
      v-scroll-to="'body'"
      v-scroll="onScroll"
      icon="fas fa-angle-up"
      color="primary"
      position="fixed"
      app
      appear
      style="right: 72px; bottom: 50px; left: auto"
    />
    </v-slide-y-reverse-transition>
    <!--  Licence and copy right  -->
    <v-row class="d-flex flex-row justify-center align-center mb-2 pt-6">
      <p class="mb-0 mr-2">© FAIRsharing 2009-Present | Licenced under</p>
      <a
        class="mr-2 underline-effect"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
        rel="noreferer,noopener"
        target="_blank"
        >Creative Commons by Share Alike 4.0 International</a
      >
      <a href="/licence" class="underline-effect"
        ><img
          src="/assets/Home/Footer/FAIRsharingCC-BY-SA.png"
          alt="fairsharing licence"
      /></a>
    </v-row>
  </v-row>
</template>

<script>
import footerData from "@/data/footerData.json";

export default {
  name: "FooterComp",
  data: () => {
    return {
      footerData,
      fab: false
    };
  },
  methods: {
    onScroll (e){
      if (typeof window === 'undefined') return
      const top = window.scrollY || e.target.scrollTop || 0
      this.fab = top > 700
    }
  }
};
</script>
<style scoped lang="scss">
li {
  min-width: 200px;
}

.footer-container {
  position: relative;
  background: #253442;
}

.footer-dash {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  border-top: 3px dashed #253442;
}
</style>
