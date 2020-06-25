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
        :class="[isFirstItem?'first-child':'flex-1',{'button-style-md-screens':mdScreens}]"
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
    import {has} from "lodash";
    import {mapActions, mapState} from 'vuex'

    export default {
        name: "FilterItem",
        props: {
            item: {default: null, type: Object},
            isFirstItem: {default: false, type: Boolean},
            mdScreens: {default: null, type: Boolean},
            itemParentIndex: {default: 0, type: Number}
        },
        computed: {
            ...mapState("routeData", ["formData"])
        },
        methods: {
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function (selectedItem) {
                const _module = this;
                if (has(selectedItem, 'value')) {
                    _module.formData[selectedItem.filterName] = encodeURIComponent(selectedItem.value);
                    _module.previousFormData = _module.formData;
                    _module.$router.push({
                        name: _module.$route.name,
                        query: _module.formData
                    });
                } else {
                    if (has(_module.formData, selectedItem.filterName)) {
                        delete _module.formData[selectedItem.filterName]
                        this.$router.push({
                            name: _module.$route.name,
                            query: _module.formData
                        });
                    }
                }
            },
            selectFilter: function (selectedItem) {
                let _module = this;
                _module.resetFilterButtons(this.itemParentIndex);
                selectedItem.active = true;
                this.applyFilters(selectedItem);
            },
            ...mapActions("searchFilters", ["resetFilterButtons"])
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

</style>
