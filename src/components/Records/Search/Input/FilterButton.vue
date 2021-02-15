<template>
  <v-tooltip
    bottom
    :disabled="itemModified.tooltip===undefined"
  >
    <template #activator="{ on }">
      <v-btn
        color="primary"
        class="mr-1 mr-lg-2"
        :outlined="!itemModified.active"
        :class="[isFirstItem && !doubleItems ? 'first-child' : 'flex-1', {'button-style-md-screens' : mdScreens, 'buttons-md-style' : multipleItems && !isFirstItem}]"
        @click="selectFilter(itemModified)"
        v-on="on"
      >
        <span v-if="itemModified.title!=='ALL'">{{ itemModified.title }}</span>
        <v-icon
          v-else
          small
          color="primary"
        >
          {{ $vuetify.icons.values.loading }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ itemModified.tooltip }}</span>
  </v-tooltip>
</template>

<script>
    import { isEqual } from "lodash";
    import { mapActions } from 'vuex'
    import currentParameter from "@/utils/currentParameterMixin.js"

    export default {
        name: "FilterButton",
        mixins: [currentParameter],
        props: {
            item: {default: null, type: Object},
            isFirstItem: {default: false, type: Boolean},
            mdScreens: {default: null, type: Boolean},
            itemParentIndex: {default: 0, type: Number},
            multipleItems: {default: false, type: Boolean},
            doubleItems: {default: false, type: Boolean},
        },
        data: () => {
          return {
            itemModified: {default: null, type: Object}
          }
        },
        watch: {
          currentParameter: {
            handler(newVal) {
              const _module = this;
              const fieldName = _module.itemModified.filterName;
              const fieldValue = newVal[fieldName];
              const currentValue = _module.itemModified.value;
              const title = _module.itemModified.title;
              _module.checkCurrentParameters(title, fieldValue, currentValue);
            },
            deep: true
          }
        },
        mounted(){
          this.$nextTick(function () {
            const _module = this;
            _module.itemModified = JSON.parse(JSON.stringify(this.item));
            const fieldValue = _module.currentParameter[this.itemModified.filterName];
            const currentValue = _module.itemModified.value;
            const title = _module.itemModified.title;
            _module.checkCurrentParameters(title, fieldValue, currentValue);
          });
        },
        methods: {
            checkCurrentParameters: function(title, fieldValue, currentValue) {
              if (fieldValue === null) {
                this.itemModified.active = title === 'all' || title === 'match all terms';
              }
              else {
                if (currentValue === undefined) {
                  this.itemModified.active = false;
                }
                else {
                  this.itemModified.active = currentValue.toString() === fieldValue;
                }
              }
            },
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function (selectedItem) {
                const _module = this;
                let currentQuery = {};
                let oldQuery = {};
                Object.keys(_module.$route.query).forEach(function (param) {
                    currentQuery[param] = _module.$route.query[param];
                    oldQuery[param] = _module.$route.query[param]
                });

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
                    delete currentQuery[selectedItem.filterName];
                    this.$router.push({
                        name: _module.$route.name,
                        query: currentQuery
                    });

                }
            },
            selectFilter: function (selectedItem) {
                let _module = this;
                _module.resetFilterButtons(_module.itemParentIndex);
                _module.activateButton({
                    'activeItem': selectedItem,
                    'itemParentIndex': _module.itemParentIndex
                });
                this.applyFilters(selectedItem);
            },
            ...mapActions("searchFilters", ["resetFilterButtons", "activateButton"])
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
