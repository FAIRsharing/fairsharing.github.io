<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      Data sharing license and attribution, via the web and API
    </h1>

    <p
      :class="['mb-4 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      Except where otherwise noted, content on this site is licensed under a Creative Commons Attribution and Share-alike (CC-BY-SA) International 4.0 license.
    </p>
    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      In addition, we request that any data taken from FAIRsharing, either by the API, scraping the site or other means, is attributed and cited appropriately. We request that a link and the FAIRsharing logo is presented next to the data taken from FAIRsharing.
    </p>
    <v-img
      src="@/assets/fairsharing-logo.svg"
      height="70"
      contain
      class="text-left pa-0 d-inline-block"
    />
    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      The code below may be used to create a link to our logo.
    </p>
    <pre
      class="mt-2 mb-8"
      v-text="`<img src='https://fairsharing.org/static/img/home/svg/FAIRsharing-logo.svg' alt='FAIRsharing Logo'>`"
    />

    <h2 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      API Access
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      The FAIRsharing API is available at <a
        href="fairsharing.org/api"
        target="_blank"
        class="underline-effect"
      >fairsharing.org/api</a>, where Swagger documentation is provided. We are redeveloping the FAIRsharing site and are migrating to a new data model. In light of this, we are temporarily unable to provide access to our API to new applicants.
    </p>

    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      API Version
    </h3>
    <p
      :class="['mb-0 lato-font-medium lato-text-md font-italic',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      The API version is currently <b>v0.3</b>. Versions <b>v0.2</b> and <b>v0.1</b> are also available. The version may be specified in the Accept headers as follows:
    </p>

    <pre
      class="mt-2 mb-8"
      v-text="`curl -X GET --header 'Accept: application/json; version=v0.2' --header 'Api-Key: YOUR_KEY_HERE' 'https://fairsharing.org/api/all/summary/'`"
    />

    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      If the verison number is not specified in your request (e.g. if you are <a
        href="https://fairsharing.org/api"
        target="_blank"
        class="underline-effect"
      >trying out</a> our API) then it will default to the newest version.
    </p>

    <h3 class="text-h6 text-xl-h5 mt-4 mb-2">
      API Changes
    </h3>
    <h4>v0.3</h4>
    <p :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]">
      Removed the following fields:
    </p>
    <ul>
      <li>Old-style domain tags (domains).</li>
    </ul>
    <p :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]">
      Added the following fields:
    </p>
    <ul class="mb-4">
      <li>New ontology-based domains (onto_domains).</li>
      <li>New ontology-based disciplines (onto_disciplines).</li>
      <li>User-defined tags (user_defined_tags).</li>
    </ul>

    <h4>v0.2</h4>
    <p :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]">
      Removed the following fields:
    </p>
    <ul>
      <li>Record maintainers for all record types (maintains).</li>
      <li>Last updater of record (updated_by).</li>
    </ul>
    <p :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]">
      Added the following fields:
    </p>
    <ul>
      <li>API version (api_version).</li>
    </ul>

    <h2 class="text-h4 mt-5 text-xl-h3 mb-2 mb-xl-6">
      Search Engines
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      We encourage search engines to index FAIRsharing and provide mechanisms for this. We are also involved in the <a
        href="https://schema.org/"
        target="_blank"
      >schema.org</a> and the BioSchemas projects, extending the vocabulary of tags to annotate our content. We will mark up FAIRsharing content with these tags in the near future.
    </p>

    <h2 class="text-h4 mt-5 text-xl-h3 mb-2 mb-xl-6">
      Screen Scraping
    </h2>

    <p
      :class="['mb-0 lato-font-medium lato-text-md',{'lato-text-lg':$vuetify.breakpoint.xlOnly }]"
    >
      Please do not scrape the HTML page content. Much of the data is generated dynamically and is updated daily. Instead, please use our API or contact us directly and ask for a cut of the data. We're friendly and don't bite.
    </p>
  </main>
</template>

<script>
    export default {
        name: "License"
    }
</script>

<style scoped>
pre {
  padding: 9px;
  margin: 0 0 10px;
  font-size: 15px;
  font-family: monospace;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  -moz-border-radius: 4px;
  -webkit-border-radius: 4px;
}

li{
  font-size: 1.2rem;
  line-height: 1.6;
}
li::before {
  display: inline-block;
  content: '';
  -webkit-border-radius: 0.375rem;
  border-radius: 0.375rem;
  height: 0.4rem;
  width: 0.4rem;
  margin-right: 0.5rem;
  background-color: black;
}

</style>
