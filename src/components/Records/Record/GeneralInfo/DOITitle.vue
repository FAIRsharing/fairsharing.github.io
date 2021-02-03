<template>
  <div class="d-flex mt-4 ml-0">
    <div class="align-self-center width-200">
      <record-status :record="currentRecord['fairsharingRecord']" />
    </div>
    <div class="align-self-center full-width ml-15">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row align-center">
          <h3>{{ getField('name') }}</h3>
          <b
            v-if="getField('abbreviation')"
            class="ml-2"
          >({{ getField('abbreviation') }})</b>
        </div>
        <div class="d-flex align-center width-35">
          <v-img
            src="@/assets/DOI_logo.svg"
            height="30"
            contain
            class="mr-2"
          />
          <div
            v-if="getField('doi')"
            class="d-flex flex-row"
          >
            <a
              :href="generateDoiLink(getField('doi'))"
              target="_blank"
              class="underline-effect"
            >
              {{ getField('doi') }}
            </a>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  v-ripple
                  v-clipboard="copyURL"
                  v-bind="attrs"
                  class="primary--text ml-2 cursor-pointer"
                  small
                  v-on="on"
                >
                  fa fa-copy
                </v-icon>
              </template>
              <span v-if="!copyButtonStatus"> Copy URL </span>
              <span v-else> URL copied </span>
            </v-tooltip>
          </div>
          <NoneFound
            v-else
            :string-field="getField('doi')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import NoneFound from "@/components/Records/Record/NoneFound";
import {mapGetters, mapState} from "vuex";

export default {
  name: "DOITitle",
  components: {
    NoneFound,
    RecordStatus
  },
  data() {
    return {
      copyButtonStatus: false,
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("record", ["currentRecord"]),
  },
  methods: {
    generateDoiLink(doi) {
      return `https://doi.org/${doi}`
    },
    copyURL() {
      this.copyButtonStatus = true;
      return this.generateDoiLink(this.currentRecord['fairsharingRecord'].doi)
    }
  }
}
</script>
