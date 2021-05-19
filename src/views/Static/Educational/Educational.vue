<template>
  <main class="pa-15 mb-10">
    <!-- hard-coded part -->
    <!--  title  -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Educational
    </h1>
    <!--  subtitle  -->
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Across the research disciplines there are thousands of standards and several thousand databases, designed to assist the virtuous data cycle, from collection to annotation, through preservation and publication to subsequent sharing and reuse. As consumers of these standards and databases, it is often difficult to know which resources are the most relevant for your specific domain and needs. As producers, you want to be sure your standard or database is findable by prospective users, and recommended in data policies by funders, journals and other organizations.
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
      <li>adoption in data policies by funders, journals and other organizations.</li>
    </ul>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Whether you are a researcher, standard/database developer, funder, journal editor, librarian or data manager, FAIRsharing can help you understand which standards are mature and appropriate to your use case. By mapping the relationships between standards and the databases that implement them, or the policies that recommend them, FAIRsharing enables you to make an informed decision as to which standard or database to use or endorse.
    </p>
    <div class="d-flex justify-center">
      <img
        src="assets/Home/BlockCategories/educational.png"
        alt="educational"
        width="60%"
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
        :key="index"
      >
        <h2 class="primary--text">
          {{ key }}
        </h2>
        <ul>
          <li
            v-for="(item,title_key,title_index) in educationItem"
            :key="title_index"
            class="mb-5"
          >
            <h3 class="text-h5 mb-2">
              {{ title_key }}
            </h3>
            <ul>
              <li
                v-for="(child_item,child_index) in item"
                :key="child_index"
              >
                <!-- This html is from a safe source -->
                <!-- eslint-disable vue/no-v-html -->
                <h4
                  class="text-h6"
                  v-html="child_item.title"
                />
                <!-- This html is from a safe source -->
                <!-- eslint-disable vue/no-v-html -->
                <p
                  class="ma-0"
                  :class="['mb-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
                  v-html="child_item.desc"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>

<script>
  import {education} from '@/data/EducationData.json'
    export default {
        name: "Educational",
        data:()=>{
          return {
            education:education
          }
        }
    }
</script>

<style scoped lang="scss">
li {
  line-height: 1.6;
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
</style>
