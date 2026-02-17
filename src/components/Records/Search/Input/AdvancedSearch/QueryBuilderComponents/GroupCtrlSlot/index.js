export { default as GeneralRule } from "./GeneralRule.vue";
export { default as DatabaseRule } from "./DatabaseRule.vue";
export { default as PolicyRule } from "./PolicyRule.vue";
export { default as StandardRule } from "./StandardRule.vue";
export { default as FairassistRule } from "./FairassistRule.vue";

export const DatabaseRule = () =>
  import("./DatabaseRule.vue");

export const PolicyRule = () =>
  import("./PolicyRule.vue");
export const StandardRule = () =>
  import("./StandardRule.vue");