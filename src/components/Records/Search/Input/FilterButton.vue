<template>
  <v-tooltip
    bottom
    :disabled="item.toolTip===undefined"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        class="mr-1 mr-lg-2"
        :outlined="!item.active"
        :class="[isFirstItem?'first-child':'flex-1',{'button-style-md-screens':mdScreens,'buttons-md-style':multipleItems && !isFirstItem}]"
        @click="selectFilter(item)"
        v-on="on"
      >
        {{ item.title }}
      </v-btn>
    </template>
    <span>{{ item.toolTip }}</span>
  </v-tooltip>
</template>

<script>
    import { isEqual } from "lodash";
    import { mapActions } from 'vuex'

    export default {
        name: "FilterButton",
        props: {
            item: {default: null, type: Object},
            isFirstItem: {default: false, type: Boolean},
            mdScreens: {default: null, type: Boolean},
            itemParentIndex: {default: 0, type: Number},
            multipleItems: {default: false, type: Boolean},
        },
        methods: {
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function (selectedItem) {
                const _module = this;
                let currentQuery = {};
                let oldQuery = {};

                _module.$route.query.forEach((param)=>{
                    currentQuery[param] = _module.$route.query[param];
                    oldQuery[param] = _module.$route.query[param];
                })
                if (Object.prototype.hasOwnProperty.call(selectedItem, 'value')) {
                    currentQuery[selectedItem.filterName] = encodeURIComponent(selectedItem.value);
                    if (!isEqual(currentQuery, oldQuery)) {
                        _module.$router.push({
                            name: _module.$route.name,
                            query: currentQuery
                        });
                    }
                }
                else {
                    delete currentQuery[selectedItem.filterName]
                    this.$router.push({
                        name: _module.$route.name,
                        query: currentQuery
                    });

                }
            },
            selectFilter: function (selectedItem) {
                let _module = this;
                _module.resetFilterButtons(_module.itemParentIndex);
                _module.activateFilterButtonsItem({
                    'activeItem': selectedItem,
                    'itemParentIndex': _module.itemParentIndex
                });
                this.applyFilters(selectedItem);
            },
            ...mapActions("searchFilters", ["resetFilterButtons", "activateFilterButtonsItem"])
        }
    }
</script>

<style scoped>
    .button-style-md-screens {
        font-size: 9px !important;
    }

    .first-child {
        font-size: 11px;
        width: 16.5%;
    }

    .flex-1 {
        font-size: 11px;
        flex: 1;
    }

    .buttons-md-style {
        min-width: 32px !important;
    }

</style>
