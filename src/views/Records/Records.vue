<template>
  <v-main>
    <h1 class="d-none">
      Content
    </h1>
    <transition name="fade">
      <jump-to-top
        v-if="scrollStatus"
        target-object="scroll-target"
      />
    </transition>
    <v-container
      id="scroll-target"
      fluid
      class="overflow-y-auto overflow-x-hidden content-custom "
    >
      <!-- Title banner -->
      <div>
        <section
          id="banner"
          class="secondary"
        >
          <h1 class="text-center white--text">
            {{ getTitle }}
          </h1>
          <p class="text-center white--text">
            {{ recordsSubTitles[getTitle] }}
          </p>
        </section>
      </div>

      <!-- Search Box -->
      <div class="d-flex flex-row align-center mt-1  mr-2 ml-2">
        <v-text-field
          v-model="searchTerm"
          solo
          single-line
          clearable
          placeholder="Can't find what you'r looking for?! search through all data"
        />
        <v-btn
          color="primary"
          outlined
          height="52px"
          class="mt-1 ml-2"
        >
          <v-icon>search</v-icon>
          <span>Search</span>
        </v-btn>
      </div>
      <!--advanced Search button  -->
      <div class="text-right">
        <v-btn
          text
          small
          class="button-text-color"
          to="/advanced-search"
        >
          Advanced
        </v-btn>
      </div>

      <!--  Content  -->
      <v-row
        no-gutters
      >
        <v-col
          cols="12"
          lg="4"
          md="4"
          xl="3"
          class="d-none d-md-flex mt-2 ml-2"
        >
          <SearchInput
            :class="[responsiveClassObject]"
          />
          <!--                    <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">-->
        </v-col>
        <v-col class="mt-2">
          <SearchOutput
            v-scroll:#scroll-target="onScroll"
            class="pb-5 mr-0 mr-md-2"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
    import SearchInput from "@/components/Records/Search/Input/SearchInput";
    import SearchOutput from "@/components/Records/Search/Output/SearchOutput";
    import {mapActions, mapState} from 'vuex'
    import JumpToTop from "@/components/Navigation/jumpToTop";
    import recordsLabels from "@/data/recordsTypes.json"

    export default {
        name: "Records",
        components: {JumpToTop, SearchOutput, SearchInput},
        data: () => ({
            searchTerm: '',
            offsetTop: 0,
            stickToLeft: false,
            bodyOverflowActive: true,
            hideOverflow: 'overflow-hidden',
            showHeader: true,
            showDrawerLeft: false,
            labels: recordsLabels,
            recordsSubTitles: recordsLabels['recordSubTitles'],
            recordTypes: recordsLabels['recordTypes']
        }),
        computed: {
            ...mapState('uiController', ['scrollStatus']),
            getTitle: function () {
                const flipRecordTypes = Object.entries(this.recordTypes).reduce(
                    (obj, [key, value]) => ({...obj, [value]: key}),
                    {}
                );
                let title = "Search";
                if (Object.prototype.hasOwnProperty.call(this.$route.query, 'fairsharingRegistry')) {
                    if (Object.prototype.hasOwnProperty.call(flipRecordTypes, this.$route.query.fairsharingRegistry)) {
                        title = flipRecordTypes[this.$route.query.fairsharingRegistry];
                    }
                }
                return title;
            },
            responsiveClassObject: function () {
                return {
                    'left-panel-fixed-lg': this.stickToLeft && this.$vuetify.breakpoint.xlOnly,
                    'left-panel-default-lg': !this.stickToLeft && this.$vuetify.breakpoint.xlOnly,
                    'left-panel-default': !this.stickToLeft && !this.$vuetify.breakpoint.xlOnly,
                    'left-panel-fixed': this.stickToLeft && !this.$vuetify.breakpoint.xlOnly
                }
            },
            currentPath: function () {
                let title = this.$route.path.replace('/', '');
                const client = this;
                let queryParams = {};
                Object.keys(this.$route.query).forEach(function (prop) {
                    let queryVal = client.$route.query[prop];
                    if (queryVal) {
                        queryParams[prop] = decodeURI(queryVal);
                    }
                });
                if (this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]) {
                    title = this.recordTypes[title.charAt(0).toUpperCase() + title.slice(1)]
                }
                else title = title.charAt(0).toUpperCase() + title.slice(1);
                return [title, queryParams];
            },
        },
        watch: {
            currentPath: async function () {
                await this.tryRedirect();
                await this.getData();
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                await this.tryRedirect();
                await this.getData();
            });
        },
        created() {
            this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                bodyOverflowState: true,
                drawerVisibilityState: false,
                headerVisibilityState: true,
            });

        },
        destroyed() {
            this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                bodyOverflowState: false,
                drawerVisibilityState: false,
                headerVisibilityState: true,
            });
        },
        methods: {
            ...mapActions('records', ['fetchRecords']),
            ...mapActions({setScrollStatusLocal: 'uiController/setScrollStatus'}),
            onScroll: function (e) {
                let _module = this;
                _module.offsetTop = e.target.scrollTop;
                if (_module.offsetTop > 125) {
                    _module.stickToLeft = true;
                    _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                        bodyOverflowState: true,
                        headerVisibilityState: false,
                    });

                } else {
                    _module.stickToLeft = false;
                    _module.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                        bodyOverflowState: true,
                        drawerVisibilityState: false,
                        headerVisibilityState: true,
                    });
                }
                _module.offsetTop > 500 ? _module.setScrollStatusLocal(true) :
                    _module.setScrollStatusLocal(false);
            },
            /**
             * Try to redirect to search of the page that is hit is /standards /databases
             * /policies or /collections
             * */
            tryRedirect: async function () {
                if (Object.keys(this.recordTypes).includes(this.$route.name)) {
                    let fairsharingRegistry = this.recordTypes[this.$route.name];
                    let query = this.$route.params;
                    if (query) {
                        query.fairsharingRegistry = fairsharingRegistry;
                        try {
                            this.$router.push({
                                name: "search",
                                query: query
                            });
                        } catch (e) {
                            //
                        }
                    }
                }
            },
            /** This methods get the data from the client.
             * @returns {Promise}
             */
            getData: async function () {
                window.scrollTo(0, 0);
                this.errors = null;
                const _module = this;
                try {
                    await _module.fetchRecords(this.getParameters());
                } catch (e) {
                    this.errors = e.message;
                }
            },
            /**
             * Get the parameters that are allowed for this query
             * @returns {Object} parameters - parameters and types allowed for this query
             */
            getParameters: function () {
                return this.$store.getters["introspection/buildQueryParameters"](this.currentPath);
            },
        },
        /**
         * Setting up the metaInfo of the page
         * @returns {{title: String}}
         * */
        metaInfo() {
            return {
                title: 'FAIRsharing | ' + this.getTitle
            }
        },
    }
</script>

<style scoped lang="scss">
    .left-panel-fixed {
        position: fixed;
        top: 0;
        width: 32vw;
    }

    .left-panel-default {
        position: relative;
        width: 32vw;
        height: 100%;
    }

    .left-panel-fixed-lg {
        position: fixed;
        top: 0;
        width: 24vw;
    }

    .left-panel-default-lg {
        position: relative;
        width: 24vw;
        height: 100%;
    }

    .content-custom {
        max-height: 100vh;
        scroll-behavior: smooth;
        padding: 0;
    }

    #banner {
        display: flex;
        justify-content: center;
        flex-direction: column;
        padding: 1em;
    }

    .v-input {
        height: 42px;
    }

</style>
