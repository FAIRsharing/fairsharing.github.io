<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <b class="width-15-percent-flex">Licences</b>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
      <NoneFound
        v-if="!licences"
        :data-field="licences"
      />
      <p
        v-else-if="!licences.length"
        class="my-0"
      >
        None found
      </p>
      <router-link
        v-for="(licence,index) in licences"
        :key="licence.id"
        :to="licence.url"
        class="underline-effect"
      >
        <p
          v-if="licence.name"
          class="ma-0 mr-2"
        >
          {{ `${licence.name}${index!==licences.length-1?',':''}` }}
        </p>
        <span
          v-else
          class="warning"
        >
          licence name undefined!
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import NoneFound from "@/components/Records/Record/NoneFound";
import { mapGetters } from "vuex";

export default {
    name: "Licence",
    components: { NoneFound },
    computed: {
        ...mapGetters({
            getField: "record/getField"
        }),
        licences() {
            return this.getField('licences');
        }

    }
}
</script>
