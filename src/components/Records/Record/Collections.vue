<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle
      title="Collections"
    />
    <div class="d-flex flex-column ml-2 min-height-40">
      <v-card
        class="pa-4 mt-4 d-flex flex-column"
        outlined
        color="white"
        tile
        elevation="3"
      >
        <v-tabs
          v-model="tabsData.selectedTab"
          background-color="transparent"
          grow
          color="accent3"
          slider-color="accent3"
          class="mb-5"
        >
          <v-tab
            v-for="(tabName,tabIndex) in Object.keys(tabsData.tabs)"
            :key="tabName+'_'+tabIndex"
          >
            {{ cleanString(tabName) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabsData.selectedTab">
          <v-tab-item
            v-for="(tabItem,tabItemIndex) in tabsData.tabs"
            :key="tabItem+'_'+tabItemIndex"
          >
            <v-virtual-scroll
              :items="tabItem"
              height="400"
              item-height="130"
              class="ma-4 overflow-x-hidden"
            >
              <template #default="{ item }">
                <v-card
                  class="pa-4 d-flex flex-column v-card-hover mx-2 height-120"
                  flat
                  outlined
                >
                  {{ item.name }}
                </v-card>
              </template>
            </v-virtual-scroll>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import SectionTitle from '@/components/Records/Record/SectionTitle';
import {mapGetters} from "vuex";
import stringUtils from "@/utils/stringUtils"
export default {
  name: "Collections",
  components: {
    SectionTitle,
  },
  mixins:[stringUtils],
  data: () => {
    return {
      tabsData: {
        selectedTab:'',
        tabs: {
          in_collections: [{id: 1, name: 'a name 1 ask asdkajsdhaskjdhasd'}, {id: 2, name: 'a name 2'}],
          in_recommendations: [
            {id: 1, name: 'a name 1'}, {id: 2, name: 'a name 2'}, {id: 3, name: 'a name 3'}, {id: 4, name: 'a name 4'}, {id: 5, name: 'a name 5'},{id: 6, name: 'a name 6'},
          ]
        }
      },
      tab: null,
    }
  },
  computed: {
    items () {
      return []
    },
    length () {
      return 12
    },
    ...mapGetters("record", ["getField"]),
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

.icon-container {
  position: absolute;
  top: -45px;
  background: white;
  border: #b3b3b3 dotted 3px;
  border-radius: 50% !important;
  -moz-border-radius: 50% !important;
  -webkit-border-radius: 50% !important;
  width: 85px;
  height: 85px;
  cursor: help;
}

.card-title-customize {
  position: absolute;
  top: 5px;
  left: 120px
}

.v-card-hover {
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  transition: box-shadow .4s linear;
  -webkit-transition: box-shadow .4s linear;
  -moz-transition: box-shadow .4s linear;
  -o-transition: box-shadow .4s linear;
}

.v-card-hover:hover {
  transform: scale(1.004);
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
}
</style>
