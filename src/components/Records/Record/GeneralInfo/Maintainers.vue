<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <b class="width-200">Maintainers</b>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
      <div
        v-if="getField('maintainers').length === 0"
        class="d-flex flex-wrap"
      >
        <p class="ma-0 mr-2">
          This record is in need of a maintainer.
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
        <a
          class="mr-2"
          @click="$router.push({path: '/users/' + maintainer.id})"
        >
          {{
            ` ${maintainer.username}${index !== getField('maintainers').length - 1 ? ',' : ''}`
          }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
export default {
  name: "Maintainers",
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
