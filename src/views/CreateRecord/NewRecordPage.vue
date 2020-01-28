<template>
  <div
    id="new"
    class="new"
  >
    <h2>Create new records</h2>

    <button
      id="new_database_button"
      type="button"
    >
      <router-link to="/new/database">
        Database
      </router-link>
    </button>

    <button
      id="new_standard_button"
      type="button"
    >
      <router-link to="/new/standard">
        Standard
      </router-link>
    </button>

    <button
      id="new_policy_button"
      type="button"
    >
      <router-link to="/new/policy">
        Policy
      </router-link>
    </button>

    <button
      id="new_collection_button"
      type="button"
    >
      <router-link to="/new/collection">
        Collection
      </router-link>
    </button>
  </div>
</template>

<script>
    /** Component to generate the new record page and its buttons to redirect to new collection, standard, policy and database
     *
     */
    export default {
        name: "NewRecordPage"
    }
</script>

<style scoped>

</style>