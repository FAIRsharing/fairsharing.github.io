<template>
    <v-content>
        <h1 class="d-none">
            Content
        </h1>
        <transition name="fade">
            <jump-top target-object="scroll-target" v-if="showScrollToTopButton"/>
        </transition>
        <v-container fluid
                     class="overflow-y-auto overflow-x-hidden content-custom "
                     id="scroll-target"
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
                        solo
                        single-line
                        clearable
                        v-model="searchTerm"
                        :placeholder="`Can't find what you'r looking for?! search through all data`"
                ></v-text-field>
                <v-btn color="primary" outlined height="52px" class="mt-1 ml-2">
                    <v-icon>search</v-icon>
                    <span>Search</span>
                </v-btn>
            </div>
            <!--advanced Search button  -->
            <div class="text-right">
                <v-btn text small class="button-text-color" to="/advanced-search">Advanced</v-btn>
            </div>
            <!--  Content  -->
            <v-row no-gutters
            >
                <v-col cols="12" lg="4" md="4" xl="3" class="d-none d-md-flex mt-2 ml-2">
                    <LeftPanel
                            :class="[responsiveClassObject]"/>
                    <!--                    <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">-->

                </v-col>
                <v-col class="mt-2">
                    <RightContentStackList
                            v-scroll:#scroll-target="onScroll"
                            class="pb-5 mr-0 mr-md-2"
                    />
                </v-col>
            </v-row>
        </v-container>
    </v-content>
</template>

<script>
    import LeftPanel from "@/components/LeftPanel";
    import JumpTop from "@/components/jumpToTop";
    import RightContentStackList from "../components/RightContentList";

    export default {
        name: "Records",
        components: {RightContentStackList, JumpTop, LeftPanel},
        data: () => ({
            searchTerm: '',
            offsetTop: 0,
            stickToLeft: false,
            bodyOverflowActive: true,
            hideOverflow: 'overflow-hidden',
            showScrollToTopButton: false,
            showHeader: true,
            showDrawerLeft: false,
            recordsSubTitles: {
                Standards: "The standards in FAIRsharing are manually curated from a variety of sources, including BioPortal, " +
                    "MIBBI and the Equator Network.",
                Collections: "Collections group together one or more types of resource (standard, database or policy) by " +
                    "domain, project or organisation. A Recommendation is a core-set of resources that are selected or " +
                    "endorsed by data policies from journals, funders or other organizations.",
                Databases: "A catalogue of databases, described according to the BioDBcore guidelines, along with the standards " +
                    "used within them; partly compiled with the support of Oxford University Press (NAR Database Issue " +
                    "and DATABASE Journal).",
                Policies: "FAIRsharing policies: A catalogue of data preservation, management and sharing policies from " +
                    "international funding agencies, regulators and journals.",
                Search: "Search the FAIRsharing records using advanced filtering"
            },
        }),
        created() {
            // change the overflow to have Records behavior scroll
            this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                bodyOverflowState: true,
                drawerVisibilityState: false,
                headerVisibilityState: true,
            });
        },
        destroyed() {
            // change the overflow to have normal behavior of main scroll and having header
            this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                bodyOverflowState: false,
                drawerVisibilityState: false,
                headerVisibilityState: true,
            });
        },
        methods: {
            onScroll: function (e) {
                let _module = this;
                _module.offsetTop = e.target.scrollTop;
                if (_module.offsetTop > 125) {
                    _module.stickToLeft = true;
                    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                        bodyOverflowState: true,
                        headerVisibilityState: false,
                    });
                } else {
                    _module.stickToLeft = false;
                    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                        bodyOverflowState: true,
                        headerVisibilityState: true,
                    });
                }
                _module.offsetTop > 500 ? _module.showScrollToTopButton = true : _module.showScrollToTopButton = false;
            }
        },
        computed: {
            getTitle: function () {
                return 'Standards';
            },
            responsiveClassObject: function () {
                return {
                    'left-panel-fixed-lg': this.stickToLeft && this.$vuetify.breakpoint.xlOnly,
                    'left-panel-default-lg': !this.stickToLeft && this.$vuetify.breakpoint.xlOnly,
                    'left-panel-default': !this.stickToLeft && !this.$vuetify.breakpoint.xlOnly,
                    'left-panel-fixed': this.stickToLeft && !this.$vuetify.breakpoint.xlOnly
                }
            }
        }
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