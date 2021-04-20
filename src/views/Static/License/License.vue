<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Data sharing license and attribution, via the web and API
    </h1>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Except where otherwise noted, content on this site is licensed under a <a
        href="https://creativecommons.org/licenses/by-sa/4.0/legalcode"
        target="_blank"
      >Creative Commons Attribution and Share-alike (CC-BY-SA) International 4.0</a> license.
    </p>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      In addition, we request that any data taken from FAIRsharing, either by the API, scraping the site or other means, is attributed and cited appropriately. We request that a link and the FAIRsharing logo is presented next to the data taken from FAIRsharing.
      For details of how to use the FAIRsharing API please visit <router-link
        to="/API_doc"
        class="underline-effect"
      >
        https://fairsharing.org/API_doc
      </router-link>
    </p>
    <v-img
      src="@/assets/fairsharing-logo.svg"
      height="70"
      contain
      class="text-left pa-0 d-inline-block"
    />
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The code below may be used to create a link to our logo.
    </p>
    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Search Engines
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      We encourage search engines to index FAIRsharing and provide mechanisms for this. We are also involved in the <a
        href="https://schema.org/"
        target="_blank"
      >schema.org</a> and the <a
        href="https://bioschemas.org/"
        target="_blank"
      >BioSchemas</a> projects, extending the vocabulary of tags to annotate our content. We will mark up FAIRsharing content with these tags in the near future.
    </p>
    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Screen Scraping
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
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

mark {
  background: lightgrey;
  color: #636363;
  padding: 2px;
}
</style>
