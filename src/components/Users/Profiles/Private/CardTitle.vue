<template>
  <v-card-title>
    <v-avatar
      size="30"
      class="mr-3"
    >
      <v-img :src="icons()[icon]" />
    </v-avatar>
    <div class="text-truncate blue--text">
      {{ name }}
    </div>
  </v-card-title>
</template>

<script>
    import { mapState } from "vuex"

    export default {
        name: "CardTitle",
        props: {
            name: {type: String, default: null },
            icon: {type: String, default: null }
        },
        computed: {
            ...mapState('editor', ['icons'])
        }
    }
</script>

<style scoped>

</style>
