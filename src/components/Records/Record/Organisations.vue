<template>
  <!--  <v-card-->
  <!--    class="pa-4 d-flex flex-column"-->
  <!--    outlined-->
  <!--    tile-->
  <!--    color="bg_record_card"-->
  <!--    elevation="3"-->
  <!--  >-->
  <!--    <SectionTitle title="Organisations" />-->
  <!--    <NoneFound :data-field="getField('organisations')" />-->
  <!--    <div-->
  <!--      v-for="(value, key, index) in relations"-->
  <!--      :key="'relation_' + index"-->
  <!--    >-->
  <!--      <h4-->
  <!--        v-if="getRelations(key).length"-->
  <!--        class="org-relation-title"-->
  <!--      >-->
  <!--        {{ value }}-->
  <!--      </h4>-->
  <!--      <v-card-->
  <!--        v-for="(organisationLink, nindex) in getRelations(key)"-->
  <!--        :key="'organisationLink_' + nindex"-->
  <!--        class="pr-2 pl-4 pt-1 pb-2 d-flex flex-column"-->
  <!--        :class="nindex === 0 ? 'mt-4':'mt-2'"-->
  <!--        flat-->
  <!--        outlined-->
  <!--      >-->
  <!--        <div class="d-flex mt-2 ">-->
  <!--          <v-tooltip top>-->
  <!--            <template v-slot:activator="{ on }">-->
  <!--              <v-sheet-->
  <!--                class="mb-2 flag-mr"-->
  <!--                v-on="on"-->
  <!--              >-->
  <!--                <v-icon-->
  <!--                  color="secondary"-->
  <!--                  class="mr-2"-->
  <!--                >-->
  <!--                  fas fa-sitemap-->
  <!--                </v-icon>-->
  <!--              </v-sheet>-->
  <!--            </template>-->

  <!--            <span>Organisation name and type</span>-->
  <!--          </v-tooltip>-->
  <!--          <p class="ma-0">-->
  <!--            <a-->
  <!--              :href="organisationLink.organisation.homepage"-->
  <!--              target="_blank"-->
  <!--            >-->
  <!--              {{ organisationLink.organisation.name }}-->
  <!--            </a>-->
  <!--            <span v-if="organisationLink.organisation.types.length > 0">-->
  <!--              ({{ organisationLink.organisation.types.join(', ') }})-->
  <!--            </span>-->
  <!--          </p>-->
  <!--        </div>-->

  <!--        <div-->
  <!--          v-if="organisationLink.grant"-->
  <!--          class="d-flex mt-2 "-->
  <!--        >-->
  <!--          <v-tooltip top>-->
  <!--            <template v-slot:activator="{ on }">-->
  <!--              <v-sheet-->
  <!--                class="mb-2 flag-mr"-->
  <!--                v-on="on"-->
  <!--              >-->
  <!--                <v-icon-->
  <!--                  color="secondary"-->
  <!--                  class="mr-2"-->
  <!--                >-->
  <!--                  fas fa-funnel-dollar-->
  <!--                </v-icon>-->
  <!--              </v-sheet>-->
  <!--            </template>-->

  <!--            <span>Grant funding this resource</span>-->
  <!--          </v-tooltip>-->
  <!--          <p class="ma-0">-->
  <!--            {{ organisationLink.grant.name }}-->
  <!--          </p>-->
  <!--        </div>-->
  <!--      </v-card>-->
  <!--    </div>-->
  <!--  </v-card>-->
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle
      title="Organisations"
      :inactive-section="getField('organisations').length===0 || getField('organisations')===undefined"
    />
    <div class="d-flex flex-column ml-2 min-height-40">
      <div
        v-for="(value, key, index) in relations"
        :key="'relation_' + index"
      >
        <v-card
          v-if="getRelations(key).length"
          class="pa-4 mt-15 d-flex flex-column min-height-100"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <div class="icon-container d-flex justify-center">
            <v-icon large>
              {{ $vuetify.icons.values[key] }}
            </v-icon>
          </div>
          <v-card-title class="pa-0 text--primary card-title-customize">
            {{ value }}
          </v-card-title>
          <v-card-text
            v-for="(organisationLink, nodeIndex) in getRelations(key)"
            :key="'organisationLink_' + nodeIndex"
            :class="['pl-4 pl-2 pt-0 pb-0',{'pt-8':nodeIndex===0}]"
          >
            <v-card
              class="pa-4 mt-2 d-flex flex-column v-card-hover"
              flat
              outlined
            >
              <a
                :href="organisationLink.organisation.homepage"
                target="_blank"
              >
                {{ organisationLink.organisation.name }}
              </a>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <section />
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';

    /* TODO: Replace with query from database */
    import organisationRelations from '@/data/organisationRelations.json';

    export default {
        name: "Organisations",
        components: {
            SectionTitle
        },
        data(){
          return {
            /* TODO: Replace with query from database */
            relations: organisationRelations
          }
        },
        computed: {
            ...mapGetters("record", ["getField"])
        },
        methods: {
          getRelations(relName){
            let _module = this;
            let fields = _module.getField('organisationLinks');
            return fields.filter(obj => obj.relation === relName);
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
