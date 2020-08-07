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
                if (ignoredFields.indexOf(paramName) === -1) {
                    let param = parameters[paramName];
                    if (param && typeof param !== "number" && typeof param !== "boolean" && param.indexOf(",") > -1) {
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
