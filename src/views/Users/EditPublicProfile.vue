<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        md="8"
        lg="8"
        xl="6"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <h2> Edit Public profile</h2>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "EditPublicProfile",
}
</script>

<style scoped>
  #edit_hide_email label {
    margin-bottom: 0 !important;
  }
</style>
