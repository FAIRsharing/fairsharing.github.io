<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon
            class="mr-2"
            size="15"
            v-bind="props"
          >
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['maintainers'] }}
      </v-tooltip>
      <b>Maintainers</b>
    </span>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-8">
      <div
        v-if="getField('maintainers').length === 0"
        class="d-flex flex-wrap"
        :class="{'justify-end' : $vuetify.display.smAndDown}"
      >
        <p
          class="ma-0 mr-1"
          :class="{'text-end' : $vuetify.display.smAndDown}"
        >
          This record is in need of a maintainer.
        </p>
        <p
          v-if="canClaim && user().isLoggedIn || !canClaim && !user().isLoggedIn"
          class="ma-0 mr-1"
          :class="{'text-end' : $vuetify.display.smAndDown}"
        >
          If you are affiliated with this project,
        </p>

        <router-link
          v-if="!canClaim && !user().isLoggedIn"
          :to="`accounts/login?goTo=%2F${$route.params.id}`"
          class="mr-1"
        >
          login
        </router-link>
        <p
          v-if="!canClaim && !user().isLoggedIn"
          class="ma-0 mr-1"
          :class="{'text-end' : $vuetify.display.smAndDown}"
        >
          and claim it now!
        </p>
        <p
          v-if="canClaim"
          class="underline-effect text-blue"
          :class="{'text-end' : $vuetify.display.smAndDown}"
          @click="()=>{$emit('requestOwnership')}"
        >
          claim it now!
        </p>
      </div>
      <!--<NoneFound :data-field="getField('maintainers')" />-->
      <!--Contact-->

      <div
        v-for="(maintainer,index) in getField('maintainers')"
        :key="maintainer.contact_name"
        class="d-flex flex-wrap"
      >
        <div class="d-flex">
          <router-link
            v-if="maintainer"
            :class="[{'mr-1':maintainer.orcid},'underline-effect']"
            :to="`/users/${maintainer.id}`"
          >
            {{ maintainer.username }}
          </router-link>
          <a
            v-if="maintainer.orcid"
            class="mr-2"
            :href="`https://orcid.org/${maintainer.orcid}`"
            target="_blank"
          >
            <Icon
              :height="27"
              item="Orcid"
              wrapper-class=""
            />
          </a>
        </div>
        <span class="mr-1">{{ index !== getField('maintainers').length - 1 ? ',' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import Icon from "@/components/Icon";
export default {
  name: "Maintainers",
  components: {Icon},
  props: {
    canClaim: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState('users', ["user"]),
    ...mapState('editor', ['recordTooltips'])
  }
}
</script>
