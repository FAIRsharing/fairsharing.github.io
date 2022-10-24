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
    <v-layout
      row
      justify-center
    >
      <v-dialog
        v-model="showRemoveWatcher"
        max-width="700px"
      >
        <v-card>
          <v-card-title
            class="headline"
          >
            Also remove this maintainer as watcher?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="completeRemoval(false)"
            >
              No
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="completeRemoval(true)"
            >
              Yes
            </v-btn>
            <v-spacer />
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
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
      formValid: false,
      showRemoveWatcher: false,
      watcherToRemove: null
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
    watchers:{
      get(){
        return this.getSection("generalInformation").data.watchers;
      }
    },
    initialMaintainer(){
      return this.getSection('generalInformation').initialData.maintainers
    }
  },
  async mounted() {
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
      let _module = this;
      let maintainerId = this.maintainers[maintainerIndex].id;
      this.maintainers.splice(maintainerIndex, maintainerIndex+1)
      if (_module.watchers.some(m => m.id === maintainerId)) {
        this.watcherToRemove = maintainerId;
        this.showRemoveWatcher = true;
      }
    },
    completeRemoval(removeWatcher) {
      let _module = this;
      console.log("Removing: " + _module.watcherToRemove);
      if (removeWatcher) {
        let index = _module.watchers.findIndex( element => {
          if (element.id === _module.watcherToRemove) {
            console.log("Found user: " + _module.watcherToRemove);
            return true;
          }
        });
        _module.watchers.splice(index, index+1);
      }
      this.showRemoveWatcher = false;
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
      return this.maintainers.some(m => m.id === item.id);
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
