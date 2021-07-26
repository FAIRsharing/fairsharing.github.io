<template>
  <v-container fluid>
    <v-snackbar
      v-model="showFailedAction"
      color="red"
      class="text-body text-center"
    >
      <span class="text-center">
        You have already added this organisation in your list!
      </span>
    </v-snackbar>
    <v-snackbar
      v-model="showSuccessAction"
      color="green"
      class="text-body text-center"
    >
      <span class="text-center">
        Successfully {{ successTerm }} the organisation in your list!
      </span>
    </v-snackbar>
    <v-row>
      <v-col
        v-if="userCanEditOrganisation"
        cols="12"
        md="12"
        lg="6"
        xl="6"
      >
        <!--  all available organisations  -->
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
          :headers="userCanEditOrganisation?headersAvailableOrganisations:headersAvailableOrganisations.filter(item=>item.text!=='action')"
          :items="allOrganisations"
          :search="search"
          :loading="loadingAllOrganisations"
          :items-per-page="perPage"
          :footer-props="footer"
          item-key="name"
          class="elevation-1"
        >
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
          <template #[`item.types`]="{ item }">
            {{ item.types.join(', ') }}
          </template>
          <template
            v-if="userCanEditOrganisation"
            #item.actions="{ item }"
          >
            <v-icon
              small
              @click="AddToUsersOrganisations(item)"
            >
              {{ $vuetify.icons.values.plus }}
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
      <v-col
        cols="12"
        md="12"
        :lg="userCanEditOrganisation?6:12"
        :xl="userCanEditOrganisation?6:12"
      >
        <!--  user existing organisations  -->
        <v-card-title>
          <span v-if="userCanEditOrganisation">User Organisations</span>
          <v-spacer />
          <v-text-field
            v-if="userOrganisations.length>10"
            v-model="userOrganisationsSearch"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <div class="d-flex align-center mb-4">
          <v-btn
            v-if="userCanEditOrganisation"
            fab
            small
            class="green white--text mt-2 ml-2"
            @click="AddNewOrganisation.show = true"
          >
            <v-icon small>
              fa-plus
            </v-icon>
          </v-btn>
          <b
            v-if="userCanEditOrganisation"
            class="ml-2"
          >Add a new Organisation</b>
        </div>
        <v-data-table
          :search="userOrganisationsSearch"
          :items="userOrganisations"
          :headers="userCanEditOrganisation?headers:headers.filter(item=>item.text!=='action')"
          :items-per-page="perPage"
          :footer-props="footer"
          :loading="loading"
          calculate-widths
          class="elevation-1"
        >
          <template #top>
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
            #item.actions="{ item }"
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
      </v-col>
    </v-row>
    <!--  create a new organisation card   -->
    <v-expand-transition>
      <v-overlay
        v-if="AddNewOrganisation.show === true"
        :dark="false"
        :absolute="false"
        opacity="0.8"
      >
        <v-card
          class="elevation-0 lighten-3 grey mb-10 pb-3 px-3"
          style="border: 2px dashed grey !important; border-radius:5px;max-width: 1200px"
        >
          <v-card-title>Create a new organisation</v-card-title>
          <v-card-text
            v-if="AddNewOrganisation.error"
            class="mb-0 pb-0"
          >
            <v-alert
              type="error"
              class="mb-0"
            >
              {{ AddNewOrganisation.error.response.data }}
            </v-alert>
          </v-card-text>
          <v-card-text>
            <v-form
              id="createNewOrganisation"
              ref="createNewOrganisation"
              v-model="AddNewOrganisation.formValid"
            >
              <v-container fluid>
                <v-row>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="AddNewOrganisation.data.name"
                      label="Organisation Name"
                      outlined
                      :rules="[rules.isRequired()]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-text-field
                      v-model="AddNewOrganisation.data.homepage"
                      label="Organisation Homepage"
                      outlined
                      :rules="[rules.isRequired(), rules.isURL()]"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="pb-0"
                  >
                    <v-autocomplete
                      v-model="AddNewOrganisation.data.organisation_type_ids"
                      :items="organisationsTypes"
                      multiple
                      outlined
                      item-text="name"
                      item-value="id"
                      return-object
                      label="Select the organisation type(s)"
                      :rules="[rules.isRequired(),rules.isLongEnough(1)]"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-if="false"
                      v-model="AddNewOrganisation.data.logo"
                      accept="image/png, image/jpeg"
                      label="File input"
                      placeholder="Select a logo"
                      outlined
                      :show-size="1000"
                      clearable
                      chips
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="success"
              :disabled="!AddNewOrganisation.formValid"
              :loading="AddNewOrganisation.loading"
              @click="createNewOrganisation()"
            >
              Save new organisation
            </v-btn>
            <v-btn
              class="error"
              @click="AddNewOrganisation.show = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </v-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import { isRequired, isUrl,isLongEnough } from "@/utils/rules.js"
import RestClient from "@/lib/Client/RESTClient.js"
const restClient = new RestClient();

export default {
  name: "OrganisationsTable",
  data:()=> {
    return {
      loading:false,
      loadingAllOrganisations:false,
      dialogDelete: false,
      showFailedAction:false,
      selectedOrganisationID:-1,
      selected: [],
      search:'',
      userOrganisationsSearch:'',
      userOrganisations:[],
      allOrganisations:[],
      userCanEditOrganisation:false,
      showSuccessAction:false,
      successTerm:'added', // or 'deleted',
      showAddOrganisationDialog:false,
      AddNewOrganisation: {
        show:false,
        data: {},
        loading: false,
        formValid: false,
        logoData: null,
        error: false
      },
      rules: {
        isRequired: ()=> isRequired(),
        isURL: ()=> isUrl(),
        isLongEnough: (val)=> isLongEnough(val),
      },
    }
  },
  computed: {
    ...mapState('users', ['user']),
    ...mapState('editor', ['organisations','organisationsTypes']),
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
        {text: 'Name', value: 'name', align: 'center'},
        {text: 'Types', value: 'types', align: 'center',sortable: false},
        {text: 'Homepage', value: 'homepage', align: 'center',sortable: false},
        {text: 'action', value: 'actions', align: 'center',sortable: false},
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
    this.loadingAllOrganisations = true
    await Promise.all([
    this.getOrganisationsTypes(),
    this.loadUserOrganisationData(),
    this.getOrganisations()
    ]);
    this.loadingAllOrganisations = false
    this.allOrganisations = this.organisations
    this.viewerCanManipulate();
  },
  methods: {
    ...mapActions('users', ['updateUser','getUser','getPublicUser','updatePublicUser']),
    ...mapActions("editor", ["getOrganisations","getOrganisationsTypes"]),
    viewerCanManipulate() {
      if (this.user().isLoggedIn) {
        if (this.$route.name === 'EditPublicProfile' && this.user().id === Number(this.$route.params.id)) {
          this.userCanEditOrganisation = true;
          return
        }
        else if (this.$route.name === 'EditPublicProfile' && this.user().is_super_curator) {
          this.userCanEditOrganisation = true;
          return
        }
        else if (this.$route.name === 'Edit profile') {
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
    async AddToUsersOrganisations(item) {
      if (this.userOrganisations.every(el => el.id !== item.id)) {
        item.organisationTypes = item.types.map(obj => {
          return {name: obj}
        })
        this.userOrganisations.push(item)
        await this.persistUserOrganisations()
        this.successTerm = 'added'
        this.showSuccessAction = true
      }
      else {
        this.showFailedAction = true
      }
    },
    async deleteItemConfirm() {
      this.userOrganisations.splice(this.userOrganisations.findIndex(item => item.id === this.selectedOrganisationID), 1)
      await this.persistUserOrganisations()
      this.closeDelete()
      this.successTerm = 'deleted'
      this.showSuccessAction = true
    },
    async persistUserOrganisations() {
      let newUser = {
        id: this.user().id,
        organisation_ids: this.userOrganisations.map(item => item.id)
      }
      if (this.$route.name === 'EditPublicProfile' && this.user().is_super_curator) {
        newUser.id = this.$route.params.id
        await this.updatePublicUser(newUser)
      }
      else {
        await this.updateUser(newUser)
      }
      await this.loadUserOrganisationData()
    },
    async createNewOrganisation() {
      this.AddNewOrganisation.loading = true;
      this.AddNewOrganisation.error = false;
      let organisationInput = JSON.parse(JSON.stringify(this.AddNewOrganisation.data));
      if (this.AddNewOrganisation.logoData){
        organisationInput.logo = this.AddNewOrganisation.logoData;
        organisationInput.logo.data = organisationInput.logo.data.replace("data:image/png;base64,", "");
      }
      organisationInput.organisation_type_ids = organisationInput.organisation_type_ids.map(obj => obj.id);
      let data = await restClient.createOrganisation(organisationInput, this.user().credentials.token);
      if (!data.error) {
        this.AddNewOrganisation.show = null;
        this.AddNewOrganisation.data = {};
        this.AddNewOrganisation.loading = false;
        // assign the created organisation to user if route is EditPublicUser
        if (this.$route.name === 'EditPublicProfile') {
          this.userOrganisations.push({id:data.id})
          let newUserData = {
            id: this.$route.params.id,
            organisation_ids: this.userOrganisations.map(item => item.id)
          }
          await this.updatePublicUser(newUserData)
        }
        await this.loadUserOrganisationData();
        this.loadingAllOrganisations = true
        await this.getOrganisations()
        await this.getOrganisations()
        this.loadingAllOrganisations = false
        this.allOrganisations = this.organisations
        this.showSuccessAction = true
        this.successTerm = 'added'
      }
      else {
        this.AddNewOrganisation.error = data.error;
      }
    }
  }
}
</script>
