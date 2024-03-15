import { uniqWith } from "lodash";
import { mapGetters } from "vuex";

/**
 * Removes duplicate values in a set and returns unique values
 * @returns {Array} Array with non-duplicate values
 */
const uniqueValues = (item) => {
  let merged = uniqWith(item, (pre, cur) => {
    if (pre.identifier === cur.identifier) {
      cur["value"] = cur["value"] + "," + pre["value"];
      //Combine string values from different text-fields in same set and convert in into array
      /*istanbul ignore else */
      if (typeof cur["value"] === "string") {
        cur["value"] = cur["value"].split(",");
      }
      //Remove duplicates and create unique array
      cur["value"] = [...new Set(cur["value"])];
      return true;
    }
    return false;
  });
  return merged;
};

/**
 * Removes an item from the array
 * @param item
 * @param arrayList
 * @returns {Array} - updated array without the item
 */
const removeItem = (item, arrayList) => {
  const index = arrayList.indexOf(item);
  if (index >= 0) arrayList.splice(index, 1);
};

/**
 * Mixin to filter the records types based on the registry
 * {{computed: {getRecordTypes: Computed}, methods: {filteredRecordTypes(*): *[]}}}
 * @param {String} registryname
 * @return {Array} - recordTypes filtered by registryname
 */
const recordTypes = {
  computed: {
    ...mapGetters("recordTypes", ["getRecordTypes"]),
  },
  methods: {
    filteredRecordTypes(registry) {
      let filteredRecordTypes = [];
      this.getRecordTypes.filter(({ name, fairsharingRegistry }) => {
        if (fairsharingRegistry["name"] === registry) {
          filteredRecordTypes.push(name);
        }
      });
      return filteredRecordTypes;
    },
  },
};

export { recordTypes, removeItem, uniqueValues };
