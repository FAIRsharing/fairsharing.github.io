export default {
    computed: {
        currentParameter(){
            const currentQuery = this.$route.query;
            //console.log("QUERY: " + JSON.stringify(currentQuery));
            const fieldName = this.item.filterName;
            let currentParam = {};
            currentParam[fieldName] = null;
            if (currentQuery[fieldName]){
                currentParam[fieldName] = currentQuery[fieldName];
            }
            //console.log("PARAM: " + JSON.stringify(currentParam));
            return currentParam;
        }
    }
}
