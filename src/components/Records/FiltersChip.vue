<template>
  <div>
    <div class="chipsElements container-fluid">
      <div class="row">
        <div
          v-for="(chip, index) in getChips"
          :key="'Chips_' + index"
        >
          <div
            v-for="(chipValue, subKey) in chip.paramVal"
            :key="'Chip_' + subKey"
            class="chip"
          >
            <span @click="removeParam(chip.paramName, chipValue)">x</span> {{ chip.paramName }}: {{ decodeURIComponent(chipValue) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "FiltersChip",
        computed: {
            getChips: function(){
                let output = [];
                const parameters = this.$route.query;
                Object.keys(parameters).forEach(function(paramName){
                    let param = parameters[paramName];

                    if (param.indexOf(",") > -1){
                        param = param.split(",")
                    }
                    else {
                        param = [param]
                    }
                    output.push({
                        paramName: paramName,
                        paramVal: param
                    })
                });
                return output;
            }
        },
        methods: {
            removeParam: async function(paramName, paramVal){
                let _module = this;
                let query = {};
                Object.keys(_module.$route.query).forEach(function(queryParam){
                    if (queryParam !== paramName){
                        query[queryParam] = _module.$route.query[queryParam]
                    }
                    else {
                        if (_module.$route.query[queryParam].indexOf(',') > -1) {
                            query[paramName] = _module.$route.query[queryParam].replace(`,${paramVal}`, "");
                            query[paramName] = _module.$route.query[queryParam].replace(`${paramVal},`, "");
                        }
                    }
                });
                await _module.$router.push({
                    name: _module.$route.name,
                    query: query
                })
            }
        }
    }
</script>

<style scoped>

  .chip {
    border-radius: 20px;
    background:darkred;
    padding: 5px 10px;
    color:white;
    margin-left:10px;
    margin-bottom: 10px;
    text-align:left;
    max-width:300px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  }

  .chip span {
    border: 1px solid white;
    border-radius: 50px;
    padding: 5px 10px;
  }

</style>