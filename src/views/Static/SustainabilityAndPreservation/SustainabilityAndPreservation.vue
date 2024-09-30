<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      FAIRsharing Sustainability
    </h1>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Since 2011, FAIRsharing is a sustainable service operating with and for the international researcher community
      and other stakeholders involved in the research life cycle. The FAIRsharing resource, along its core operational
      team, are based at the University of Oxford, UK. As with the vast majority of the community resources,
      FAIRsharing is mainly funded by continuous and multiple R&D and infrastructure projects, but it is also supported
      by University-enabled access to DOI generation and the member-only ORCID API.
    </p>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Other key factors contributing to its sustainability are the extensive network of national and international
      collaborations and formal endorsements by organizations and research infrastructures in all disciplines,
      including RDA, EOSC, and ELIXIR. A key example is the flourishing
      <a href="/community_champions">FAIRsharing Community Champions Programme</a>
      that roots the growth and relevance of FAIRsharing into communities of practice.
    </p>

    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      FAIRsharing Data Preservation Policy
    </h1>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Introduction
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      FAIRsharing contains a wealth of hand-curated data of use and interest to the research community at large, and
      we therefore wish to make sure that it remains useful for the future. The FAIRsharing Data Preservation Policy
      exists to describe the steps that will be taken to preserve FAIRsharing
      content and software should there be any problem with ongoing support, or any other issue outside our control, 
      that would prevent the continued operation of the FAIRsharing project.
    </p>

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Download
    </h2>
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      The document is available in PDF format, and can be downloaded
      <a
        href="https://zenodo.org/records/10255310"
        target="_blank"
      >
        from our Zenodo collection
      </a>.
    </p>

    <h1 class="text-h4 text-xl-h3 mb-2 mb-xl-6">
      Contact
    </h1>

    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      For any questions, or to request the policy in a different format, please
      <a href="mailto:contact@fairsharing.org?subject=FAIRsharing Data Preservation Policy">contact us</a>.
    </p>
  </main>
</template>

<script>

export default {
  name: "SustainabilityAndPreservation",
  data: () => {
    return {}
  }
}
</script>

<style scoped>
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
