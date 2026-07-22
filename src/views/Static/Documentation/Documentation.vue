<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">FAIRsharing Documentation</h1>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">About</h2>
    <p
      :class="[
        'mb-4 lato-font-medium lato-text-sm',
        { 'lato-text-md': $vuetify.display.xlOnly },
      ]"
    >
      This page contains links to various FAIRsharing documentation resources.
      Please refer to our
      <a
        href="https://fairsharing.gitbook.io/fairsharing/programmatic-access/fairsharing-data-access"
        >Gitbook documentation</a
      >
      for both user-facing and machine-actionable options to access, discover,
      and edit FAIRsharing records. If you encounter any issues with the API,
      please email
      <a
        class="underline-effect"
        href="mailto:contact@fairsharing.org"
        target="_blank"
        >contact@fairsharing.org</a
      >
      to discuss your requirements.
    </p>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">Links</h2>
    <ul
      :class="[
        'mb-4 lato-font-medium lato-text-sm',
        { 'lato-text-md': $vuetify.display.xlOnly },
      ]"
    >
      <li>
        <a href="https://fairsharing.gitbook.io/fairsharing"
          >In-depth guidance</a
        >
      </li>
      <li>
        <a href="https://fairsharing.org/licence">API and data licence</a>
      </li>
      <li>
        <a href="https://github.com/FAIRsharing/FAIR-Tests"
          >FAIR-Tests Github repository</a
        >
      </li>
      <li>
        <a href="https://fairsharing.org/privacy">Privacy Policy</a>
      </li>
      <li>
        <a href="https://fairsharing.org/sustainability_and_preservation"
          >Sustainability and Preservation</a
        >
      </li>
      <li>
        <a href="https://doi.org/10.5281/zenodo.6875035"
          >FAIRsharing data schema</a
        >
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
