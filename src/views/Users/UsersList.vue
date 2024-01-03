<template>
  <v-container class="my-10">
    <v-card>
      <v-card-title>
        Users List
        <v-spacer />
        <v-text-field
          id="searchString"
          v-model="searchString"
          label="Search"
          single-line
          clearable
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
          text: 'username',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        {text: 'email', value: 'email',sortable: false},
        {text: 'Public Profile', value: 'id',sortable: false}
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
  beforeDestroy() {
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
