<template>
  <vue-query-builder
    v-model="query"
    :rules="rules"
    :max-depth="3"
    :labels="labels"
  />
</template>

<script>
import VueQueryBuilder from "vue-query-builder";

import Input from "@/components/Records/Search/Input/QueryBuilderComponents/Registry.vue";
import advancedSearch from "@/store";
export default {
  name: "QueryBuilder1",
  components: { VueQueryBuilder },
  data: () => {
    return {
      query: {},
      rules: [
        {
          type: "custom-component",
          id: "_and",
          label: "And",
          component: Input,
        },
        // {
        //   type: "text",
        //   id: "_and",
        //   label: "And",
        // },
        {
          type: "text",
          id: "_or",
          label: "Or",
        },

        // {
        //   type: "radio",
        //   id: "fruit",
        //   label: "Fruit",
        //   choices: [
        //     { label: "Apple", value: "apple" },
        //     { label: "Banana", value: "banana" },
        //   ],
        // },
      ],
      labels: {
        matchType: "Operator",
        matchTypes: [
          { id: "_and", label: "And" },
          { id: "_or", label: "Or" },
        ],
        // matchType: null,
        // matchTypes: [{}],
        addRule: "Add Rule",
        removeRule: "&times;",
        // addGroup: "Add Group",
        // removeGroup: "&times;",
        addGroup: "",
        removeGroup: "",
        textInputPlaceholder: "value",
      },
    };
  },
  watch: {
    query(newValue) {
      let searchObj = newValue["children"].map(({ query }) => query);
      const noNullSearchObj = searchObj.filter(({ value }) => value);
      advancedSearch.commit("advancedSearch/setAdvancedQuery", noNullSearchObj);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~vuetify/src/styles/settings/_variables.scss";
.vue-query-builder::v-deep {
  //color: black;
  .vqb-group .rule-actions {
    margin-bottom: 20px;
  }
  .vqb-rule {
    margin-top: 15px;
    margin-bottom: 15px;
    background-color: #27aae1;
    border-color: #27aae1;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  }

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
  }

  .close {
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

  .form-group,
  .match-type-container {
    select {
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
      min-width: 80px;
    }
    .btn {
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
      &:nth-child(3) {
        display: none;
      }
    }
  }
  .match-type-container {
    //display: none;
    background-color: #ababab;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
    label {
      color: white;
      font-weight: 500;
    }
  }
  input[type="text"] {
    background-color: white;
    padding: 0 12px;
    min-height: 36px;
    max-width: 270px;
    width: 100%;
    border-radius: 4px;
    @media #{map-get($display-breakpoints, 'sm-and-down')} {
      max-width: 100%;
    }
  }
  .vqb-rule {
    .form-inline {
      display: flex;
      align-items: center;
      flex-direction: row;
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        flex-direction: column;
        align-items: unset;
        position: relative;
      }

      label {
        display: inline-block;
        width: 30px;
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

      //.close {
      //  opacity: 1;
      //  color: white;
      //  background-color: #6b1e1e;
      //  font-size: 25px;
      //  border-radius: 50%;
      //  width: 30px;
      //  height: 30px;
      //  margin-left: 8px !important;
      //  vertical-align: middle;
      //  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      //    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      //    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      //  @media #{map-get($display-breakpoints, 'sm-and-down')} {
      //    position: absolute;
      //    right: 0;
      //    top: -5px;
      //  }
      //}
    }
  }
}
</style>
