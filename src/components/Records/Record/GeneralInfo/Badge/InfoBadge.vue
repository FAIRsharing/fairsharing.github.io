<template>
  <v-progress-circular
    :rotate="360"
    :size="80"
    :width="10"
    :value="0"
    color="gray"
    class="mr-1"
  >
    {{ 0 }}
  </v-progress-circular>
</template>

<script>
export default {
  name: "InfoBadge",
  components: {},
  data() {
    return {
      
    }
  },
  computed:{
    
  },
  methods:{
    
  }
}
</script>

<style scoped>

</style>