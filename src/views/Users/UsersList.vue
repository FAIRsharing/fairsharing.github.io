<template>
  <v-container class="my-10">
    <v-card>
      <v-card-title class="d-flex">
        Users List
        <v-spacer />
        <v-text-field
          id="searchString"
          v-model="searchString"
          label="Search"
          clearable
          append-inner-icon="fas fa-search"
          variant="outlined"
          color="primary"
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="usersList"
        :loading="loading"
        loading-text="Loading... Please wait"
      >
        <template #[`item.id`]="{ item }">
          <router-link
            class="underline-effect"
            :to="`/users/${item.id}`"
          >
            {{ `https://fairsharing.org/users/${item.id}` }}
          </router-link>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex"

export default {
  name: "UsersList",
  data() {
    return {
      searchString: '',
      headers: [
        {
          title: 'Username',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        {title: 'Email', value: 'email',sortable: false},
        {title: 'Public Profile', value: 'id',sortable: false}
      ],
      loading:false
    }
  },
  computed: {
    ...mapState('users', ['usersList']),
  },
  watch: {
    async searchString(val){
      if (!val || val.length < 3) {
        return;
      }
      val = val.trim();
      this.loading = true;
      await this.getUsersList(val);
      this.loading = false;
    },
  },
  beforeUnmount() {
    this.cleanStore();
  },
  methods: {
    ...mapActions('users', ['getUsersList']),
    ...mapMutations('users', ['cleanStore'])
  }
}
</script>

<style scoped>
#edit_hide_email label {
  margin-bottom: 0 !important;
}
</style>
