import { uniqWith } from "lodash";

/**
 * Removes duplicate values in a set and returns unique values
 */
const uniqueValues = (item) => {
  let merged = uniqWith(item, (pre, cur) => {
    if (pre.identifier === cur.identifier) {
      cur["value"] = cur["value"] + "," + pre["value"];

      //Combine string values from different text-fields in same set and convert in into array
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

export { uniqueValues };
