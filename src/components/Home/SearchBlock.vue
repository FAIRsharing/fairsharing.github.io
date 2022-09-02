<template>
  <v-container
    id="container-back"
    fluid
  >
    <v-container>
      <section class="d-flex flex-column justify-center">
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="6"
            class="d-flex align-center"
          >
            <string-search
              style="width: 100%"
              show-home-search
              placeholder="search through all content"
            />
            <div
              v-if="$vuetify.breakpoint.lgAndUp"
              :class="$vuetify.breakpoint.width>1893?'vertical-divider':'vertical-divider-sm'"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="12"
            lg="6"
            class="d-flex justify-content-center align-center"
          >
            <v-img
              src="/assets/Home/BlockSearch/browser.svg"
              height="400"
              contain
              alt="browse by subject"
              class="ml-md-15"
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

export default {
  name: "SearchBlock",
  components: {StringSearch
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

</style>
