const stringUtils = {
    methods: {
        cleanString(string) {
            if (typeof string === "string") {
                if (string.includes('_')) {
                    return string.replace(/_/g, " ");
                }
            }
            return string;
        },
        prettifyList(string) {
            return string.replace(/,/g, ", ");
        }
    },
    filters: {
        capitalize(str) {
            if (!str) return "";
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    }
}

export default stringUtils;
