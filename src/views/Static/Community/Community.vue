<template>
  <main :class="applyCss?'pa-15 mb-10':''">
    <!--  main_title_2 -->
    <!-- eslint-disable vue/no-v-html -->
    <h1>Community: adopters, activities and governance</h1>
    <h2>
      FAIRsharing is a community-driven resource with a growing number of users and collaborators,
      all working to enable the FAIR Principles and to make standards, databases and policies FAIR.
    </h2>

    <!-- Adopters, activities, Governance tabs-->
    <v-container class="my-10">
      <v-row
        class="block-category"
      >
        <v-col
          v-for="(tab,index) in contentTabs"
          :key="tab.name+'_'+index"
          cols="12"
          sm="12"
          md="4"
          lg="4"
        >
          <v-card
            class="mx-auto block-category__card cursor-pointer"
            max-width="350"
            height="300"
            @click="jumpToAnchor(tab.name.toLowerCase())"
          >
            <div class="white--text d-flex flex-column justify-center block-category__card__gradient">
              <div
                style="height: 136px"
                class="d-flex justify-center"
              >
                <v-icon
                  size="80"
                  color="white"
                  style="opacity: .7"
                >
                  {{ $vuetify.icons.values[tab.icon].icon }}
                </v-icon>
              </div>
              <v-card-title class="d-inline text-h4 text-center text-md-h5 text-lg-h4">
                {{ tab.name }}
              </v-card-title>
            </div>
            <v-card-text
              class="text--primary text-justify"
            >
              <p class="text-center">
                {{ tab.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A selection of official reports from funders and other organizations that recommend the use of FAIRsharing as a key asset for all stakeholders to enable FAIR data:
    </p>

    <!--  External Links  -->
    <v-row
      class="mt-2"
    >
      <v-col
        v-for="(item,index) in externalLinks"
        :key="index+'_'+item.titleLink"
        cols="12"
        md="12"
        lg="4"
        :class="['pa-5 links',{'max-width-32-percent':$vuetify.breakpoint.mdAndUp}]"
      >
        <a
          :href="item.titleLink"
          target="_blank"
        >
          <p
            :class="['mb-0 lato-font-medium lato-text-sm underline-effect',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
          >
            {{ item.title }}
          </p>
        </a>
        <p
          :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        >
          {{ item.text }}
        </p>
      </v-col>
    </v-row>

    <!--  content  -->


    <!-- Adopters   -->
    <section id="adopters">
      <h3 class="text-h4 mb-4">
        Adopters
      </h3>
      <p
        :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        Anyone can use FAIRsharing. Adopters, however, use FAIRsharing specifically to:
      </p>
      <ul>
        <li><b class="mr-4">i:</b>Educate their users/community on the variety of existing standards, repositories and policies, and actively encourage them to submit/claim records, where relevant;</li>
        <li>
          <b class="mr-3">ii:</b>Recommend resources by registering their data policy, and then link it to standards and/or databases
          <router-link
            to="/search?isRecommended=true"
            target="_blank"
            class="underline-effect"
          >
            recommended
          </router-link> in the policy; and/or
        </li>
        <li>
          <b class="mr-2">iii:</b>Create a <router-link
            to="/collections"
            target="_blank"
            class="underline-effect"
          >
            Collection
          </router-link> by pulling together a list of standards and/or databases around a given domain of interest relevant to them.
        </li>
      </ul>
      <p
        :class="['mb-0 mt-2 mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        If you wish to create a new metadata record on FAIRsharing, you can find <router-link to="/new">
          instructions
        </router-link> here.
      </p>
      <p
        :class="['mb-0 mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        Adopters are generally representatives of institutions, libraries, journal publishers, infrastructure programmes, societies and other organizations or projects that in turn serve and guide individual researchers or other stakeholders on research data management matters.
      </p>
      <p
        :class="['mb-0 mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        Adopters display a FAIRsharing logo on their websites with a link from their website to our homepage.
      </p>
      <b
        :class="['mb-0 mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        We cannot list all of our adopters, but we've listed here some publishers that use FAIRsharing to define and refine their data policy.
      </b>
      <!--Adopter table-->
      <v-simple-table class="mb-16 mt-2">
        <template #default>
          <thead>
            <tr>
              <th
                v-for="(tab,index) in tables.adopterTable.tabs"
                :key="`${tab}_${index}`"
                class="text-left white--text"
                bgcolor="#27aae1"
              >
                <b class="text-capitalize text-h6">{{ tab }}</b>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,index) in tables.adopterTable.data"
              :key="`${item.adopter}_${index}`"
            >
              <td
                class="text-left border-bottom"
              >
                <v-img
                  v-if="item.image"
                  max-width="250px"
                  max-height="250px"
                  :src="item.image"
                  height="120"
                  contain
                  style="filter: grayscale(1);"
                />
              </td>
              <td
                v-if="item.adopter"
                class="border-bottom border-left"
              >
                {{ item.adopter }}
              </td>
              <td class="border-bottom border-left">
                <router-link
                  v-if="item.associatedLink"
                  target="_blank"
                  :to="item.associatedLink"
                  class="underline-effect"
                >
                  {{ item.associated }}
                </router-link>
                <a
                  v-if="item.externalLink"
                  :href="item.externalLink"
                  target="_blank"
                  class="underline-effect"
                >
                  {{ item.associated }}
                </a>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!--Global Organisation table-->
      <p class="text-h6 mt-16">
        Other Organisations
      </p>
      <ul
        style="display: flex; flex-wrap: wrap; list-style-type: none;"
      >
        <li
          v-for="(item,index) in tables.globalOrganisationTable.data"
          :key="`${item.adopter}_${index}`"
          class="text-center pa-10"
        >
          <a
            v-if="item.externalLink"
            :href="item.externalLink"
            target="_blank"
          >
            <v-img
              v-if="item.image"
              max-width="250px"
              max-height="250px"
              :src="item.image"
              height="120"
              contain
              style="filter: grayscale(1);"
            />

          </a>
        </li>
      </ul>
    </section>

    <!-- Activities   -->
    <section id="activities">
      <h3 class="text-h4 mb-4">
        Activities
      </h3>
      <p
        :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        FAIRsharing is not just a registry. The team behind FAIRsharing is involved in a number of FAIR-enabling activities, delivering guidance, tools and services with and for a variety of stakeholders. As these activities mature, we will implement or connect them in/to the FAIRsharing resource itself.
      </p>
      <p
        :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        Some of these activities are part of funded projects and of national or international consortia, while others are volunteer efforts that fall under a variety of umbrella organisations, such as working groups (WG) and learned societies.
      </p>
      <b
        :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        Our activities are classified using the three GO-FAIR pillar structures (change, build, train) and are outlined here.
      </b>
      <!--Activities table-->
      <ActivitiesStaticTable class="mb-16 mt-2" />
    </section>


    <!-- Governance   -->
    <section id="governance">
      <h3 class="text-h4 mb-4">
        Governance
      </h3>
      <!--   Meet the team   -->
      <h4 class="text-h5 mb-2">
        {{ meettheteam.title }}
      </h4>
      <p
        :class="['mb-5 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="$sanitize(meettheteam.description)"
      />
      <ul class="d-flex flex-wrap pl-0">
        <li
          v-for="(profileItem,index) in meettheteam.profiles"
          :key="`${profileItem}_${index}`"
          :class="['text-center width-250 height-400 mb-10',$vuetify.breakpoint.mdAndDown?'mx-auto':'']"
        >
          <v-avatar size="160">
            <v-img
              :src="profileItem.profileImg"
              style="filter: grayscale(1);"
            />
          </v-avatar>
          <a
            class="text-center lato-font-bold mt-2 ma-0"
            style="font-size: 1.5rem;min-height: 80px;display: flex;flex-direction: column;"
            v-html="$sanitize(profileItem.name)"
          />
          <i class="small d-block height-75">
            {{ profileItem.role }}
          </i>
          <div class="text-center mt-2 d-flex justify-center">
            <span
              v-for="(socialItem,socialIndex) in profileItem.social"
              :key="`${socialItem}_${socialIndex}`"
            >
              <a
                class="pr-2"
                :href="socialItem.link.includes('@')?`mailto:${socialItem.link}`:socialItem.link"
                target="_blank"
              >
                <Icon
                  class="mr-1"
                  :item="socialItem.icon"
                  :height="25"
                  size="30"
                  wrapper-class=""
                />
              </a>
            </span>
          </div>
        </li>
      </ul>
      <!--  Advisory Board   -->
      <div
        v-for="(governanceItem,key,index) in governance"
        :key="Object.keys(governanceItem)[index]+'_'+'index'"
      >
        <div class="mb-10">
          <h4 class="text-h5 mb-8">
            {{ key }}
          </h4>
          <div
            v-for="(item,itemIndex) in governanceItem"
            :key="item.title+'_'+itemIndex"
            class="ml-8"
          >
            <div class="mb-5">
              <h4 class="text-h5">
                {{ item.title }}
              </h4>
              <ul :class="['mt-2',{'column-count':$vuetify.breakpoint.mdAndUp}]">
                <li
                  v-for="(itemData,itemDataIndex) in item.data"
                  :key="itemData+'_'+itemDataIndex"
                  class="mb-1"
                >
                  <p
                    class="ma-0"
                    v-html="$sanitize(itemData)"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- eslint-enable vue/no-v-html -->
  </main>
</template>

<script>
/**
* All static pages will be handle through this namespace
* @namespace Static
*/
import ActivitiesStaticTable from "@/components/Static/Community/ActivitiesStaticTable";
import {externalLinks, contentTabs, tables, governance, meettheteam} from "@/data/communityPageData.json"
import Icon from "@/components/Icon";

/** This component handles the sign-up/register page
* @memberOf Static
* @name Community
* @type module
* @instance
* */
export default {
  name: "Community",
  components: {Icon, ActivitiesStaticTable},
  title: "This will be the community page",
  data: () => {
    return {
      applyCss: false,
      currentAnchor:'',
      externalLinks,
      contentTabs,
      tables,
      governance,
      meettheteam,
      Icon
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
  created() {
    this.$nextTick(() => {
      // update the UI padding and margin after DOM is fully loaded.
      this.applyCss = true
    })
  },
  methods: {
    jumpToAnchor(selectedAnchor) {
      if (selectedAnchor !== this.currentAnchor) {
        this.$router.push({hash: `${selectedAnchor}`});
        this.currentAnchor = selectedAnchor;
      }
    }
  }
}
</script>

<style scoped lang="scss">
.links {
  border: 1px #d4d4d4 solid;
  margin: 2px;
}

.block-category {
  &__card {
    transition: all .2ms ease;
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradient {
      height: 200px;
      background: rgb(171, 171, 171);
      background: linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -webkit-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -o-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -ms-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
    }
  }
}

.v-divider {
  margin: 8px;
}

.border-bottom {
  border-bottom: 1px solid #ECF0F1 !important;
}

.border-left {
  border-left: 1px solid #ECF0F1 !important;
}

a:hover {
  div {
    transform: scale(1.1);
    -moz-transform: scale(1.1);
    -webkit-transform: scale(1.1);
    -o-transform: scale(1.1);
  }
}
td {
  font-size: 1rem!important;
}

.column-count {
  column-count:2;
  -moz-column-count: 2;
  -webkit-column-count: 2;
}


</style>
