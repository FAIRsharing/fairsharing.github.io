<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <span class="d-flex align-baseline width-15-percent-flex">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon class="mr-2" size="15" v-bind="props">
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips["maintainers"] }}
      </v-tooltip>
      <b>Maintainers</b>
    </span>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-8">
      <div
        v-if="getField('maintainers').length === 0"
        :class="{ 'justify-end': $vuetify.display.smAndDown }"
        class="d-flex flex-wrap"
      >
        <p
          :class="{ 'text-end': $vuetify.display.smAndDown }"
          class="ma-0 mr-1"
        >
          This record is in need of a maintainer.
        </p>
        <p
          v-if="
            (canClaim && user().isLoggedIn) || (!canClaim && !user().isLoggedIn)
          "
          :class="{ 'text-end': $vuetify.display.smAndDown }"
          class="ma-0 mr-1"
        >
          If you are affiliated with this project,
        </p>

        <a
          v-if="!canClaim && !user().isLoggedIn"
          :href="`${serverLink}accounts/login?goTo=%2F${$route.params.id}`"
          class="mr-1"
        >
          login
        </a>
        <p
          v-if="!canClaim && !user().isLoggedIn"
          :class="{ 'text-end': $vuetify.display.smAndDown }"
          class="ma-0 mr-1"
        >
          and claim it now!
        </p>
        <p
          v-if="canClaim"
          :class="{ 'text-end': $vuetify.display.smAndDown }"
          class="underline-effect text-blue"
          @click="
            () => {
              $emit('requestOwnership');
            }
          "
        >
          claim it now!
        </p>
      </div>
      <!--<NoneFound :data-field="getField('maintainers')" />-->
      <!--Contact-->

      <div
        v-for="(maintainer, index) in getField('maintainers')"
        :key="maintainer.contact_name"
        class="d-flex flex-wrap"
      >
        <div class="d-flex">
          <router-link
            v-if="maintainer"
            :class="[{ 'mr-1': maintainer.orcid }, 'underline-effect']"
            :to="`/users/${maintainer.id}`"
          >
            {{ maintainer.username }}
          </router-link>
          <a
            v-if="maintainer.orcid"
            :href="`https://orcid.org/${maintainer.orcid}`"
            class="mr-2"
            target="_blank"
          >
            <Icon :height="27" item="Orcid" wrapper-class="" />
          </a>
        </div>
        <span class="mr-1">{{
          index !== getField("maintainers").length - 1 ? "," : ""
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import Icon from "@/components/Icon";

export default {
  name: "Maintainers",
  components: { Icon },
  props: {
    canClaim: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("users", ["user"]),
    ...mapState("editor", ["recordTooltips"]),
    serverLink: function () {
      return import.meta.env.VITE_HOSTNAME;
    },
  },
};
</script>
