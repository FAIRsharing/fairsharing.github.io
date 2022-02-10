<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editMaintainers"
    ref="editMaintainers"
    v-model="formValid"
    @submit.prevent="addItem()"
  >
    <div>Edit Maintainer information:</div>
    <v-chip-group
      class="mb-5 px-4 grey lighten-3"
      column
    >
      <v-chip
        v-for="(maintainer, index) in maintainers"
        :key="'maintainer_' + index"
        class="pr-3"
        :class="[!isNew(maintainer) ? 'white--text blue' : ' blue--text white borderBlue']"
      >
        <div>
          {{ maintainer['username'] }} ({{ maintainer['id'] }})
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-icon
                class="ml-3 white--text"
                v-bind="attrs"
                small
                @click="removeMaintainer(index)"
                v-on="on"
              >
                fa-times-circle
              </v-icon>
            </template>
            <span> Remove maintainer </span>
          </v-tooltip>
        </div>
      </v-chip>
      <v-spacer />
      <!--ADD NEW CONTACT -->
      <v-chip
        class="green white--text pr-5 shadowChip"
        @click="selectMaintainers()"
      >
        <v-icon
          small
          class="mr-3 white--text"
        >
          fa-plus-circle
        </v-icon> Add a maintainer
      </v-chip>
    </v-chip-group>

    <v-expand-transition class="ma-5">
      <v-overlay
        v-if="menu.content && menu.show"
        class="py-0"
        :dark="false"
        opacity="0.8"
      >
        <v-card width="800px">
          <v-card-title class="green white--text">
            Select Maintainers
            <v-spacer />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="usersList"
              :search="search"
              :loading="loading"
              loading-text="Loading... Please wait"
            >
              <template #[`item.username`]="{ item }">
                {{ item.username }}
              </template>
              <template #[`item.id`]="{ item }">
                <router-link
                  class="underline-effect"
                  :to="`/users/${item.id}`"
                >
                  {{ `https://fairsharing.org/users/${item.id}` }}
                </router-link>
              </template>
              <template #[`item.add`]="{ item }">
                <v-icon
                  :disabled="isAlreadyMaintainer(item)"
                  @click="addItem(item)"
                >
                  fas fa-plus-circle
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="warning"
              @click="menu.show = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </v-form>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex"
import { isEqual } from 'lodash'

export default {
  name: "Maintainers",
  data(){
    return {
      search: '',
      headers: [
        {
          text: 'Username',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        {text: 'Page', value: 'id',sortable: false},
        {text: 'Add', value: 'add', sortable: false}
      ],
      loading: false,
      menu: {
        show: false,
        label: "Add maintainer",
        content: null,
        index: null
      },
      formValid: false
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState('users', ['usersList']),
    maintainers:{
      get(){
        return this.getSection("generalInformation").data.maintainers;
      }
    },
    initialMaintainer(){
      return this.getSection('generalInformation').initialData.maintainers
    }
  },
  async mounted() {
    // TODO: This takes rather a long time and a GraphQL load=false query might be needed instead.
    this.loading = true;
    await this.getUsersList();
    this.loading = false;
  },
  methods: {
    ...mapActions('users', ['getUsersList']),
    selectMaintainers(){
      this.menu.show = true;
      this.menu.label = "Add maintainer";
      this.menu.index = null;
      this.menu.content = {
        name: null,
        id: null,
        orcid: null
      };
    },
    removeMaintainer(maintainerIndex){
      this.maintainers.splice(maintainerIndex, maintainerIndex+1)
    },
    addItem(item){
      let _module = this;
      let newMaintainer = {
        username: item.username,
        id: item.id,
        orcid: item.orcid
      }
      if (!_module.maintainers.some(m => m.id === item.id)) {
        _module.maintainers.push(newMaintainer);
      }
    },
    isNew(term){
      return !this.initialMaintainer.filter(obj => isEqual(obj, term))[0];
    },
    isAlreadyMaintainer(item) {
      let _module = this;
      if (_module.maintainers.some(m => m.id === item.id)) {
        return true;
      }
      return false;
    }
  }

}
</script>

<style scoped>
#editMaintainers .v-overlay__content {
  min-width: 700px;
}
#editMaintainers .borderBlue {
  border: 1px solid #2A9AF4 !important;
  background-color: white !important;
  border-color: #2A9AF4 !important;
}
#editMaintainers .v-chip.white {
  border-color: #2A9AF4 !important;
}
#editMaintainers .borderBlue * {
  color: #2A9AF4 !important;
}
</style>
