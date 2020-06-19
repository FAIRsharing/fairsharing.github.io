<template>
  <v-row class="mr-2 ml-2">
    <div
      v-for="(chip, index) in getChips"
      :key="'Chips_' + index"
    >
      <v-chip
        class="ma-2"
        close
        color="white"
        text-color="teal"
        @click:close="removeParam(chip.paramName, chip.paramVal)"
      >
        {{ chip.paramName }}: <b>{{ decodeURIComponent(chip.paramVal.substr(0,50)).replace(/_/g, " ") }}</b>
      </v-chip>
    </div>
  </v-row>
</template>

<script>
    import {throttle} from "lodash"

    export default {
        name: "FiltersChip",
        computed: {
            getChips: function () {
                let output = [];
                const parameters = this.$route.query;
                Object.keys(parameters).forEach(function (paramName) {
                    if (paramName !== "page" && paramName !== "orderBy") {
                        let param = parameters[paramName];
                        if (param.indexOf(",") > -1) {
                            param = param.split(",")
                        }
                        else {
                            param = [param];
                        }
                        param.forEach(function(val){
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
        methods: {
            /**
             * Removes the parameter value from the router query with a 2000ms throttle
             * @param {String} paramName - name of the parameter to remove
             * @param {String} paramVal - value of the parameter to remove
             */
            removeParam: throttle(async function (paramName, paramVal) {
                let _module = this;
                let query = this.buildNewQuery(paramName, paramVal);
                await _module.$router.push({
                    name: _module.$route.name,
                    query: query
                })
            }, 2000),
            /**
             * Build the new query given a parameter name a value by getting the current query and removing the key/value given
             * @param {String} paramName - name of the parameter to remove
             * @param {String} paramVal - value of the parameter to remove
             * @returns {Object} - the new query to replace in the router
             */
            buildNewQuery: function (paramName, paramVal) {
                let _module = this;
                let query = {};
                Object.keys(_module.$route.query).forEach(function (queryParam) {
                    if (queryParam !== paramName) {
                        query[queryParam] = _module.$route.query[queryParam]
                    }
                    else {
                        if (_module.$route.query[queryParam].indexOf(',') > -1) {
                            let currentVals = _module.$route.query[queryParam].split(",");
                            if (currentVals.indexOf(paramVal) > -1) {
                                currentVals.splice(paramVal.indexOf(paramVal), 1)
                            }
                            query[paramName] = currentVals.join(",");
                        }
                    }
                });
                query["page"] = 1;
                return query;
            }
        }
    }
</script>
<style scoped>
  .v-chip  {
    border-radius: 20px;
    background: darkred;
    padding: 5px 10px;
    color: white;
    margin-left: 10px;
    margin-bottom: 10px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  }

  .v-chip  span {
    border: 1px solid white;
    border-radius: 50px;
    padding: 5px 10px;
  }
</style>
