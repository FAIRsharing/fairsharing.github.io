<template>
  <v-container
    id="container-back"
    fluid
  >
    <v-container>
      <section
        class="d-flex justify-center flex-row"
        :class="{'flex-column': $vuetify.breakpoint.lgAndUp}"
      >
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="4"
            xl="5"
            class="d-flex align-center"
          >
            <string-search
              style="width: 100%"
              :style="{'max-width:610px': $vuetify.breakpoint.lgAndUp}"
              show-home-search
              placeholder="search through all content"
              :class="{'mr-4': $vuetify.breakpoint.lgAndUp}"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="3"
            xl="2"
            class="d-flex align-center divider-wrp"
            :class="{'justify-center': $vuetify.breakpoint.mdAndDown}"
          >
            <v-lazy v-if="$vuetify.breakpoint.lgAndUp">
              <div class="vertical-line " />
            </v-lazy>
            <v-lazy v-else>
              <div
                class="horizontal-line"
                :class="{'mobile-horizontal-line': $vuetify.breakpoint.xsOnly}"
              />
            </v-lazy>
            <v-lazy
              class="statistics-wrp full-width pa-1"
            >
              <StatisticsBlock />
            </v-lazy>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="4"
            xl="5"
            class="justify-content-center align-center"
            :class="[{'d-flex': $vuetify.breakpoint.mdAndDown}, {'flex-column': $vuetify.breakpoint.xsOnly}]"
          >
            <v-img
              src="/assets/Home/BlockSearch/browser.svg"
              :height="$vuetify.breakpoint.xsOnly ? 'auto' : 374"
              contain
              alt="browse by subject"
            />
            <v-btn
              color="primary"
              :class="['mt-1 mt-lg-1 ml-2',$vuetify.breakpoint.lgAndDown?'home-search-bt':'home-search-bt-xl']"
              to="/browse/subject"
            >
              <v-icon
                x-small
                class="mr-1"
              >
                fas fa-search
              </v-icon>
              <span class="button-text-size">Browse by Subject</span>
            </v-btn>
          </v-col>
        </v-row>
      </section>
    </v-container>
  </v-container>
</template>

<script>
import StringSearch from "@/components/Records/Search/Input/StringSearch";
import StatisticsBlock from "@/components/Home/StatisticsBlock";
export default {
  name: "SearchBlock",
  components: {
    StringSearch,
    StatisticsBlock
  }
}
</script>

<style scoped>
#container-back {
  background: rgb(37, 52, 66);
}

section {
  max-height: 650px;
}

.vertical-divider {
  width: .1rem;
  height: 100%;
  background: #809bb5;
  margin-left: 14rem;
}

.vertical-divider-sm {
  width: .1rem;
  height: 100%;
  background: #809bb5;
  margin-left: 9rem;
}

.home-search-bt {
  height: 40px!important;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}

.home-search-bt-xl {
  height: 50px!important;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}

.divider-wrp {
  position: relative;
  margin: 0 auto
}

.statistics-wrp {
  max-width: 290px;
  background-color: white;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=),
  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=),
  url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  background-size: 0 2px, 0 100%, 0% 2px;
  background-position: top center, top center, bottom center;
  animation-name: drawBorderFromCenter;
  animation-duration: 2s;
  animation-delay: 3s;
}

.vertical-line {
  position: absolute;
  top: 0;
  width: 3px;
  background-color: white;
  animation:vertical 2s forwards;
  left: 50%;
  right: auto;
}

.horizontal-line {
  position: absolute;
  top: 50%;
  height: 3px;
  background-color: white;
  animation:horizontal 2s forwards;
  left: 40px;
}

.mobile-horizontal-line {
  left: 10px;
}

@-webkit-keyframes drawBorderFromCenter {
  0% {
    background-size: 0 2px, 0 0, 100% 100%;
  }
  20% {
    background-size: 100% 2px, 100% 0, 100% 100%;
  }
  66%
  {
    background-size: 100% 2px, 100% 98%, 100% 100%;
  }
  99%
  {
    background-size: 100% 2px, 100% 98%, 0 2px;
  }
}

@keyframes vertical {
  0% {
    height: 0;
  }
  100% {
    height: 445px;
  }
}

@keyframes horizontal {
  0% {
    width: 0;
  }
  100% {
    width: 93%;
  }
}


</style>