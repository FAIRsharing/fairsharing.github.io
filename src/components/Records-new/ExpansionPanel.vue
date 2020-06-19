<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ object.filter }}</v-expansion-panel-header>
    <v-expansion-panel-content class="pl-5 pr-5">
      <v-list
        v-if="object.subFilters.length<=1"
        flat
      >
        <!--          :class="{'fixed-scrollable-height':object.subFilters.length>5}"-->
        <v-list-item-group
          color="primary"
          multiple
        >
          <v-list-item
            v-for="(subObject,index) in searchSubFilters.subFilters"
            :key="subObject.subFilter+'_'+index"
            @click="callAction"
          >
            <v-list-item-content>
              <v-list-item-title
                class="text-primary"
                v-text="subObject.subFilter"
              />
            </v-list-item-content>
            <v-list-item-icon>
              <div :class="!subObject.active?'badge':'badge-active'">
                <span
                  id="inventory"
                  class="text-primary "
                >{{ subObject.inventory }}</span>
                <span
                  v-if="subObject.active"
                  class="triangle-left"
                />
              </div>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <!--
                                                                  <v-text-field
                                                                          v-if="object.subFilters.length>5"
                                                                          class="mt-2"
                                                                          solo
                                                                          dense
                                                                          clearable
                                                                          v-model="searchTerm"
                                                                          :placeholder="`Search through ${object.filter}`"
                                                                  ></v-text-field>
                                                      -->
      <div
        v-if="object.subFilters.length>2"
        :class="['d-flex',{'flex-column':$vuetify.breakpoint.mdAndDown}]"
      >
        <v-autocomplete
          v-model="object.filterSelected"
          class="mt-2"
          :items="returnSubFilters(object.subFilters)"
          solo
          dense
          clearable
          :placeholder="`Search through ${object.filter}`"
          @click:clear="reset(object)"
        />
        <v-btn
          color="primary"
          class="mt-lg-2 ml-lg-2"
          style="height: 38px"
          @click="applyFilters(object)"
        >
          Apply
        </v-btn>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        name: "ExpansionPanel",
        props: {object: {default: null, type: Object}},
        data: () => {
            return {
                searchTerm: '',
                formData: {},
                arr:[]
            }
        },
        computed: {
            searchSubFilters: function () {
                let _module = this;
                if (_module.searchTerm === null || _module.searchTerm === '') {
                    return _module.object;
                } else {
                    let output = {subFilters: []}
                    _module.object.subFilters.forEach(item => {
                        if (item.subFilter.includes(_module.searchTerm)) {
                            output.subFilters.push(item)
                        }
                    });
                    // output = _module.object.subFilters.find(item => item.subFilter.includes(_module.searchTerm));
                    // console.log('output', output)
                    return output;
                }
            },
        },
        methods: {
            returnSubFilters(subFiltersObject) {
                let output = [];
                subFiltersObject.forEach(object => output.push(this.cleanString(object.subFilter)));
                return output;
                /*        if (subFiltersObject.filterSelected) {
                            console.log('subFiltersObject from ret ', subFiltersObject.filterSelected);
                            if (!subFiltersObject.filterSelected.length) { // if there is nothing in search box
                                subFiltersObject.subFilters.forEach(object => outPut.push(object.subFilter));
                            } else {
                                // subFiltersObject.subFilters.forEach(object => object.subFilter.toLowerCase().includes(subFiltersObject.filterSelected)
                                subFiltersObject.subFilters.filter(item => {
                                        return item.subFilter.toLowerCase() === subFiltersObject.filterSelected;
                                    }
                                )
                                console.log('yo', subFiltersObject.filterSelected);
                                outPut.push(subFiltersObject.filterSelected);
                            }
                            console.log(outPut);
                            return outPut;
                        }else
                        {
                            return {};
                        }*/
            },
            ...mapActions('searchFilters', ["callAction"]),
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function (selectedItem) {
                if (selectedItem.filterSelected && selectedItem.filterSelected.length) {
                    let _module = this;
                    let previousQuery = _module.formData[selectedItem.filterName]
                    _module.formData[selectedItem.filterName] = encodeURIComponent(selectedItem.filterSelected.trim());
                    if (this.formData[selectedItem.filterName] !== previousQuery) {
                        this.$router.push({
                            name: _module.$route.name,
                            query: this.formData
                        });
                        _module.reset(selectedItem)
                    }
                }
            },
            /**
             * Reset the form/filters/parameters to default (go so /search?page=1)
             */
            reset: function (selectedItem) {
                this.$nextTick(() => {
                    selectedItem.filterSelected = {}
                    // this.formData = {};
                    // this.$router.push({name: this.$route.name});
                })
            },
            /**
             * Clean up the given string by removing underscores and fills the stringsReplacement mapper variable.
             * @param {String} string - the raw string to clean
             * @returns {String} cleanedString - the string stripped of underscores.
             */
            cleanString: function (string) {
                let cleanedString = string;
                if (string.includes('_')) {
                    cleanedString = string.replace(/_/g, " ");
                }
                return cleanedString;
            },
            /**
             * Clean up all the filters names using the cleanString() method of each of them.
             * @param {Array} stringArray - an array of raw filters name
             * @returns {Array} output - an array of cleaned filters name
             */
            cleanStrings: function (stringArray) {
                let output = [];
                const _module = this;
                stringArray.forEach(function (string) {
                    output.push(_module.cleanString(string))
                });
                return output;
            },
        }
    }
</script>

<style scoped lang="scss">
    .badge {
        width: 35px;
        height: 25px;
        background: white;
        border: #27aae1 solid 1px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        -webkit-border-radius: 5px;
        position: relative;

        #inventory {
            font-size: small;
            position: absolute;
            top: 6%;
            left: 20%;
        }
    }

    .badge-active {
        width: 35px;
        height: 24px;
        background: #27aae1;
        border: #27aae1 solid 1px;
        border-radius: 5px 5px 5px 5px;
        -moz-border-radius: 5px 5px 5px 5px;
        -webkit-border-radius: 5px 5px 5px 5px;
        position: relative;

        #inventory {
            color: white;
            font-size: small;
            position: absolute;
            top: 6%;
            left: 20%;
        }
    }

    .triangle-left {
        position: absolute;
        width: 0;
        height: 0;
        border-top: 12px solid transparent;
        border-right: 15px solid #27aae1;
        border-bottom: 11px solid transparent;
        left: -30%;
    }

    .fixed-scrollable-height {
        max-height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        scroll-behavior: smooth;
    }
</style>
