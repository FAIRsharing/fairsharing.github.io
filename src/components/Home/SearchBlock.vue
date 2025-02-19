<template>
  <v-container
    id="container-back"
    fluid
  >
    <div id="search">
      <section class="d-flex flex-column justify-center">
        <v-row class="justify-center">
          <!--FAIRassistant Logo -->
          <v-col
            cols="12"
            sm="12"
            md="3"
            lg="3"
            class="d-flex justify-content-center align-center flex-column py-10"
          >
            <v-btn
              color="primary"
              class="mr-8 mb-8"
              :class="[
                'mt-1',
                $vuetify.display.lgAndDown
                  ? 'home-search-bt'
                  : 'home-search-bt-xl',
              ]"
              href="https://assist.fairsharing.org/"
              target="_blank"
            >
              <v-icon
                size="x-small"
                class="mr-1"
              >
                fas fa-search fa-graduation-cap
              </v-icon>
              <v-icon
                size="x-small"
                class="mr-1"
              >
                fas fa-graduation-cap
              </v-icon>
              <span class="button-text-size">Explore & Learn</span>
            </v-btn>
            <v-img
              src="/assets/Home/BlockSearch/fairassist.svg"
              height="auto"
              width="100%"
              max-height="400"
              max-width="400"
              contain
              alt="FAIRassistant"
            />
          </v-col>
          <!--Divider -->
          <v-col
            cols="12"
            sm="12"
            md="1"
            lg="1"
            class="d-flex align-center pa-0"
            :class="[
              {
                'verticalDividerWrp mx-3': $vuetify.display.mdAndUp,
                'horizontalDividerWrp my-3': $vuetify.display.smAndDown,
              },
            ]"
          >
            <div
              v-if="$vuetify.display.mdAndUp"
              class="vertical-divider"
            />
            <div
              v-else
              class="horizontal-divider"
            />
          </v-col>
          <!--Search Block -->
          <v-col
            cols="12"
            sm="12"
            md="4"
            lg="4"
            class="d-flex justify-content-center align-center flex-column py-10"
          >
            <!--Advance Search Button -->
            <AdvanceSearch
              show-home-search
              :advanced-search-term="advancedSearchValue"
            />
            <string-search
              class="mt-16"
              style="width: 100%"
              show-home-search
              placeholder="search through all content"
              :is-advance-search-term="isAdvanceSearchTerm"
              @advanced-search-term="advancedSearchTerm"
            />
          </v-col>
          <!--Divider -->
          <v-col
            cols="12"
            sm="12"
            md="1"
            lg="1"
            class="d-flex align-center pa-0"
            :class="[
              {
                'verticalDividerWrp mx-3': $vuetify.display.mdAndUp,
                'horizontalDividerWrp my-3': $vuetify.display.smAndDown,
              },
            ]"
          >
            <div
              v-if="$vuetify.display.mdAndUp"
              class="vertical-divider"
            />
            <div
              v-else
              class="horizontal-divider"
            />
          </v-col>
          <!--Browse Subject -->
          <v-col
            cols="12"
            sm="12"
            md="3"
            lg="3"
            class="d-flex justify-content-center align-center flex-column py-10"
          >
            <v-btn
              color="primary"
              class="mb-8"
              :class="[
                'mt-1',
                $vuetify.display.lgAndDown
                  ? 'home-search-bt'
                  : 'home-search-bt-xl',
              ]"
              to="/browse/subject"
            >
              <v-icon
                size="x-small"
                class="mr-1"
              >
                fas fa-search
              </v-icon>
              <span class="button-text-size">Browse by Subject</span>
            </v-btn>
            <v-img
              src="/assets/Home/BlockSearch/browser.svg"
              height="auto"
              width="90%"
              max-height="340"
              max-width="340"
              contain
              alt="browse by subject"
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

<style scoped>
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
