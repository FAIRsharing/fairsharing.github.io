import store from "../store";
import router from "../router";

export const bootstrapApp = async () => {
  try {
    await store.dispatch("users/login");
    await store.dispatch("introspection/fetchParameters");
    await store.dispatch("searchFilters/assembleFilters");
    await store.dispatch("messages/setMessages");
  } catch (error) {
    if (error.response && error.response.status === 503) {
      store.commit("introspection/setMaintenanceMode");
    } else {
      await router.replace("/error/500");
    }
  }
};

export const globalFilters = {
  cleanString(str) {
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, "$1") // Note: This replacement currently keeps the char as-is. Did you mean " $1" to add a space?
      .replace(/^./, function (str) {
        return str.toUpperCase();
      });
  },
  capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
