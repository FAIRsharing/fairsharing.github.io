<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
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

    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Contact
    </h2>

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
  name: "PreservationPolicy",
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
