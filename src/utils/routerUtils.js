const routerUtils = {
    methods: {
        async gotoAsync(routeObject) {
             await this.$router.push({
                 name: routeObject['Name'],
                 path: routeObject['Path'],
                 query: routeObject['Query']
            });
        },
        goto(routeObject) {
            this.$router.push({
                name: routeObject['Name'],
                path: routeObject['Path'],
                query: routeObject['Query']
            });
        },
        goBack(){
            this.$router.go(-1);
        }
    },
}

export default routerUtils;
