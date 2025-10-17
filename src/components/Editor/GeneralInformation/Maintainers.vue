<template>
  <v-form
    id="editMaintainers"
    ref="editMaintainers"
    v-model="formValid"
    @submit.prevent="addItem()"
  >
    <div>Edit Maintainer information:</div>
    <v-chip-group
      class="mb-5 px-4 bg-grey-lighten-3"
      column
    >
      <v-chip
        v-for="(maintainer, index) in maintainers"
        :key="'maintainer_' + index"
        class="pr-3"
        :class="[!isNew(maintainer) ? 'text-white blue' : 'text-blue white borderBlue']"
        variant="outlined"
      >
        <div>
          {{ maintainer['username'] }} ({{ maintainer['id'] }})
          <v-tooltip location="top">
            <template #activator="{ props }">
              <v-icon
                class="ml-3 text-white"
                size="small"
                v-bind="props"
                @click="removeMaintainer(index)"
              >
                fas fa-times-circle
              </v-icon>
            </template>
            <span> Remove maintainer </span>
          </v-tooltip>
        </div>
      </v-chip>
      <v-spacer />
      <!--ADD NEW CONTACT -->
      <v-chip
        class="bg-green text-white pr-5 shadowChip"
        @click="selectMaintainers()"
      >
        <v-icon
          size="small"
          class="mr-3 text-white"
        >
          fas fa-plus-circle
        </v-icon> Add a maintainer
      </v-chip>
    </v-chip-group>
      <v-overlay
        v-model="menu['show']"
        opacity="0.8"
        class="align-center justify-center"
      >
        <v-card width="800px">
          <v-card-title class="bg-green text-white d-flex align-center">
            Select Maintainers
            <v-spacer />
            <v-text-field
              id="searchString"
              v-model="searchString"
              append-inner-icon="fas fa-search"
              label="Search"
              single-line
              variant="solo"
              hide-details
              bg-color="white"
              rounded="60"
              clearable
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
              class="bg-warning"
              @click="menu.show = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
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
            class="text-h5"
          >
            Also remove this maintainer as watcher?
          </v-card-title>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="completeRemoval(false)"
            >
              No
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
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
import { isEqual } from "lodash"
import {mapActions, mapGetters, mapState} from "vuex"

export default {
  name: "Maintainers",
  data(){
    return {
      searchString: '',
      headers: [
        {
          title: 'Username',
          align: 'start',
          sortable: false,
          value: 'username',
        },
        {title: 'Page', value: 'id',sortable: false},
        {title: 'Add', value: 'add', sortable: false}
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
      },
      set(maintainers) {
        this.getSection("generalInformation").data.maintainers = maintainers;
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
      let maintainerId = _module.maintainers[maintainerIndex].id;
      _module.maintainers = _module.maintainers.filter(item => item.id !== maintainerId);
      if (_module.watchers.some(m => m.id === maintainerId)) {
        _module.watcherToRemove = maintainerId;
        _module.showRemoveWatcher = true;
      }
    },
    completeRemoval(removeWatcher) {
      let _module = this;
      if (removeWatcher) {
        let index = _module.watchers.findIndex(element => {
          if (element.id === _module.watcherToRemove) {
            return true;
          }
        });
        _module.watchers.splice(index, index+1);
      }
      _module.showRemoveWatcher = false;
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
