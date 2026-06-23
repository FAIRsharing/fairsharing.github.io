export const bootstrapApp = async (store, router) => {
  try {
    await store.dispatch("users/login");
    await store.dispatch("introspection/fetchParameters");
    await store.dispatch("searchFilters/assembleFilters");
    await store.dispatch("messages/setMessages");
  }
  catch (error) {
    if (store && error.response && error.response.status === 503) {
      store.commit("introspection/setMaintenanceMode");
    }
    else if (router) {
      await router.replace("/error/500");
    }
    else {
      console.error(
        "Bootstrap failed and router instance was unavailable:",
        error,
      );
    }
  }
};

export const globalFilters = {
  cleanString(str) {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (match) {
        return match.toUpperCase();
      });
  },
  capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
