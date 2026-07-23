<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h2 class="text-h4 text-xl-h3 mb-2 mb-xl-6">FAIRsharing Documentation</h2>

    <p
      :class="[
        'mb-4 lato-font-medium lato-text-sm',
        { 'lato-text-md': $vuetify.display.xlOnly },
      ]"
    >
      This page contains links to various FAIRsharing documentation resources. Please refer to the links below and to our <a href="https://fairsharing.gitbook.io/">general Gitbook documentation</a> for both user-facing and machine-actionable options to access, discover, and edit FAIRsharing records.
      If you encounter any issues with the API,
      please email
      <a
        class="underline-effect"
        href="mailto:contact@fairsharing.org"
        target="_blank"
        >contact@fairsharing.org</a
      >
      to discuss your requirements.
    </p>

    <ul
      :class="[
        'mb-4 lato-font-medium lato-text-sm',
        { 'lato-text-md': $vuetify.display.xlOnly },
      ]"
    >
      <li>
      Programmatic access: Learn about the different ways to access FAIRsharing programmatically, including the REST API, OAI-PMH, content negotiation and machine-readable metadata. https://fairsharing.gitbook.io/fairsharing/programmatic-access/fairsharing-data-access
</li>
<li>
Data schema: Explore the FAIRsharing application schema, which documents the underlying data model used to structure FAIRsharing records and support programmatic access. https://doi.org/10.5281/zenodo.6875035
</li>
<li>
Licensing: View the licence terms governing the reuse of FAIRsharing data and programmatic access through the FAIRsharing API. https://fairsharing.org/licence
</li>
<li>
GitHub repositories: Access FAIRsharing's open source repositories, including:
<ul>
<li>FAIR-Tests, a framework for community-developed FAIR assessment tests: https://github.com/FAIRsharing/FAIR-Tests
</li><li>
FAIRsharing-Scripts, supporting FAIRsharing curation and analysis workflows: https://github.com/FAIRsharing/FAIRsharing-Scripts
</li><li>
fairsharing.github.io, the source repository for the FAIRsharing website: https://github.com/FAIRsharing/fairsharing.github.io
</li></ul>
</li>
<li>
Documentation: Browse the FAIRsharing documentation, including user guides, API documentation and developer resources. [https://fairsharing.gitbook.io/fairsharing/](https://fairsharing.gitbook.io/fairsharing/?utm_source=chatgpt.com)
</li>
<li>
Sustainability and preservation: Learn about FAIRsharing's approach to long-term sustainability, preservation and stewardship of its metadata and services. https://fairsharing.org/sustainability_and_preservation
</li>
<li>
Privacy policy: Read how FAIRsharing collects, processes and protects personal information, including user rights and data handling practices. https://fairsharing.org/privacy
      </li>
    </ul>
  </main>
</template>

<script>
export default {
  name: "Documentation",
};
</script>

<style scoped>
li {
  line-height: 1.6;
}

li::before {
  display: inline-block;
  content: "";
  -webkit-border-radius: 0.375rem;
  border-radius: 0.375rem;
  -moz-border-radius: 0.375rem;
  height: 0.4rem;
  width: 0.4rem;
  margin-right: 0.5rem;
  background-color: black;
}
</style>
