<template>
  <v-container id="container-back" fluid>
    <div id="search">
      <section class="d-flex flex-column justify-center">
        <v-row class="justify-center">
          <!--FAIRassistant Logo -->
          <v-col
            class="d-flex justify-content-center align-center flex-column py-10"
            cols="12"
            lg="3"
            md="3"
            sm="12"
          >
            <v-btn
              :class="[
                'mt-1',
                $vuetify.display.lgAndDown
                  ? 'home-search-bt'
                  : 'home-search-bt-xl',
              ]"
              class="mr-8 mb-8"
              color="primary"
              href="https://assist.fairsharing.org/"
              target="_blank"
            >
              <v-icon class="mr-1" size="x-small"> fas fa-search </v-icon>
              <v-icon class="mr-1" size="x-small">
                fas fa-graduation-cap
              </v-icon>
              <span class="button-text-size">Explore & Learn</span>
            </v-btn>
            <v-img
              alt="FAIRassistant"
              class="contain"
              height="auto"
              max-height="400"
              max-width="400"
              src="/assets/Home/BlockSearch/fairassist.svg"
              width="100%"
            />
          </v-col>
          <!--Divider -->
          <v-col
            :class="[
              {
                'verticalDividerWrp mx-3': $vuetify.display.mdAndUp,
                'horizontalDividerWrp my-3': $vuetify.display.smAndDown,
              },
            ]"
            class="d-flex align-center pa-0"
            cols="12"
            lg="1"
            md="1"
            sm="12"
          >
            <div v-if="$vuetify.display.mdAndUp" class="vertical-divider" />
            <div v-else class="horizontal-divider" />
          </v-col>
          <!--Search Block -->
          <v-col
            class="d-flex justify-content-center align-center flex-column py-10"
            cols="12"
            lg="4"
            md="4"
            sm="12"
          >
            <!--Advance Search Button -->
            <AdvanceSearch
              :advanced-search-term="advancedSearchValue"
              show-home-search
            />
            <string-search
              :is-advance-search-term="isAdvanceSearchTerm"
              class="mt-16"
              placeholder="Search through all content"
              show-home-search
              style="width: 100%"
              @advanced-search-term="advancedSearchTerm"
            />
          </v-col>
          <!--Divider -->
          <v-col
            :class="[
              {
                'verticalDividerWrp mx-3': $vuetify.display.mdAndUp,
                'horizontalDividerWrp my-3': $vuetify.display.smAndDown,
              },
            ]"
            class="d-flex align-center pa-0"
            cols="12"
            lg="1"
            md="1"
            sm="12"
          >
            <div v-if="$vuetify.display.mdAndUp" class="vertical-divider" />
            <div v-else class="horizontal-divider" />
          </v-col>
          <!--Browse Subject -->
          <v-col
            class="d-flex justify-content-center align-center flex-column py-10"
            cols="12"
            lg="3"
            md="3"
            sm="12"
          >
            <v-btn
              :class="[
                'mt-1',
                $vuetify.display.lgAndDown
                  ? 'home-search-bt'
                  : 'home-search-bt-xl',
              ]"
              class="mb-8"
              color="primary"
              to="/browse/subject"
            >
              <v-icon class="mr-1" size="x-small"> fas fa-search </v-icon>
              <span class="button-text-size">Browse by Subject</span>
            </v-btn>
            <v-img
              alt="browse by subject"
              class="contain"
              height="auto"
              max-height="340"
              max-width="340"
              src="/assets/Home/BlockSearch/browser.svg"
              width="90%"
            />
          </v-col>
        </v-row>
      </section>
    </div>
  </v-container>
</template>

<script>
import AdvanceSearch from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearch.vue";
import StringSearch from "@/components/Records/Search/Input/StringSearch";

export default {
  name: "SearchBlock",
  components: { AdvanceSearch, StringSearch },
  data() {
    return {
      advancedSearchValue: null,
      isAdvanceSearchTerm: false,
    };
  },
  methods: {
    advancedSearchTerm(value) {
      this.advancedSearchValue = value;
    },
  },
};
</script>

<style lang="scss" scoped>
#container-back {
  background: rgb(37, 52, 66);
}

.verticalDividerWrp {
  max-width: 2px;
}

.vertical-divider {
  width: 0.1rem;
  height: 90%;
  background: #809bb5;
}

.horizontalDividerWrp {
  max-height: 2px;
}

.horizontal-divider {
  width: 90%;
  height: 0.1rem;
  background: #809bb5;
  margin: 0 auto;
}

.home-search-bt {
  height: 40px !important;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}

.home-search-bt-xl {
  height: 50px !important;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}
</style>
