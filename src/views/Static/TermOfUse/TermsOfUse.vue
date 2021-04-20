<template>
  <main class="pa-15 mb-10">
    <!--  title  -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ TermsOfUse.title }}
    </h1>
    <!--  subtitle  -->
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      {{ TermsOfUse.subTitle }}
    </p>

    <!--  bullet points  -->
    <ul class="mb-10">
      <li
        v-for="(bulletPoint,index) in TermsOfUse.bullet_points"
        :key="index"
        class="mb-4"
      >
        {{ bulletPoint }}
      </li>
    </ul>

    <!--  contact points  -->
    <div>
      <p
        :class="['mb-4 lato-font-medium d-inline-block mr-2 lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        The administrative and security contact for this AUP is:
      </p><a :href="`mailto:${TermsOfUse.admin_contact}`">{{ TermsOfUse.admin_contact }}</a>.
    </div>

    <div>
      <p
        :class="['mb-4 lato-font-medium d-inline-block mr-2 lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        The privacy statements (e.g. Privacy Notices) are located at:
      </p><a
        class="underline-effect"
        target="_blank"
        :href="TermsOfUse.privacy_statements"
      >{{ TermsOfUse.privacy_statements }}</a>.
    </div>
    <div>
      <p
        :class="['mb-4 lato-font-medium d-inline-block mr-2 lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      >
        API use and data License statements are located at:
      </p><a
        class="underline-effect"
        target="_blank"
        :href="TermsOfUse.api_usage"
      >{{ TermsOfUse.api_usage }}</a>.
    </div>
  </main>
</template>

<script>
import {termsOfUse} from '@/data/TermsofUseData.json'
    export default {
      name: "TermsOfUse",
      data: () => {
        return {
          TermsOfUse :termsOfUse
        }
      }
    }
</script>

<style scoped lang="scss">
li {
  line-height: 1.6;
}

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

</style>
