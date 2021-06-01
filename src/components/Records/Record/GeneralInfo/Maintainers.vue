<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <b class="width-200">Maintainers</b>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
      <div
        v-if="getField('maintainers').length === 0"
        class="d-flex flex-wrap"
      >
        <p class="ma-0 mr-2">
          This record is in need of a maintainer
        </p>
        <p
          v-if="canClaim"
          class="ma-0 mr-2"
        >
          If you are affiliated with this project,
        </p>
        <a
          v-if="canClaim"
          class="underline-effect"
          @click="()=>{$emit('requestOwnership')}"
        >
          Claim it now!
        </a>
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
            class="mr-1 underline-effect"
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
        {{ index !== getField('maintainers').length - 1 ? ',' : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
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
    ...mapGetters("record", ["getField"])
  }
}
</script>
