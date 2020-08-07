const filterChipsUtils = {
    computed: {
        getChips: function () {
            let output = [];
            const parameters = this.$route.query;
            const ignoredFields = [
                "page",
                "orderBy",
                "searchAnd"
            ];
            Object.keys(parameters).forEach(function (paramName) {
                if (!ignoredFields.includes(paramName)) {
                    let param = parameters[paramName];
                    if (typeof param === "string") {
                        param = param.split(",")
                    }
                    else {
                        param = [param];
                    }
                    param.forEach(function (val) {
                        output.push({
                            paramName: paramName,
                            paramVal: val
                        });
                    })
                }
            });
            return output;
        }
    },
};

export default filterChipsUtils;
