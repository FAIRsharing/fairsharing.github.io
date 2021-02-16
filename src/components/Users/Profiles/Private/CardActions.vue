<template>
  <v-card-actions
    v-if="id"
    class="pt-5"
  >
    <v-spacer />
    <v-btn
      x-small
      fab
      color="primary"
      @click="showPreview = true"
    >
      <v-icon>fas fa-eye</v-icon>
    </v-btn>
    <router-link :to="`/${id}/edit`">
      <v-btn
        x-small
        fab
        color="primary ml-2"
      >
        <v-icon>fa-pen</v-icon>
      </v-btn>
    </router-link>

    <!-- PREVIEW RECORD -->
    <v-dialog v-model="showPreview">
      <v-btn
        fab
        small
        class="grey--text absolute"
        @click="showPreview = false"
      >
        <v-icon>fa-times</v-icon>
      </v-btn>

      <v-card>
        <Record :target="id" />
      </v-card>
    </v-dialog>
  </v-card-actions>
</template>

<script>
    import Record from "@/views/Records/Record";
    export default {
        name: "CardActions",
        components: {Record},
        props: {
          id: {type: Number, default: null}
        },
        data(){
          return {
            showPreview: false
          }
        }
    }
</script>

<style scoped>
  .absolute {
    position: absolute !important;
    z-index: 1;
    right: 13px;
  }
</style>
