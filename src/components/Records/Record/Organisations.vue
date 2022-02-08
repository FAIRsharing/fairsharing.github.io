<template>
  <v-card
    v-if="!inlineStyle && getField('organisations').length!==0 && (getField('organisations')!==undefined && getField('organisations')!==null)"
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <SectionTitle title="Organisations" />
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
          <Icon
            :item="key"
            fallback="other_involvement"
            size="10"
          />
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
                :href="'/organisations/' + organisationLink.organisation.id"
                target="_blank"
                class="underline-effect"
              >
                {{ organisationLink.organisation.name }}
                <v-tooltip
                  bottom
                >
                  <template #activator="{ on }">
                    <v-chip
                      v-if="organisationLink.isLead"
                      class="ma-2"
                      color="primary"
                      label
                      x-small
                      v-on="on"
                    >
                      Lead

                    </v-chip>
                  </template>
                  <span>This is a leading organisation in relation to this resource</span>
                </v-tooltip>
              </a>
              <p
                v-if="organisationLink.organisation.types.length > 0 && !organisationLink.organisation.types.includes('Undefined')"
                class="ma-0"
              >
                ({{ organisationLink.organisation.types.join(', ') }})
              </p>
              <div
                v-if="organisationLink.grants.length"
                class="mt-4"
              >
                <span v-if="organisationLink.grant">
                  <span
                    v-if="organisationLink.grants.length>1"
                    class="pr-1"
                  >Grants:</span>
                  <span
                    v-else
                    class="pr-1"
                  >Grant:</span>
                </span>
                <span
                  v-for="(grant,grantIndex) in organisationLink.grants"
                  :key="grant+'_'+grantIndex"
                >
                  <strong v-if="grant">
                    <span>{{ grant.name }}</span>
                    <span
                      v-if="grantIndex!==organisationLink.grants.length-1"
                      class="pr-1"
                    >,</span>
                  </strong>
                </span>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </v-card>
  <!--  if its an inline style run the below code -->
  <div
    v-else-if="inlineStyle && getField('organisations') && getField('organisations').length"
    class="d-flex flex-row mt-4 align-center"
  >
    <b class="width-15-percent-flex">Organisations</b>
    <p
      v-if="jointOrganisations && jointOrganisations.length"
      class="ma-0 full-width ml-md-12 ml-13"
    >
      <a
        v-for="(item,index) in jointOrganisations"
        :key="item.organisation.name+'_'+index"
        :href="'/organisations/' + item.organisation.id"
        target="_blank"
        class="underline-effect"
      >
        {{ item.organisation.name }}
        <span
          v-if="jointOrganisations.length-1!==index"
          style="color: black!important;"
        >,</span>
      </a>
    </p>
    <p
      v-else
      class="ma-0 full-width ml-md-12 ml-13"
    >
      Not applicable
    </p>
  </div>
  <div
    v-else
    class="d-flex flex-row mt-4 align-center"
  >
    <b class="width-15-percent-flex">Organisations</b>
    <p class="ma-0 full-width ml-md-12 ml-13">
      Not applicable
    </p>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import SectionTitle from '@/components/Records/Record/SectionTitle';
import organisationRelations from '@/data/organisationRelations.json';
import Icon from "@/components/Icon";

export default {
  name: "Organisations",
  components: {
    Icon,
    SectionTitle
  },
  props: {
    inlineStyle: {default: false, type: Boolean},
    backColor:{
      default:null,
      type: String,
    }
  },
  data() {
    return {
      relations: organisationRelations
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    jointOrganisations(){
      return this.getRelations('maintains').concat(this.getRelations('collaborates_on').concat(this.getRelations('associated_with')));
    }
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
        }
        else {
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
