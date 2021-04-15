<template>
  <main class="pa-5 mt-5 mb-10">
    <!--  title  -->
    <h1 class="text-h4 mb-2">
      {{ TermsOfUse.title }}
    </h1>
    <!--  subtitle  -->
    <p class="text-h6 mb-8">
      {{ TermsOfUse.subTitle }}
    </p>

    <!--  bullet points  -->
    <ul class="mb-10">
      <li
        v-for="(bulletPoint,index) in TermsOfUse.bullet_points"
        :key="index"
        class="mb-4"
      >
        <span class="mr-2">{{ index+1 }}-</span>
        {{ bulletPoint }}
      </li>
    </ul>

    <!--  contact points  -->
    <div>
      <p class="d-inline-block mr-2">
        The administrative and security contact for this AUP is:
      </p><a :href="`mailto:${TermsOfUse.admin_contact}`">{{ TermsOfUse.admin_contact }}</a>.
    </div>
    <div>
      <p class="d-inline-block mr-2">
        The privacy statements (e.g. Privacy Notices) are located at:
      </p><a
        class="underline-effect"
        target="_blank"
        :href="TermsOfUse.privacy_statements"
      >{{ TermsOfUse.privacy_statements }}</a>.
    </div>
    <div>
      <p class="d-inline-block mr-2">
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
  margin-bottom: 5px;
}
</style>
