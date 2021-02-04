<template>
  <v-row class="secondary white--text pt-5">
    <v-col
      :cols="$vuetify.breakpoint.xsOnly?'12':4"
      lg="4"
      md="4"
      sm="12"
      xsm="12"
      class="flex-column align-center d-flex"
    >
      <h4>
        Developed by
      </h4>
      <ul>
        <li>
          <a
            href="/communities#team"
            target="_blank"
          >The
            FAIRsharing team</a>
        </li>
        <li>
          <a
            href="http://www.oerc.ox.ac.uk"
            target="_blank"
          >Oxford e-Research Centre</a>
        </li>
        <li>
          <a
            href="http://www.ox.ac.uk"
            target="_blank"
          >University of Oxford</a>
        </li>
      </ul>
    </v-col>
    <v-col
      :cols="$vuetify.breakpoint.xsOnly?'12':4"
      lg="4"
      md="4"
      sm="12"
      class="flex-column align-center d-flex"
    >
      <h4 id="contact-info">
        Contact Us
      </h4>
      <ul>
        <li>
          <a href="mailto:contact@fairsharing.org?subject=FAIRsharing Issue"><i
            class="fa fa-envelope"
          />
            Email us for
            all
            enquiries</a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/fairsharing"
            target="_blank"
          ><i
            class="fab fa-facebook"
          />
            Facebook</a>
        </li>
        <li>
          <a
            href="https://www.twitter.com/fairsharing_org"
            target="_blank"
          ><i class="fab fa-twitter" />
            Twitter</a>
        </li>
      </ul>
    </v-col>
    <v-col
      :cols="$vuetify.breakpoint.xsOnly?'12':4"
      lg="4"
      md="4"
      sm="12"
      class="flex-column align-center d-flex"
    >
      <h4 id="about-info">
        About FAIRsharing
      </h4>
      <ul>
        <li>
          <a
            id="tour-link"
            href="#"
          >Take a Tour</a>
        </li>
        <li>
          <a href="/communities">Community</a>
        </li>
        <li><a href="/stakeholders">Stakeholders</a></li>
        <li>
          <a href="/timeline">Timeline</a>
        </li>
        <li>
          <a href="/licence">API and data licence</a>
        </li>
        <li>
          <a href="/terms">Terms of use</a>
        </li>
        <li>
          <a href="/educational/#faq10-1">How to cite us</a>
        </li>
        <li>
          <a href="/privacy">Privacy policy</a>
        </li>
      </ul>
    </v-col>
    <v-row
      class="d-flex flex-row justify-center align-center mb-2"
    >
      <p class="mb-0 mr-2">
        © FAIRsharing 2009-Present | Licensed under
      </p>
      <a
        class="mr-2"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
      >Creative Commons
        by
        Share Alike 4.0 International</a>
      <a href="/licence"><img
        src="https://fairsharing.org/static/img/home/FAIRsharingCC-BY-SA.png"
      ></a>
    </v-row>
  </v-row>
</template>

<script>
export default {
  name: "Footer"
}
</script>
<style scoped>
li {
  min-width: 200px;
}
</style>
