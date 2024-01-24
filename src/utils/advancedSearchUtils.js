import { uniqWith } from "lodash";

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

export { removeItem, uniqueValues };
