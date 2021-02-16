<template>
  <div
    v-if="iconSource"
    class="mt-4"
  >
    <v-img
      contain
      height="45"
      :src="getImgUrl(iconSource)"
    />
  </div>
</template>

<script>
export default {
  name: "CustomIcons",
  props: {
    iconSource: {default: null, type: String}
  },
  methods:{
    getImgUrl(pic) {
      return require('@/assets/custom_icons/'+pic)
    }
  }
}
</script>
