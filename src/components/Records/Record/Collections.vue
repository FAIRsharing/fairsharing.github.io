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
          v-model="tab"
          background-color="transparent"
          centered
        >
          <v-tab
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in items"
            :key="item"
          >
            <v-card
              class="mx-1"
              flat
            >
              <v-virtual-scroll
                :items="items"
                height="300"
                item-height="100"
              >
                <v-list-item :key="item">
                  <v-list-item-action>
                    <v-btn
                      fab
                      small
                      depressed
                      color="primary"
                    >
                      {{ item }}
                    </v-btn>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title>
                      User Database Record <strong>ID {{ item }}</strong>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon small>
                      mdi-open-in-new
                    </v-icon>
                  </v-list-item-action>
                </v-list-item>

                <v-divider />
              </v-virtual-scroll>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import SectionTitle from '@/components/Records/Record/SectionTitle';
import {mapGetters} from "vuex";
export default {
  name: "Collections",
  components: {
    SectionTitle,
  },
  data:()=>{
    return {
      tab: null,
      items: [
        'In collections', 'In Recommendations',
      ],
    }
  },
  computed: {
    items () {
      return Array.from({ length: this.length }, (k, v) => v + 1)
    },
    length () {
      return 7000
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
