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
      This page contains links to various FAIRsharing documentation resources.
      Please refer to the links below and to our
      <a
        class="underline-effect"
        href="https://fairsharing.gitbook.io/"
        target="_blank"
        rel="noopener noreferrer"
        >general GitBook documentation</a
      >
      for both user-facing and machine-actionable options to access, discover,
      and edit FAIRsharing records. If you encounter any issues with the API,
      please email
      <a class="underline-effect" href="mailto:contact@fairsharing.org"
        >contact@fairsharing.org</a
      >
      to discuss your requirements.
    </p>

    <ul
      :class="[
        'documentation-list mb-4 lato-font-medium lato-text-sm',
        { 'lato-text-md': $vuetify.display.xlOnly },
      ]"
    >
      <li>
        <strong>Programmatic access:</strong>
        Learn about the different ways to access FAIRsharing programmatically,
        including the REST API, OAI-PMH, content negotiation and
        machine-readable metadata in our
        <a
          class="underline-effect"
          href="https://fairsharing.gitbook.io/fairsharing/programmatic-access/fairsharing-data-access"
          target="_blank"
          rel="noopener noreferrer"
          >data access guide</a
        >.
      </li>
      <li>
        <strong>Data schema:</strong>
        Explore the
        <a
          class="underline-effect"
          href="https://doi.org/10.5281/zenodo.6875035"
          target="_blank"
          rel="noopener noreferrer"
          >FAIRsharing application schema</a
        >, which documents the underlying data model used to structure
        FAIRsharing records and support programmatic access.
      </li>
      <li>
        <strong>Licensing:</strong>
        View the
        <a
          class="underline-effect"
          href="https://fairsharing.org/licence"
          target="_blank"
          rel="noopener noreferrer"
          >licence terms</a
        >
        governing the reuse of FAIRsharing data and programmatic access through
        the FAIRsharing API.
      </li>
      <li>
        <strong>GitHub repositories:</strong>
        Access FAIRsharing's open source repositories, including:
        <ul>
          <li>
            <a
              class="underline-effect"
              href="https://github.com/FAIRsharing/FAIR-Tests"
              target="_blank"
              rel="noopener noreferrer"
              >FAIR-Tests</a
            >, a framework for community-developed FAIR assessment tests.
          </li>
          <li>
            <a
              class="underline-effect"
              href="https://github.com/FAIRsharing/FAIRsharing-Scripts"
              target="_blank"
              rel="noopener noreferrer"
              >FAIRsharing-Scripts</a
            >, supporting FAIRsharing curation and analysis workflows.
          </li>
          <li>
            <a
              class="underline-effect"
              href="https://github.com/FAIRsharing/fairsharing.github.io"
              target="_blank"
              rel="noopener noreferrer"
              >fairsharing.github.io</a
            >, the source repository for the FAIRsharing website.
          </li>
        </ul>
      </li>
      <li>
        <strong>Documentation:</strong>
        Browse the
        <a
          class="underline-effect"
          href="https://fairsharing.gitbook.io/fairsharing/"
          target="_blank"
          rel="noopener noreferrer"
          >FAIRsharing documentation</a
        >, including user guides, API documentation and developer resources.
      </li>
      <li>
        <strong>Sustainability and preservation:</strong>
        Learn about FAIRsharing's approach to long-term sustainability,
        preservation and stewardship of its metadata and services in our
        <a
          class="underline-effect"
          href="https://fairsharing.org/sustainability_and_preservation"
          target="_blank"
          rel="noopener noreferrer"
          >sustainability and preservation statement</a
        >.
      </li>
      <li>
        <strong>Privacy policy:</strong>
        Read our
        <a
          class="underline-effect"
          href="https://fairsharing.org/privacy"
          target="_blank"
          rel="noopener noreferrer"
          >privacy policy</a
        >
        to learn how FAIRsharing collects, processes and protects personal
        information, including user rights and data handling practices.
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
.documentation-list {
  padding-left: 1.5rem;
}

.documentation-list > li {
  margin-bottom: 1rem;
}

.documentation-list li {
  line-height: 1.6;
}

.documentation-list ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  list-style-type: circle;
}

.documentation-list ul li + li {
  margin-top: 0.5rem;
}
</style>
