<template>
  <v-avatar
    :style="statusStyles[status].background"
    size="48"
  >
    <span class="white--text headline">
      {{ statusStyles[status].label }}
    </span>
  </v-avatar>
</template>

<script>
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
                        background: 'background: linear-gradient(green, lightgreen)'
                    },
                    deprecated: {
                        label: 'D',
                        background: 'background: linear-gradient(#8F4309, #a57202)'
                    },
                    uncertain: {
                        label: 'U',
                        background: 'background: linear-gradient(#2d2b2b, #757575)'
                    },
                    in_development: {
                        label: 'I',
                        background: 'background: linear-gradient(#02364b, #35baef)'
                    },
                    undefined: {
                        label: '?',
                        background: 'background: linear-gradient(red, red)'
                    },
                },
            }
        }
    }
</script>

<style scoped>
    .circle {
        padding:10px;
        width:50px;
        height:50px;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        display: table-cell;
        vertical-align: middle;
    }
</style>
