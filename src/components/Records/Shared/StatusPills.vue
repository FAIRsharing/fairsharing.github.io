<template>
  <v-avatar
    :style="statusStyles[status].backColor"
    size="48"
  >
    <span class="text-white">
      {{ statusStyles[status].label }}
    </span>
  </v-avatar>
</template>

<script>
import { useTheme } from "vuetify";
import { LightenDarkenColor } from '@/utils/generalUtils';

export default {
  name: "StatusPills",
  props: {
    status: {default: null, type: String}
  },
  setup() {
    const theme = useTheme();
    return { theme };
  },
  data(){
    return {
      statusStyles: {
        ready: {
          label: 'R',
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.ready_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.ready_color,50)})`
        },
        deprecated: {
          label: 'D',
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.deprecated_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.deprecated_color,50)})`
        },
        uncertain: {
          label: 'U',
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.uncertain_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.uncertain_color,50)})`
        },
        in_development: {
          label: 'Dev',
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.dev_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.dev_color,50)})`
        },
        undefined: {
          label: '?',
          backColor: 'background: linear-gradient(red, red)'
        },
      },
    }
  }
}
</script>
