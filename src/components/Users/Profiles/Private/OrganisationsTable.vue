<template>
  <div>
    <!--  user existing organisations  -->
    <v-data-table
      :items="userOrganisations"
      :headers="userCanEditOrganisation?headers:headers.filter(item=>item.text!=='action')"
      :items-per-page="perPage"
      :footer-props="footer"
      :loading="loading"
      calculate-widths
    >
      <template v-slot:top>
        <v-dialog
          v-model="dialogDelete"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete this item?
            </v-card-title>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="closeDelete"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="deleteItemConfirm"
              >
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template #[`item.name`]="{ item }">
        <router-link
          :to="'/organisations/' + item.id"
        >
          {{ item.name }}
        </router-link>
      </template>

      <template #[`item.homepage`]="{ item }">
        <a
          :href="item.homepage"
          target="_blank"
        >
          {{ item.homepage }}
        </a>
      </template>

      <template #[`item.organisationTypes`]="{ item }">
        {{ objToList(item.organisationTypes) }}
      </template>


      <template
        v-if="userCanEditOrganisation"
        v-slot:item.actions="{ item }"
      >
        <v-icon
          small
          @click="deleteItem(item)"
        >
          {{ $vuetify.icons.values.delete }}
        </v-icon>
      </template>

      <template slot="no-data">
        <div>
          You are not a member of any organisations.
        </div>
      </template>
    </v-data-table>

    <!--  all available organisations  -->
    <h3 class="ml-5 mt-10">
      choose from one of the available organisation
    </h3>
    <v-card-title>
      Available Organisations
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
      v-model="selected"
      :headers="headersAvailableOrganisations"
      :items="allOrganisations"
      :search="search"
      item-key="name"
      show-select
      class="elevation-1"
    >
      <template #item.name="{ item }">
        {{ item.name }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "OrganisationsTable",
  data:()=> {
    return {
      loading:false,
      dialogDelete: false,
      selectedOrganisationID:-1,
      selected: [],
      search:'',
      userOrganisations:[],
      /*allOrganisations: [
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        }
      ],*/
      allOrganisations:[],
      userCanEditOrganisation:false
    }
  },
  computed: {
    ...mapState('users', ['user']),
    userIsLoggedIn(){
      return this.user().isLoggedIn;
    },
    headers() {
      return [
        {text: 'Name', value: 'name', align: 'center'},
        {text: 'Types', value: 'organisationTypes', align: 'center',sortable: false},
        {text: 'Homepage', value: 'homepage', align: 'center',sortable: false},
        {text: 'action', value: 'actions', align: 'center',sortable: false},
      ];
    },
    headersAvailableOrganisations() {
      return [
        {text: 'Organisation Name', value: 'name', align: 'center'},
        {text: 'Types', value: 'organisationTypes', align: 'center'},
        {text: 'Homepage', value: 'homepage', align: 'center'},
      ];
    },
    perPage(){
      return 5;
    },
    footer(){
      return {'items-per-page-options': [5]}
    }
  },
  watch:{
    async userIsLoggedIn() {
      await this.loadUserOrganisationData()
      this.viewerCanManipulate()
    },
      async '$route.path' () {
      await this.loadUserOrganisationData()
      this.viewerCanManipulate()
    }
  },
  async mounted() {
    await this.loadUserOrganisationData()
    this.viewerCanManipulate()
  },
  methods: {
    ...mapActions('users', ['updateUser','getUser','getPublicUser','updatePublicUser']),
    viewerCanManipulate() {
      if (this.user().isLoggedIn) {
        if (this.$route.name === 'PublicProfile' && this.user().id === Number(this.$route.params.id)) {
          this.userCanEditOrganisation = true;
          return
        }
        else if (this.$route.name === 'PublicProfile' && this.user().is_super_curator) {
          this.userCanEditOrganisation = true;
          return
        }
        else if (this.$route.name === 'User') {
          this.userCanEditOrganisation = true;
          return
        }
      }
      this.userCanEditOrganisation = false;
    },
    async loadUserOrganisationData() {
      // if it is the Public Profile route
      this.loading = true
      if (this.$route.params.id) {
        let userId = this.$route.params.id;
        let {user} = await this.getPublicUser(userId);
        this.userOrganisations = user.organisations;
      }
      // if it is the Private Profile route
      else {
        await this.getUser()
        this.userOrganisations = this.user().records.organisations
      }
      this.loading = false
    },
    objToList(obj) {
      let names = [];
      obj.forEach((t) => {
        names.push(t.name)
      })
      return names.join(", ");
    },
    closeDelete() {
      this.dialogDelete = false
      this.selectedOrganisationID = -1
    },
    deleteItem (item) {
      this.dialogDelete = true
      this.selectedOrganisationID = item.id
    },
    async deleteItemConfirm() {
      this.userOrganisations.splice(this.userOrganisations.findIndex(item => item.id === this.selectedOrganisationID), 1)
      let newUser = {
        id : this.user().id,
        organisation_ids: this.userOrganisations.map(item=>item.id)
      }
      if (this.$route.name === 'PublicProfile' && this.user().is_super_curator) {
        newUser.id = this.$route.params.id
        await this.updatePublicUser(newUser)
      }
      else {
        await this.updateUser(newUser)
      }
      await this.loadUserOrganisationData()
      this.closeDelete()
    }
  },
}
</script>
