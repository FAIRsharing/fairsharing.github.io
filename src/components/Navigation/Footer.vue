<template>
  <v-row class="text-white pt-5 footer-container justify-center">
    <v-col
      v-for="(block, index) in footerData"
      :key="block.header + '_' + index"
      class="flex-column align-center d-flex"
      xl="auto"
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
            :to="item.url"
            class="underline-effect"
          >
            <i v-if="item.icon" :class="item.icon" />
            {{ item.title }}
          </router-link>
          <a
            v-else
            :href="item.url"
            class="underline-effect"
            rel="noreferer,noopener"
            target="_blank"
          >
            <i v-if="item.icon" :class="item.icon" />
            {{ item.title }}
          </a>
        </li>
      </ul>
    </v-col>
    <div class="footer-dash" />
    <v-slide-y-reverse-transition>
      <v-fab
        v-show="fab"
        v-scroll="onScroll"
        app
        appear
        color="primary"
        icon="fas fa-angle-up"
        position="fixed"
        style="right: 72px; bottom: 50px; left: auto"
        @click="scrollToTop"
      />
    </v-slide-y-reverse-transition>
    <v-row class="d-flex flex-row justify-center align-center mb-2 pt-6">
      <p class="mb-0 mr-2">© FAIRsharing 2009-Present | Licenced under</p>
      <a
        class="mr-2 underline-effect"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
        rel="noreferer,noopener"
        target="_blank"
        >Creative Commons by Share Alike 4.0 International</a
      >
      <a class="underline-effect" href="/licence"
        ><img
          alt="fairsharing licence"
          src="/assets/Home/Footer/FAIRsharingCC-BY-SA.png"
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
      fab: false,
    };
  },
  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.scrollY || e.target.scrollTop || 0;
      this.fab = top > 700;
    },
    scrollToTop() {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
