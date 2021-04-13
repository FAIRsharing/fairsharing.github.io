<template>
  <div class="py-10 px-5">
    <div
      v-for="(button, index) in buttons"
      :key="'button_' + index"
      class="mb-2"
    >
      <v-btn
        width="100%"
        color="primary"
        :outlined="!button.active"
        @click="goTo(button)"
      >
        <span :class="['white--text',{'primary--text':!button.active}]">{{ button.name }}</span>
      </v-btn>
    </div>
  </div>
</template>

<script>
    export default {
        name: "NavigationDrawer",
        data(){
            return {
                buttons: [
                    {
                        name: "Standards",
                        query: {"fairsharingRegistry": "Standard"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Databases",
                        query: {"fairsharingRegistry": "Database"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Policies",
                        query: {"fairsharingRegistry": "Policy"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Collections",
                        query: {"fairsharingRegistry": "Collection"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Add content",
                        path: "new",
                        query: undefined,
                        active: false
                    },
                    {
                        name: "Stats",
                        path: "summary-statistics",
                        query: undefined,
                        active: false
                    }
                ]
            }
        },
        computed: {
            route(){
                return {
                    path: this.$route.path,
                    query: this.$route.query
                }
            }
        },
        watch: {
            route: {
                deep: true,
                handler(val){
                    this.makeActiveButton(val)
                }
            }
        },
        mounted(){
            this.makeActiveButton(this.$route)
        },
        methods: {
            async goTo(button){
                if (this.route.path.replace("/", "") !== button.path
                    || this.route.query['fairsharingRegistry'] !== button.query['fairsharingRegistry'])
                {
                    this.buttons.forEach(button => {
                        button.active = false
                    });
                    button.active = true;
                    await this.$router.push({
                        path: "/" + button.path,
                        query: button.query
                    })
                }
            },
            makeActiveButton(val){
                this.buttons.forEach(button => {
                    button.active =
                        button.path === val.path.replace("/", "")
                        && button.query['fairsharingRegistry'] === val.query['fairsharingRegistry'];
                });
            }
        }
    }
</script>

<style scoped>

</style>
