<template>
  <div
    id="homePage"
    class="home container-fluid"
  >
    Welcome to FAIRsharing.org
    <script
      type="application/ld+json"
      v-text="value"
    />
  </div>
</template>

<script>
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      jsonld() {
        return {
          "@context": "http://schema.org",
          "@id": "https://doi.org/10.25504/FAIRsharing.9kahy4",
          "@type": "Dataset",
          "alternateName": "GenBank",
          "citation": {
            "@type": "CreativeWork",
            "identifier": "doi:10.25504/FAIRsharing.9kahy4"
          },
          "description": "This FAIRsharing record describes: GenBank is the NIH genetic sequence database, an annotated collection of all publicly available DNA sequences. The complete release notes for the current version of GenBank are available on the NCBI ftp site. A new release is made every two months. GenBank growth statistics for both the traditional GenBank divisions and the WGS division are available from each release. GenBank is part of the International Nucleotide Sequence Database Collaboration (INSDC), which comprises the DNA DataBank of Japan (DDBJ), the European Molecular Biology Laboratory (EMBL), and GenBank at the NCBI. These three organizations exchange data on a daily basis. ",
          "identifier": "10.25504/FAIRsharing.9kahy4",
          "license": "https://creativecommons.org/licenses/by-sa/4.0/. Please link to https://fairsharing.org and https://fairsharing.org/static/img/home/svg/FAIRsharing-logo.svg for attribution.",
          "name": "FAIRsharing record for: GenBank",
          "url": "https://doi.org/10.25504/FAIRsharing.9kahy4"
        }
      }
    };
</script>
