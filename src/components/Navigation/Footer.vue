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
            class="underline-effect"
            href="/communities#team"
            target="_blank"
          >The
            FAIRsharing team</a>
        </li>
        <li>
          <a
            href="http://www.oerc.ox.ac.uk"
            target="_blank"
            class="underline-effect"
          >Oxford e-Research Centre</a>
        </li>
        <li>
          <a
              class="underline-effect"
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
          <a href="mailto:contact@fairsharing.org?subject=FAIRsharing Issue" class="underline-effect"><i
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
            class="underline-effect"
          ><i
            class="fab fa-facebook"
          />
            Facebook</a>
        </li>
        <li>
          <a
            href="https://www.twitter.com/fairsharing_org"
            target="_blank"
            class="underline-effect"
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
            class="underline-effect"
            id="tour-link"
            href="#"
          >Take a Tour</a>
        </li>
        <li>
          <a href="/communities" class="underline-effect">Community</a>
        </li>
        <li><a href="/stakeholders">Stakeholders</a></li>
        <li>
          <a href="/timeline" class="underline-effect">Timeline</a>
        </li>
        <li>
          <a href="/licence" class="underline-effect">API and data licence</a>
        </li>
        <li>
          <a href="/terms" class="underline-effect">Terms of use</a>
        </li>
        <li>
          <a href="/educational/#faq10-1" class="underline-effect">How to cite us</a>
        </li>
        <li>
          <a href="/privacy" class="underline-effect">Privacy policy</a>
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
        class="mr-2 underline-effect"
        href="http://creativecommons.org/licenses/by-sa/4.0/"
        target="_blank"
      >Creative Commons
        by
        Share Alike 4.0 International</a>
      <a href="/licence" class="underline-effect"><img
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
