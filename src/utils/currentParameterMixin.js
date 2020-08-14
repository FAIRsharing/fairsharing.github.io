export default {
    computed: {
        currentParameter(){
            const currentQuery = this.$route.query;
            const fieldName = this.item.filterName;
            let currentParam = {};
            currentParam[fieldName] = null;
            if (currentQuery[fieldName]){
                currentParam[fieldName] = currentQuery[fieldName];
            }
            return currentParam;
        }
    }
}
