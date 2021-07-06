<template>
  <v-container class="my-10">
    <v-card>
      <v-card-title>
        Users List
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="usersList"
        :search="search"
        :loading="loading"
        loading-text="Loading... Please wait"
      >
        <template v-slot:item.id="{ item }">
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
import {mapActions, mapState} from "vuex"

export default {
  name: "UsersList",
  data() {
    return {
      search: '',
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
    ...mapState('users', ['usersList'])
  },
  async mounted() {
    this.loading = true;
    await this.getUsersList()
    this.loading = false;
  },
  methods: {
    ...mapActions('users', ['getUsersList'])
  }
}
</script>

<style scoped>
#edit_hide_email label {
  margin-bottom: 0 !important;
}
</style>
