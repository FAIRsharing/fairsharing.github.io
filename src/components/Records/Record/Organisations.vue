<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
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
          <v-tooltip top>
            <template #activator="{ on }">
              <v-sheet
                class="mb-2 flag-mr"
                v-on="on"
              >
                ({{ organisationLink.organisation.types.join(', ') }})
              </p>
              <div
                v-if="organisationLink.grants.length"
                class="mt-4"
              >
                <span v-if="organisationLink.grant">
                  <span v-if="organisationLink.grants.length>1">grant(s):</span>
                  <span v-else>grant:</span>
                </span>
                <span
                  v-for="(grant,grantIndex) in organisationLink.grants"
                  :key="grant+'_'+grantIndex"
                >
                  <strong v-if="grant">
                    {{ grant.name }}
                  </strong>
                  <span v-if="grantIndex!==organisationLink.grants.length-1">,</span>
                </span>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters} from 'vuex';
import SectionTitle from '@/components/Records/Record/SectionTitle';
import organisationRelations from '@/data/organisationRelations.json';

export default {
  name: "Organisations",
  components: {
    SectionTitle
  },
  data() {
    return {
      relations: organisationRelations
    }
  },
  computed: {
    ...mapGetters("record", ["getField"])
  },
  methods: {
    getRelations(relName) {
      const _module = this;
      const fields = _module.getField('organisationLinks');
      let processedOrganisations = []
      let filteredData = fields.filter(obj => obj.relation === relName)
      filteredData.forEach(item => {
        // finding repeated organisation items with same id and will not add them if it's already existed
        if (!processedOrganisations.find(obj => obj.organisation.id === item.organisation.id)) {
          let extendedItem = {...item, grants: []}
          extendedItem.grants.push(item.grant)
          processedOrganisations.push(extendedItem)
        } else {
          // add grant of repeated item to the corresponding item with repeated id
          let repeatedItemIndex = processedOrganisations.findIndex(obj => obj.organisation.id === item.organisation.id)
          processedOrganisations[repeatedItemIndex].grants.push(item.grant)
        }
      })
      return processedOrganisations
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
