<template>
  <query-builder
    v-model="query"
    :config="config"
  />
</template>

<script>
import QueryBuilder from "query-builder-vue";
import { mapGetters } from "vuex";

import Registry from "@/components/Records/Search/Input/QueryBuilderComponents/Registry.vue";
import RegistryType from "@/components/Records/Search/Input/QueryBuilderComponents/RegistryType.vue";
import Subject from "@/components/Records/Search/Input/QueryBuilderComponents/Subject.vue";
import advancedSearch from "@/store";
export default {
  name: "QueryBuilderView",
  components: { QueryBuilder },
  props: {
    isDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      query: {
        operatorIdentifier: "_and",
        children: [],
      },
    };
  },
  computed: {
    ...mapGetters("advancedSearch", [
      "getEditDialogStatus",
      "getEditAdvancedSearch",
    ]),
    config() {
      return {
        operators: [
          {
            name: "AND",
            identifier: "_and",
          },
          {
            name: "OR",
            identifier: "_or",
          },
        ],
        rules: [
          {
            identifier: "registry",
            name: "Registry",
            component: Registry,
            initialValue: () => [],
          },
          {
            identifier: "type",
            name: "RegistryType",
            component: RegistryType,
            initialValue: "",
          },
          {
            identifier: "subjects",
            name: "Subject",
            component: Subject,
            initialValue: "",
          },
        ],
        colors: [
          "hsl(88, 50%, 55%)",
          "hsl(187, 100%, 45%)",
          "hsl(15, 100%, 55%)",
        ],
      };
    },
  },
  watch: {
    query(newValue) {
      advancedSearch.commit("advancedSearch/setAdvancedSearch", newValue);
      if (newValue["children"] && newValue["children"].length) {
        advancedSearch.commit("advancedSearch/setEditAdvancedSearch", newValue);
      }
    },

    /**
     * Reset the dialog box when closed and opened again
     * @param open - Boolean
     */
    isDialog: {
      handler(open) {
        if (open && !this.getEditDialogStatus) {
          this.query = {
            operatorIdentifier: "_and",
            children: [],
          };
        }
      },
      immediate: true,
    },

    /**
     * Populate the dialog box with advanced search selection
     * @param open - Boolean
     */
    getEditDialogStatus: {
      handler(open) {
        if (open) {
          this.query = this.getEditAdvancedSearch;
        }
      },
      immediate: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables.scss";
.query-builder-group::v-deep {
  color: black;

  select {
    background-image: linear-gradient(45deg, transparent 50%, gray 50%),
      linear-gradient(135deg, gray 50%, transparent 50%);
    background-position: calc(100% - 20px) calc(1em + 2px),
      calc(100% - 15px) calc(1em + 2px), calc(100% - 2.5em) 0.5em;
    background-size: 5px 5px, 5px 5px, 1px 1.5em;
    background-repeat: no-repeat;
    background-color: white;
    border-radius: 4px;
    display: inline-block;
    line-height: 1.5em;
    padding: 0 12px;
    /* reset */
    margin: 0;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    min-height: 36px;
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .query-builder-child__delete-child {
    opacity: 1;
    color: white;
    background-color: #6b1e1e;
    font-size: 25px;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    margin-left: 8px !important;
    vertical-align: middle;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      position: absolute;
      right: 0;
      top: -5px;
    }
  }
  .query-builder-group__rule-adding-button,
  .query-builder-group__group-adding-button {
    padding: 0 8px;
    height: 36px;
    min-width: 64px;
    color: white;
    background-color: #e67e22;
    border-color: #e67e22;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    font-weight: 500;
  }

  button:disabled,
  button[disabled] {
    border-color: #ccc;
    background-color: #ccc;
    color: #666666;
  }

  .query-builder-group__spacer,
  .query-builder-group__rule-adding-button,
  .query-builder-group__group-control select,
  .query-builder-group__group-children
    .query-builder-group__group-adding-button {
    display: none;
  }

  .query-builder-group__group-children {
    .query-builder-group__rule-adding-button,
    .query-builder-group__group-control select {
      display: block;
    }
  }

  .query-builder-group__group-selection {
    background-color: #ababab;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    .query-builder-group__group-operator {
      color: white;
      font-weight: 500;
    }
    select {
      max-width: 80px;
      width: 100%;
    }
  }
  input[type="text"] {
    background-color: white;
    padding: 0 12px;
    min-height: 36px;
    width: 90%;
    border-radius: 4px;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      max-width: 100%;
    }
  }

  .query-builder-child {
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 0;
    .query-builder-rule {
      background-color: #27aae1;
      border-color: #27aae1;
      display: flex;
      align-items: center;
    }
    .query-builder-child__component {
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        flex-direction: column;
        align-items: unset;
        position: relative;
      }
      .query-builder-rule__name {
        font-size: 14px;
        color: white;
        font-weight: 500;
        @media #{map-get($display-breakpoints, 'sm-and-down')} {
          margin-bottom: 10px;
        }
      }
      select {
        max-width: 150px;
        width: 100%;
        color: black;
        @media #{map-get($display-breakpoints, 'sm-and-down')} {
          max-width: 100%;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
