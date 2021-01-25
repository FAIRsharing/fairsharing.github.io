<template>
  <v-avatar
    :style="statusStyles[status].background"
    size="48"
  >
    <span class="white--text">
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
                        background: 'background: linear-gradient(#599C0F, lightgreen)'
                    },
                    deprecated: {
                        label: 'D',
                        background: 'background: linear-gradient(#707070, #C6C6C6)'
                    },
                    uncertain: {
                        label: 'U',
                        background: 'background: linear-gradient(#ADA3A3, #D6CCCC)'
                    },
                    in_development: {
                        label: 'Dev',
                        background: 'background: linear-gradient(#CB9221, #F5CE80)'
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
