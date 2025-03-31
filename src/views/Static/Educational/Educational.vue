<template>
  <main :class="applyCss?'pa-15 mb-10':''">
    <v-row
      v-if="infographics.length"
      dense
      class="mb-10"
      :class="{'justify-center': $vuetify.breakpoint.xlOnly}"
    >
      <v-col
        v-for="infographic in infographics"
        :key="infographic.id"
        cols="12"
        sm="12"
        md="4"
        lg="3"
        xl="2"
        class="ma-xl-4"
      >
        <v-card
          class="full-width"
        >
          <v-img
            :src="`/assets/Educational/Infographic/${infographic.logo}`"
            class="align-end"
            contain
            aspect-ratio="1"
            position="top center"
          >
            <v-card-title
              class="justify-center"
            >
              <div
                v-if="infographic.doi"
                class="d-flex align-center"
              >
                <Icon
                  item="DOI"
                  height="30"
                  wrapper-class=""
                  class="mr-2 width-35"
                />
                <a
                  :href="infographic.url"
                  target="_blank"
                  class="underline-effect font-weight-medium "
                  :class="{
                    'text-body-2 ': $vuetify.breakpoint.xs,
                    'text-subtitle-1': $vuetify.breakpoint.smOnly,
                    'text-body': $vuetify.breakpoint.mdOnly,
                    'fontSize18': $vuetify.breakpoint.mdAndUp,
                    'fontSize20': $vuetify.breakpoint.lg,
                    'text-h6': $vuetify.breakpoint.xl,
                  }"
                  style="word-break: initial;"
                >
                  {{ infographic.doi }}
                </a>
                <v-tooltip top>
                  <template #activator="{on, attrs }">
                    <span @click="copyURL(infographic)">
                      <v-icon
                        v-ripple
                        v-bind="attrs"
                        class="primary--text ml-2 cursor-pointer"
                        small
                        v-on="on"
                      >
                        fa fa-copy
                      </v-icon>
                    </span>
                  </template>
                  <span v-if="!infographic.copyButtonStatus"> Copy URL </span>
                  <span v-else> URL copied </span>
                </v-tooltip>
              </div>
              <h3
                v-else-if="infographic.text"
                style="word-break: initial;"
                class="grey--text text--darken-1"
              >
                {{ infographic.text }}
              </h3>
            </v-card-title>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
    <!-- hard-coded part -->
    <!--  subtitle  -->
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Across the research disciplines there are thousands of standards and several thousand databases, designed to assist the virtuous data cycle, from collection to annotation, through preservation and publication to subsequent sharing and reuse. As consumers of these standards and databases, it is often difficult to know which resources are the most relevant for your specific domain and needs. As producers, you want to be sure your standard or database is findable by prospective users, and recommended in data policies by funders, journals and other organisations.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      With our growing and interlinked content, functionalities and endorsements, FAIRsharing is the most comprehensive informative and educational resource of standards, databases and data policies and is here to help you!
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The FAIRsharing team works with and for the community to map the landscape of community-developed standards and to define the indicators necessary to monitor their:
    </p>
    <ul class="hardcoded-ul">
      <li>development, evolution and integration;</li>
      <li>implementation and use in databases; and</li>
      <li>adoption in data policies by funders, journals and other organisations.</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Whether you are a researcher, standard/database developer, funder, journal editor, librarian or data manager, FAIRsharing can help you understand which standards are mature and appropriate to your use case. By mapping the relationships between standards and the databases that implement them, or the policies that recommend them, FAIRsharing enables you to make an informed decision as to which standard or database to use or endorse.
    </p>
    <div class="d-flex justify-center">
      <img
        src="/assets/Educational/educational.svg"
        alt="educational"
        :width="$vuetify.breakpoint.lgAndDown?'70%':'60%'"
      >
    </div>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      FAIRsharing is a web-based, searchable portal of three interlinked registries, containing both in-house and crowd-sourced manually curated descriptions of <router-link
        to="/standards"
        class="underline-effect"
      >
        standards
      </router-link>, <router-link
        to="/databases"
        class="underline-effect"
      >
        databases
      </router-link> and data <router-link
        to="/policies"
        class="underline-effect"
      >
        policies
      </router-link>, combined with an integrated view across all three types of <router-link
        to="/search"
        class="underline-effect"
      >
        resource
      </router-link>. By registering your resource on FAIRsharing, you not only gain credit for your work, but you increase its visibility outside of your direct domain, so reducing the potential for unnecessary reinvention and proliferation of standards and databases.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      However, if you still cannot find what you are looking for, please <a
        href="mailto:contact@fairsharing.org"
        class="underline-effect"
      >email</a> us with your question and we will add it to this page.
    </p>
    <!-- dynamic part loading from JSON   -->
    <ul class="ul-no-padding">
      <li
        v-for="(educationItem,key,index) in education"
        :key="key+'_'+index"
      >
        <h2 class="primary--text">
          {{ key }}
        </h2>
        <ul>
          <li
            v-for="(item,title_key,title_index) in educationItem"
            :key="title_key+'_'+title_index"
            class="mb-5"
          >
            <h3 class="text-h5 mb-2">
              {{ title_key }}
            </h3>
            <v-expansion-panels
              v-model="selectedExpansion[title_key]"
              hover
              accordion
              class="my-5"
            >
              <v-expansion-panel
                v-for="(child_item,child_index) in item"
                :key="child_item.title+'_'+child_index"
              >
                <v-expansion-panel-header>
                  <!-- This html is from a safe source -->
                  <!-- eslint-disable vue/no-v-html -->
                  <a :href="`/educational#${child_item.anchorLink}`">
                    <h4
                      :id="child_item.anchorLink"
                      class="text-h6"
                      v-html="$sanitize(child_item.title)"
                    />
                  </a>
                  <!-- This html is from a safe source -->
                  <!-- eslint-disable vue/no-v-html -->
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <p
                    class="ma-0"
                    :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
                    v-html="$sanitize(child_item.desc)"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </li>
        </ul>
      </li>
    </ul>
    <!-- Infographics dialog box-->
    <v-dialog
      v-model="infographicPopup.show"
      class="pa-0"
      max-width="600"
      @click:outside="closeDialog"
    >
      <v-card
        class="full-width fill-height"
        tile
      >
        <v-img
          :src="`/assets/Educational/Infographic/${infographicPopup.data.logo}`"
          class="align-end infographicPopup"
          contain
          position="top center"
        >
          <v-card-actions class="justify-end closeInfoPopup">
            <v-btn
              x-small
              fab
              @click="closeDialog()"
            >
              <v-icon> fa-times </v-icon>
            </v-btn>
          </v-card-actions>
        </v-img>
        <v-card-title
          class="justify-center"
        >
          <div
            v-if="infographicPopup.data.doi"
            class="d-flex align-center"
          >
            <Icon
              item="DOI"
              height="30"
              wrapper-class=""
              class="mr-2 width-35"
            />
            <a
              :href="generateDoiLink(infographicPopup.data.doi)"
              target="_blank"
              class="underline-effect font-weight-medium "
              style="word-break: initial;"
            >
              {{ infographicPopup.data.doi }}
            </a>
            <v-tooltip top>
              <template #activator="{on, attrs }">
                <span @click="copyURL(infographicPopup.data)">
                  <v-icon
                    v-ripple
                    v-bind="attrs"
                    class="primary--text ml-2 cursor-pointer"
                    small
                    v-on="on"
                  >
                    fa fa-copy
                  </v-icon>
                </span>
              </template>
              <span v-if="!infographicPopup.data.copyButtonStatus"> Copy URL </span>
              <span v-else> URL copied </span>
            </v-tooltip>
          </div>
          <h3
            v-else-if="infographicPopup.data.text"
            style="word-break: initial;"
            class="grey--text text--darken-1"
          >
            {{ infographicPopup.data.text }}
          </h3>
        </v-card-title>
      </v-card>
    </v-dialog>
  </main>
</template>

<script>
  import Icon from "@/components/Icon";
  import educationData from '@/data/EducationData.json'
    export default {
      name: "Educational",
      components: {
        Icon
      },
      data: () => {
        return {
          education: educationData.education,
          infographics: educationData.infographics["data"],
          applyCss: false,
          selectedExpansion:{},
          infographicPopup:{
            data: {},
            show: false,
            loading: false
          }
        }
      },
      watch: {
        $route: {
          deep:true,
          handler() {
            this.applyCss = false
            this.$nextTick(() => {
              this.applyCss = true
            })
          }
        }
      },
      async created() {
        let _module = this;
        await _module.$nextTick();
        _module.applyCss = true
        Object.keys(this.education).forEach(item => {
          Object.keys(this.education[item]).forEach(obj => {
            let foundHash = this.education[item][obj].find(it => `#${it.anchorLink}` === this.$route.hash)
            if (foundHash) {
              let arr = Object.keys(this.education[item]).map((ob, index) => {
                return {
                  'index': index,
                  'value': ob.toString().split('.', 1).toString()
                }
              })
              const faqNumber = this.$route.hash.split('-', 1).toString().substr(4, 2)
              let key = Object.keys(this.education[item])[arr.find(item => item.value === faqNumber).index]
              this.selectedExpansion[key] = foundHash.index * 1
            }
          })
        })
        // update the UI padding and margin after DOM is fully loaded.
      },
      mounted() {
        this.generatePopup()
      },
      methods: {
        generateDoiLink(doi) {
          return `https://doi.org/${doi}`
        },
        copyURL(item) {
          navigator.clipboard.writeText(this.generateDoiLink(item.doi));
          this.infographics.forEach(e => e.copyButtonStatus = false)
          const itemClicked = this.infographics.filter(e => e.id === item.id)
          itemClicked[0].copyButtonStatus = !itemClicked[0].copyButtonStatus
        },
        generatePopup() {
          let _module = this;
          let hash = _module.$route.hash;
          hash = hash.substring(1)
          const hashArray = this.infographics.map(({hash}) => hash)
          const isHash = hashArray.includes(hash)
          if (isHash) {
            const hashInfographic = this.infographics.filter(e => e.hash === hash)
            _module.infographicPopup = {
              data: hashInfographic[0],
              show: true,
              loading: true
            };
          }
        },
        closeDialog(){
          let _module = this;
          _module.infographicPopup.data = {};
          _module.infographicPopup.show = false;
          _module.infographicPopup.show = false;
          _module.$router.replace({hash: ""});
        }
      }
    }
</script>

<style scoped lang="scss">
li {
  line-height: 1.6;
}

ul,li {
  padding: 0;
}
.hardcoded-ul {
  li::before {
    display: inline-block;
    content: '';
    -webkit-border-radius: 0.375rem;
    border-radius: 0.375rem;
    -moz-border-radius: 0.375rem;
    height: 0.4rem;
    width: 0.4rem;
    margin-right: 0.5rem;
    background-color: black;
  }
}

mark {
  background: lightgrey;
  color: #636363;
  padding: 2px;
}

.ul-no-padding {
  padding: 0;
}

P {
  white-space: break-spaces;
}

.v-expansion-panel-header {
  min-height: 0;
}
.fontSize20 {
  font-size: 20px
}

.fontSize18 {
  font-size: 18px
}

.closeInfoPopup {
  position: absolute;
  top: 0;
  right: 0
}
.infographicPopupImage {
  height: 100%;
}

</style>
