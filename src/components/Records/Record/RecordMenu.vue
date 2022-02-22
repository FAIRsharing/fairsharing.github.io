<template>
  <div class="text-right">
    <v-menu
      offset-y
      :disabled="readOnlyMode"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="mt-1"
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          Actions
          <v-icon
            small
            right
          >
            fa-chevron-down
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(button, index) in buttons"
          :key="button.name()+'_'+button.isDisabled()+'_'+ index"
          :disabled="button.isDisabled()"
          @click="button.method()"
        >
          <v-list-item-title>
            {{ button.name() }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import RestClient from "@/lib/Client/RESTClient";
const client = new RestClient();

export default {
  name: "RecordMenu",
  props: {
    updateParentValue: {
      type: Function,
      default: () => {
      }
    },
    goToEdit: {
      type: Function,
      default: () => {
      }
    },
    isWatching: {
      type: Function,
      default: () => {
      }
    },
    getHistory: {
      type: Function,
      default: () => {
      }
    },
    needsReviewing: {
      type: Function,
      default: () => {
      }
    },
    reviewRecord: {
      type: Function,
      default: () => {
      }
    },
    deleteRecordMenu: {
      type: Function,
      default: () => {
      }
    }
  },
  data: () => {
    return {
      buttons: [],
      canEdit: false,
      canClaim: false,
    }
  },
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapState('users', ["user", "messages"]),
    ...mapState('introspection', ["readOnlyMode"]),
    ...mapGetters("record", ["getField"]),
    userIsLoggedIn(){
      return this.user().isLoggedIn;
    }
  },
  async mounted() {
    await this.canEditRecord()
    await this.checkClaimStatus();
    await this.getMenuButtons()
  },
  methods:{
    async getMenuButtons() {
      let _module = this;
      _module.buttons = []
      let initial_buttons = [
        {
          name: function() { return "Edit record" },
          isDisabled: function(){
            if (!_module.userIsLoggedIn){
              return false
            }
            return !_module.canEdit
          },
          method: function(){return _module.goToEdit()}
        },
        {
          name: function() { return "Request ownership" },
          isDisabled: function(){
            if (!_module.userIsLoggedIn){
              return false
            }
            return !_module.canClaim
          },
          method: function(){
            if (!_module.userIsLoggedIn){
              _module.$router.push({
                path: "/accounts/login",
                query: {
                  goTo: `/${_module.currentRecord['fairsharingRecord'].id}`
                }
              })
            }
            else {
              return _module.requestOwnership()
            }
          }
        },
        {
          name: () => {
            if (!_module.userIsLoggedIn){
              return "Watch record"
            }
            else {
              if (!_module.isWatching()){
                return "Watch record"
              }
              else {
                return "Unwatch record"
              }
            }
          },
          isDisabled: function() { return false },
          method: function(){
            if (!_module.userIsLoggedIn){
              _module.$router.push({
                path: "/accounts/login",
                query: {
                  goTo: `/${_module.currentRecord['fairsharingRecord'].id}`
                }
              })
            }
            else {
              if (_module.isWatching()) {
                _module.changeWatchRecord(false);
              }
              else {
                _module.changeWatchRecord(true);
              }
            }
          }
        },
        {
          name: function() { return "View Relation Graph" },
          isDisabled: function(){ return false },
          method: function(){
            _module.$router.push({
              path: "/graph/" + _module.currentRecord['fairsharingRecord'].id
            })
          }
        },
        {
          name: function() { return "View record history" },
          isDisabled: function(){return false},
          method: async () => {
            this.history = {
              show: true,
              loading: true
            };
            await this.getHistory();
            this.history.loading = false;
          }
        },
        {
          name: function () {
            return "Have a suggestion/question ?"
          },
          isDisabled: function () {
            return false;
          },
          method: function () {
            parent.location = "mailto:contact@fairsharing.org?subject=[FAIRsharing][Feedback] Comments on " + _module.currentRecord.fairsharingRecord.name;
          }
        }
      ];
      if (_module.user().is_curator && _module.needsReviewing()) {
        initial_buttons.push(
            {
              name: function () {
                return "Review this record"
              },
              isDisabled: function () {
                // Only to be seen by logged-in curators.
                // So, this line shouldn't really be encountered...
                /* istanbul ignore if */
                if (!_module.userIsLoggedIn) {
                  return true;
                }
                return !_module.user().is_curator;
              },
              method: async function () {
                await _module.reviewRecord();
              }
            }
        )
      }
      if (_module.user().is_super_curator) {
        initial_buttons.push(
            {
              name: function () {
                return "Delete this record"
              },
              isDisabled: function () {
                return !_module.user().is_super_curator;
              },
              method: /* istanbul ignore next */ async function () {
                _module.deleteRecordMenu(
                    _module.currentRecord['fairsharingRecord'].name,
                    _module.currentRecord['fairsharingRecord'].id,
                );
              }
            }
        )
      }
      this.buttons = initial_buttons;
    },
    async canEditRecord(){
      const _module = this;
      _module.canEdit = false;
      if (_module.user().isLoggedIn) {
        const recordID = _module.currentRecord['fairsharingRecord'].id;
        const canEdit = await client.canEdit(recordID, _module.user().credentials.token);
        _module.canEdit = !canEdit.error;
      }
    },
    async checkClaimStatus() {
      let _module = this;
      if (_module.user().isLoggedIn) {
        const recordID = _module.currentRecord['fairsharingRecord'].id;
        try {
          const claim = await client.canClaim(recordID, _module.user().credentials.token);
          if (claim.error) {
            if (claim.error.response.data.existing && claim.error.response.data.status === 'pending') {
              let maintainer = _module.getField("maintainers").filter(maintainer => maintainer.username === _module.user().credentials.username);
              if (maintainer.length === 0) {
                //alreadyClaimed: this is the situation where the current record has been already claimed by user to be maintained.
                // very handy function to update any property's value in parent
                this.updateParentValue('alreadyClaimed',true)
              }
            }
            else {
              this.updateParentValue('ownershipApproved', !(claim.error.response.data.status === 'rejected'))
            }

            // assign expiring date for approval banner---
            this.updateParentValue('showBanner',true)
            let bannerExpiryDate = {...JSON.parse(localStorage.getItem("bannerExpiryDate"))};
            if (!bannerExpiryDate[_module.getField("id")]) {
              bannerExpiryDate = {
                ...JSON.parse(localStorage.getItem("bannerExpiryDate")),
                [_module.getField("id")]: new Date()
              }
              localStorage.setItem("bannerExpiryDate", JSON.stringify(bannerExpiryDate));
            }
            else {
              const temp = JSON.parse(localStorage.getItem("bannerExpiryDate"));
              const expiryDate = new Date(temp[_module.getField("id")]);
              let now = new Date();
              const DAY = 2;
              // very important line: instead of adding if its been expired I directly assigned to variable so test can be passed much easier.
              this.updateParentValue('showBanner',!(expiryDate.getTime() + (DAY * 24 * 60 * 60 * 1000) < now.getTime()))
            }
            // end of expiring date for approval banner---
            this.updateParentValue('canClaim',false)
          }
          else {
            this.updateParentValue('canClaim',!claim.existing)
          }
          if(!claim.error) {
            //noClaimRegistered: this is the situation where the current record is not requested to be maintained by user
            this.updateParentValue('noClaimRegistered',true)
          }
        }
        catch (e) {
          /* istanbul ignore next */
          _module.canClaim = false;
        }
      }
    },
    async requestOwnership() {
      let _module = this;
      const recordID =  _module.currentRecord['fairsharingRecord'].id;
      const claim = await client.claimRecord(recordID, _module.user().credentials.token);
      if (claim.error) {
        this.updateParentValue('error',"Sorry, your request to claim this record failed. Please contact us.")
        _module.error = "Sorry, your request to claim this record failed. Please contact us.";
        this.updateParentValue('canClaim',false)
      }
      else {
        this.updateParentValue('canClaim',false)
        this.updateParentValue('claimedTriggered',true)
        this.updateParentValue('canClaim',true)
      }
    },
  }
}
</script>

<style scoped>

</style>