const stringUtils = {
    methods: {
        cleanString (string) {
            if (typeof string === "string") {
                return string.replace(/_/g, " ");
            }
            return string;
        }
    },
    filters: {
        capitalize (str){
            if (!str) return "";
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    }
}

export default stringUtils;
