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
        },
        truncate(str, n) {
            return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
        }
    },
    filters: {
        capitalize(str) {
            if (!str) return "";
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    }
};

export default stringUtils;

export const truncate = {
    methods: {
        truncate(str, n) {
            return stringUtils.methods.truncate(str, n);
        }
    }
};
