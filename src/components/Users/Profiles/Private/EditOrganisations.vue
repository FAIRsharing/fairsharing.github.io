<template>
  <v-container fluid>
    <v-snackbar
      v-model="showFailedAction"
      class="text-body text-center"
      color="error"
    >
      <div class="text-center w-100">
        You have already added this organisation in your list!
      </div>
    </v-snackbar>

    <v-snackbar
      v-model="showSuccessAction"
      class="text-body text-center"
      color="success"
    >
      <div class="text-center w-100">
        Successfully {{ successTerm }} the organisation in your list!
      </div>
    </v-snackbar>

    <v-row>
      <v-col v-if="userCanEditOrganisation" cols="12" lg="6" md="12" xl="6">
        <v-card>
          <v-card-title class="d-flex align-center">
            Available Organisations
            <v-spacer />
            <v-text-field
              v-model="search"
              append-inner-icon="fas fa-search"
              density="compact"
              hide-details
              label="Search"
              single-line
            />
          </v-card-title>

          <v-data-table
            v-model="selected"
            :headers="
              userCanEditOrganisation
                ? headersAvailableOrganisations
                : headersAvailableOrganisations.filter(
                    (item) => item.title !== 'action',
                  )
            "
            :items="allOrganisations"
            :items-per-page="perPage"
            :loading="loadingAllOrganisations"
            :search="search"
            class="elevation-1"
            item-value="name"
          >
            <template #[`item.name`]="{ item }">
              <router-link :to="'/organisations/' + item.id">
                {{ item.name }}
              </router-link>
            </template>

            <template #[`item.homepage`]="{ item }">
              <a :href="item.homepage" rel="noopener" target="_blank">
                {{ item.homepage }}
              </a>
            </template>

            <template #[`item.types`]="{ item }">
              {{ item.types?.join(", ") }}
            </template>

            <template
              v-if="userCanEditOrganisation"
              #[`item.actions`]="{ item }"
            >
              <v-btn
                icon
                size="small"
                variant="text"
                @click="AddToUsersOrganisations(item)"
              >
                <v-icon>fas fa-plus-circle</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col
        :lg="userCanEditOrganisation ? 6 : 12"
        :xl="userCanEditOrganisation ? 6 : 12"
        cols="12"
        md="12"
      >
        <v-card-title class="d-flex align-center">
          <span v-if="userCanEditOrganisation">User Organisations</span>
          <v-spacer />
          <v-text-field
            v-if="userOrganisations.length > 10"
            v-model="userOrganisationsSearch"
            append-inner-icon="fas fa-search"
            density="compact"
            hide-details
            label="Search"
            single-line
          />
        </v-card-title>

        <div class="d-flex align-center mb-4">
          <v-btn
            v-if="userCanEditOrganisation"
            class="mt-2 ml-2"
            color="success"
            icon="fas fa-plus"
            size="small"
            @click="AddNewOrganisation.show = true"
          >
          </v-btn>
          <b v-if="userCanEditOrganisation" class="ml-2 mt-2"
            >Add a new Organisation</b
          >
        </div>

        <v-data-table
          :headers="
            userCanEditOrganisation
              ? headers
              : headers.filter((item) => item.title !== 'action')
          "
          :items="userOrganisations"
          :items-per-page="perPage"
          :loading="loading"
          :search="userOrganisationsSearch"
          class="elevation-1"
        >
          <template #top>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Are you sure?</v-card-title>
                <v-card-text
                  >Are you sure you want to delete this item?</v-card-text
                >
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="red-darken-1"
                    variant="elevated"
                    @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn
                    color="blue-darken-1"
                    variant="elevated"
                    @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <template #[`item.name`]="{ item }">
            <router-link :to="'/organisations/' + item.id">
              {{ item.name }}
            </router-link>
          </template>

          <template #[`item.homepage`]="{ item }">
            <a :href="item.homepage" rel="noopener" target="_blank">
              {{ item.homepage }}
            </a>
          </template>

          <template #[`item.organisationTypes`]="{ item }">
            {{ objToList(item.organisationTypes) }}
          </template>

          <template v-if="userCanEditOrganisation" #[`item.actions`]="{ item }">
            <v-btn icon size="small" variant="text" @click="deleteItem(item)">
              <v-icon>fas fa-trash</v-icon>
            </v-btn>
          </template>

          <template #no-data>
            <div class="pa-4">You are not a member of any organisations.</div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="AddNewOrganisation.show" max-width="1200px" persistent>
      <v-card border="dashed opacity-50" class="bg-grey-lighten-3 pa-3">
        <v-card-title>Create a new organisation</v-card-title>

        <v-card-text v-if="AddNewOrganisation.error" class="pb-0">
          <v-alert class="mb-4" closable type="error">
            {{ AddNewOrganisation.error.response?.data || "An error occurred" }}
          </v-alert>
        </v-card-text>

        <v-card-text>
          <v-form
            ref="createNewOrganisationForm"
            v-model="AddNewOrganisation.formValid"
          >
            <v-row>
              <v-col class="pb-0" cols="12">
                <v-text-field
                  v-model="AddNewOrganisation.data.name"
                  :rules="[rules.isRequired()]"
                  label="Organisation Name"
                  variant="outlined"
                />
              </v-col>
              <v-col class="pb-0" cols="12">
                <v-text-field
                  v-model="AddNewOrganisation.data.homepage"
                  :rules="[rules.isRequired(), rules.isURL()]"
                  label="Organisation Homepage"
                  variant="outlined"
                />
              </v-col>
              <v-col class="pb-0" cols="12">
                <v-autocomplete
                  v-model="AddNewOrganisation.data.organisation_type_ids"
                  :items="organisationsTypes"
                  :rules="[rules.isRequired(), rules.isLongEnough(1)]"
                  chips
                  item-title="name"
                  item-value="id"
                  label="Select type(s)"
                  multiple
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="!AddNewOrganisation.formValid"
            :loading="AddNewOrganisation.loading"
            color="success"
            variant="elevated"
            @click="createNewOrganisation()"
          >
            Save new organisation
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="AddNewOrganisation.show = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import RestClient from "@/lib/Client/RESTClient.js";
import { isLongEnough, isRequired, isUrl } from "@/utils/rules.js";

const restClient = new RestClient();

export default {
  name: "EditOrganisations",
  data: () => {
    return {
      loading: false,
      loadingAllOrganisations: false,
      dialogDelete: false,
      showFailedAction: false,
      selectedOrganisationID: -1,
      selected: [],
      search: "",
      userOrganisationsSearch: "",
      userOrganisations: [],
      allOrganisations: [],
      userCanEditOrganisation: false,
      showSuccessAction: false,
      successTerm: "added", // or 'deleted',
      showAddOrganisationDialog: false,
      AddNewOrganisation: {
        show: false,
        data: {},
        loading: false,
        formValid: false,
        logoData: null,
        error: false,
      },
      rules: {
        isRequired: () => isRequired(),
        isURL: () => isUrl(),
        isLongEnough: (val) => isLongEnough(val),
      },
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapState("editor", ["organisations", "organisationsTypes"]),
    userIsLoggedIn() {
      return this.user().isLoggedIn;
    },
    headers() {
      return [
        { title: "Name", value: "name", align: "center" },
        {
          title: "Types",
          value: "organisationTypes",
          align: "center",
          sortable: false,
        },
        {
          title: "Homepage",
          value: "homepage",
          align: "center",
          sortable: false,
        },
        { title: "action", value: "actions", align: "center", sortable: false },
      ];
    },
    headersAvailableOrganisations() {
      return [
        { title: "Name", value: "name", align: "center" },
        { title: "Types", value: "types", align: "center", sortable: false },
        {
          title: "Homepage",
          value: "homepage",
          align: "center",
          sortable: false,
        },
        { title: "action", value: "actions", align: "center", sortable: false },
      ];
    },
    perPage() {
      return 5;
    },
    footer() {
      return { "items-per-page-options": [5] };
    },
  },
  watch: {
    async userIsLoggedIn() {
      await this.loadUserOrganisationData();
      this.viewerCanManipulate();
    },
    async "$route.path"() {
      await this.loadUserOrganisationData();
      this.viewerCanManipulate();
    },
  },
  async mounted() {
    this.loadingAllOrganisations = true;
    await Promise.all([
      this.getOrganisationsTypes(),
      this.loadUserOrganisationData(),
      this.getOrganisations(),
    ]);
    this.loadingAllOrganisations = false;
    this.allOrganisations = this.organisations;
    this.viewerCanManipulate();
  },
  methods: {
    ...mapActions("users", [
      "updateUser",
      "getUser",
      "getPublicUser",
      "updatePublicUser",
    ]),
    ...mapActions("editor", ["getOrganisations", "getOrganisationsTypes"]),
    viewerCanManipulate() {
      if (this.user().isLoggedIn) {
        if (
          this.$route.name === "EditPublicProfile" &&
          this.user().id === Number(this.$route.params.id)
        ) {
          this.userCanEditOrganisation = true;
          return;
        } else if (
          this.$route.name === "EditPublicProfile" &&
          this.user().is_super_curator
        ) {
          this.userCanEditOrganisation = true;
          return;
        } else if (this.$route.name === "Edit profile") {
          this.userCanEditOrganisation = true;
          return;
        }
      }
      this.userCanEditOrganisation = false;
    },
    async loadUserOrganisationData() {
      // if it is the Public Profile route
      this.loading = true;
      if (this.$route.params.id) {
        let userId = this.$route.params.id;
        let { user } = await this.getPublicUser(userId);
        /* istanbul ignore else */
        if (user) {
          this.userOrganisations = user.organisations;
        } else {
          this.userOrganisations = [];
        }
      }
      // if it is the Private Profile route
      else {
        await this.getUser();
        this.userOrganisations = this.user().records.organisations;
      }
      this.loading = false;
    },
    objToList(obj) {
      let names = [];
      obj.forEach((t) => {
        names.push(t.name);
      });
      return names.join(", ");
    },
    closeDelete() {
      this.dialogDelete = false;
      this.selectedOrganisationID = -1;
    },
    deleteItem(item) {
      this.dialogDelete = true;
      this.selectedOrganisationID = item.id;
    },
    async AddToUsersOrganisations(item) {
      if (this.userOrganisations.every((el) => el.id !== item.id)) {
        item.organisationTypes = item.types.map((obj) => {
          return { name: obj };
        });
        this.userOrganisations.push(item);
        await this.persistUserOrganisations();
        this.successTerm = "added";
        this.showSuccessAction = true;
      } else {
        this.showFailedAction = true;
      }
    },
    async deleteItemConfirm() {
      this.userOrganisations.splice(
        this.userOrganisations.findIndex(
          (item) => item.id === this.selectedOrganisationID,
        ),
        1,
      );
      await this.persistUserOrganisations();
      this.closeDelete();
      this.successTerm = "deleted";
      this.showSuccessAction = true;
    },
    async persistUserOrganisations() {
      let newUser = {
        id: this.user().id,
        organisation_ids: this.userOrganisations.map((item) => item.id),
      };
      if (
        this.$route.name === "EditPublicProfile" &&
        this.user().is_super_curator
      ) {
        newUser.id = this.$route.params.id;
        await this.updatePublicUser(newUser);
      } else {
        await this.updateUser(newUser);
      }
      await this.loadUserOrganisationData();
    },
    async createNewOrganisation() {
      this.AddNewOrganisation.loading = true;
      this.AddNewOrganisation.error = false;
      let organisationInput = JSON.parse(
        JSON.stringify(this.AddNewOrganisation.data),
      );
      if (this.AddNewOrganisation.logoData) {
        organisationInput.logo = this.AddNewOrganisation.logoData;
        organisationInput.logo.data = organisationInput.logo.data.replace(
          "data:image/png;base64,",
          "",
        );
      }
      organisationInput.organisation_type_ids =
        organisationInput.organisation_type_ids.map((obj) => obj.id);
      let data = await restClient.createOrganisation(
        organisationInput,
        this.user().credentials.token,
      );
      if (!data.error) {
        this.AddNewOrganisation.show = null;
        this.AddNewOrganisation.data = {};
        this.AddNewOrganisation.loading = false;
        // assign the created organisation to user if route is EditPublicUser
        if (this.$route.name === "EditPublicProfile") {
          this.userOrganisations.push({ id: data.id });
          let newUserData = {
            id: this.$route.params.id,
            organisation_ids: this.userOrganisations.map((item) => item.id),
          };
          await this.updatePublicUser(newUserData);
        }
        await this.loadUserOrganisationData();
        this.loadingAllOrganisations = true;
        await this.getOrganisations();
        await this.getOrganisations();
        this.loadingAllOrganisations = false;
        this.allOrganisations = this.organisations;
        this.showSuccessAction = true;
        this.successTerm = "added";
      } else {
        this.AddNewOrganisation.error = data.error;
      }
    },
  },
};
</script>
