<template>
  <v-avatar
    :style="statusStyles[status].backColor"
    size="48"
  >
    <span class="white--text">
      {{ statusStyles[status].label }}
    </span>
  </v-avatar>
</template>

<script>
import { LightenDarkenColor } from '@/utils/generalUtils';

    export default {
        name: "StatusPills",
        props: {
            status: {default: null, type: String}
        },
        data(){
            return {
                statusStyles: {
                    ready: {
                        label: 'R',
                        backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.ready_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.ready_color,50)})`
                    },
                    deprecated: {
                        label: 'D',
                        backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.deprecated_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.deprecated_color,50)})`
                    },
                    uncertain: {
                        label: 'U',
                        backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.uncertain_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.uncertain_color,50)})`
                    },
                    in_development: {
                        label: 'Dev',
                        backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.dev_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.dev_color,50)})`
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
