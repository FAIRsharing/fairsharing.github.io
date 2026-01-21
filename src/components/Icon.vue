<template>
  <div :class="[wrapperClass, 'd-flex justify-center']">
    <v-icon
      v-if="!Object.keys(customIcons.values).includes(item)"
      :color="color"
      :size="size"
    >
      {{ customIcons.values[fallback].icon }}
    </v-icon>
    <v-icon
      v-else-if="customIcons.values[item].type === 'icon'"
      :color="color"
      :icon="customIcons.values[item].icon"
      :size="size"
    >
      {{ customIcons.values[item].icon }}
    </v-icon>
    <v-img
      v-else-if="customIcons.values[item].type === 'img'"
      :class="{ 'mt-0': wrapperClass !== '' }"
      :height="height"
      :src="customIcons.values[item].icon"
      :width="height"
      class="contain"
    />
  </div>
</template>

<script>
import customIcons from "@/plugins/icons";

export default {
  name: "Icon",
  props: {
    item: { default: null, type: String },
    size: { default: "10", type: String },
    fallback: { default: "undefined", type: String },
    wrapperClass: { default: "icon-container", type: String },
    height: { default: 45 },
    color: { default: null, type: String },
  },
  data() {
    return {
      customIcons: customIcons,
    };
  },
};
</script>

<style scoped>
.icon-container {
  position: absolute;
  top: -25px;
  background: white;
  border: #b3b3b3 dotted 3px;
  border-radius: 50% !important;
  -moz-border-radius: 50% !important;
  -webkit-border-radius: 50% !important;
  width: 45px;
  height: 45px;
  cursor: help;
  color: #0000008a;
}

.alt-container {
  position: absolute;
  background: white;
  width: 40px;
  height: 40px;
  cursor: help;
}
</style>
