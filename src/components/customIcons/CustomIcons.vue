<template>
  <div v-if="iconSource.source">
    <v-img
      contain
      height="45"
      :src="getImgUrl(iconSource.source)"
    />
  </div>
</template>

<script>
export default {
  name: "CustomIcons",
  props: {
    iconSource: {default: null, type: Object}
  },
  methods: {
    getImgUrl(pic) {
      return require('@/assets/custom_icons/' + pic)
    }
  }
}
</script>
