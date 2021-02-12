<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Organisations" />
    <NoneFound :data-field="getField('organisations')" />
    <div
      v-for="(value, key, index) in relations"
      :key="'relation_' + index"
    >
      <h4
        v-if="getRelations(key).length"
        class="org-relation-title"
      >
        {{ value }}
      </h4>
      <v-card
        v-for="(organisationLink, nindex) in getRelations(key)"
        :key="'organisationLink_' + nindex"
        class="pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
        :class="nindex === 0 ? 'mt-4':'mt-2'"
        flat
        outlined
      >
        <div class="d-flex mt-2 ">
          <v-tooltip top>
            <template #activator="{ on }">
              <v-sheet
                class="mb-2 flag-mr"
                v-on="on"
              >
                <v-icon
                  color="secondary"
                  class="mr-2"
                >
                  fas fa-sitemap
                </v-icon>
              </v-sheet>
            </template>

            <span>Organisation name and type</span>
          </v-tooltip>
          <p class="ma-0">
            <a
              :href="organisationLink.organisation.homepage"
              target="_blank"
            >
              {{ organisationLink.organisation.name }}
            </a>
            <span v-if="organisationLink.organisation.types.length > 0">
              ({{ organisationLink.organisation.types.join(', ') }})
            </span>
          </p>
        </div>

        <div
          v-if="organisationLink.grant"
          class="d-flex mt-2 "
        >
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-sheet
                class="mb-2 flag-mr"
                v-on="on"
              >
                <v-icon
                  color="secondary"
                  class="mr-2"
                >
                  fas fa-funnel-dollar
                </v-icon>
              </v-sheet>
            </template>

            <span>Grant funding this resource</span>
          </v-tooltip>
          <p class="ma-0">
            {{ organisationLink.grant.name }}
          </p>
        </div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

import NoneFound from '@/components/Records/Record/NoneFound';
import SectionTitle from '@/components/Records/Record/SectionTitle';

/* TODO: Replace with query from database */
import organisationRelations from '@/data/organisationRelations.json';

export default {
  name: "Organisations",
  components: {
    NoneFound,
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

<style scoped>
.org-relation-title {
  padding-top: 20px;
}
</style>
