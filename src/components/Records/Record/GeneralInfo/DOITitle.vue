<template>
  <div class="d-flex mt-4 ml-0">
    <div class="align-self-center width-15-percent-flex">
      <record-status :record="currentRecord['fairsharingRecord']" />
    </div>
    <div class="align-self-center full-width ml-13">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row align-center">
          <v-img
            v-if="currentRecord['fairsharingRecord'].urlForLogo"
            :src="newImg.src"
            :max-width="finalImageWidth"
            contain
            class="mr-2"
          />
          <h3>{{ getField('name') }}</h3>
          <b
            v-if="getField('abbreviation') && getField('registry')!=='Collection'"
            style="font-size: 16px"
            class="ml-2"
          >({{ getField('abbreviation') }})</b>
        </div>
        <div class="d-flex align-center mt-2">
          <div class="width-35">
            <Icon
              v-if="getField('registry')!=='Collection'"
              item="DOI"
              heigh="30"
              wrapper-class=""
              class="mr-2"
            />
          </div>
          <div
            v-if="getField('doi') && getField('registry')!=='Collection'"
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
          <span v-else-if="getField('registry')!=='Collection'">
            Awaiting DOI
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import {mapGetters, mapState} from "vuex";
import Icon from "@/components/Icon";
import getAPIEndPoint from "@/utils/generalUtils";

export default {
  name: "DOITitle",
  components: {
    Icon,
    RecordStatus
  },
  mixins: [getAPIEndPoint],
  data() {
    return {
      copyButtonStatus: false,
      finalImageWidth:'100px',
      newImg:{src:''}
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
      newImg.src = this.getAPIEndPoint() + this.currentRecord['fairsharingRecord'].urlForLogo;
    })
    let image = await promiseImageLoader()
    await this.setImageAfterLoading(image)
  },
  methods: {
    async setImageAfterLoading(image) {
      if (image.width > image.height * 2) {
        this.finalImageWidth = '300px'
      }
      this.newImg.src = image.src
    },
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
