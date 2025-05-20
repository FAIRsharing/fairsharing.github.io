<template>
  <div class="d-flex flex-wrap mt-4 ml-0">
    <div class="align-self-center width-15-percent-flex">
      <record-status :record="currentRecord['fairsharingRecord']" />
    </div>
    <div class="align-self-center mt-2 mt-sm-0 ml-5 ml-sm-8 ml-md-13">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row align-center">
          <v-img
            v-if="currentRecord['fairsharingRecord'].urlForLogo"
            :src="newImg.src"
            :max-width="finalImageWidth"
            contain
            class="mr-2"
          />
          <h3
            :style="currentRecord['fairsharingRecord'].status === 'deprecated' ? 'text-decoration: line-through' : 'text-decoration: inherit'"
          >
            {{ getField('name') }}
          </h3>
          <b
            v-if="getField('abbreviation') && getField('registry')!=='Collection'"
            style="font-size: 16px"
            :style="currentRecord['fairsharingRecord'].status === 'deprecated' ? 'text-decoration: line-through' : 'text-decoration: inherit'"
            class="ml-2"
          >
            ({{ getField('abbreviation') }})
          </b>
        </div>
        <div class="d-flex align-center mt-2">
          <div class="width-35">
            <Icon
              item="DOI"
              heigh="30"
              wrapper-class=""
              class="mr-2"
            />
          </div>
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
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon
                  v-ripple
                  class="text-primary ml-2 cursor-pointer"

                  size="small"
                  v-bind="props"
                  @click="copyURL"
                >
                  fa fa-copy
                </v-icon>
              </template>
              <span v-if="!copyButtonStatus"> Copy URL </span>
              <span v-else> URL copied </span>
            </v-tooltip>
          </div>
          <span v-else>
            <a
              href="https://fairsharing.gitbook.io/fairsharing/#getting-a-record-doi"
              target="_blank"
              class="underline-effect"
            >
              {{ awaitingDoi() }}
            </a>
          </span>
        </div>
      </div>
    </div>
    <div class="ml-md-auto d-flex align-center">
      <info-badge
        :current-record="currentRecord"
        :show-progress="false"
        :show-progress-hover="false"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import Icon from "@/components/Icon";
import InfoBadge from "@/components/Records/Record/GeneralInfo/Badge/InfoBadge";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import getAPIEndPoint from "@/utils/generalUtils";

export default {
  name: "DOITitle",
  components: {
    InfoBadge,
    Icon,
    RecordStatus
  },
  mixins: [getAPIEndPoint],
  data() {
    return {
      copyButtonStatus: false,
      finalImageWidth:'100px',
      newImg: { src: '/' }
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("record", ["currentRecord"]),
  },
  async mounted() {
    const promiseImageLoader = () => new Promise(resolve => {
      let newImg = new Image();
      newImg.addEventListener('load', (e) => {
        resolve(e.target)
      })
      if (this.currentRecord['fairsharingRecord'].urlForLogo) {
        newImg.src = this.getAPIEndPoint() + '/' + this.currentRecord['fairsharingRecord'].urlForLogo;
      }
    })
    let image = await promiseImageLoader()
    await this.setImageAfterLoading(image)
  },
  methods: {
    async setImageAfterLoading(image) {
      if (image.width > image.height * 2) {
        this.finalImageWidth = '300px'
      }
      this.newImg.src = image.src;
    },
    generateDoiLink(doi) {
      return `https://doi.org/${doi}`
    },
    async copyURL() {
      this.copyButtonStatus = true;
      return this.generateDoiLink(this.currentRecord['fairsharingRecord'].doi)
    },
    awaitingDoi() {
      if (this.currentRecord['fairsharingRecord'].status.toLowerCase() === 'ready') {
        return "Awaiting DOI";
      }
      else if (this.currentRecord['fairsharingRecord'].status.toLowerCase() === 'uncertain' ||
          this.currentRecord['fairsharingRecord'].status.toLowerCase() === 'deprecated'
      ) {
        return "DOI will not be issued";
      }
      else {
        return "DOIs are only issued to records with 'Ready' status";
      }
    }
  }
}
</script>
