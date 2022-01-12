<template>
  <div
    v-if="anyAssociationExist"
    class="d-flex flex-row mt-4 min-height-40"
  >
    <b
      v-if="reverseRecordAssociationExist"
      class="width-15-percent-flex"
    >This record is replaced by: </b>
    <b
      v-if="recordAssociationExist"
      class="width-15-percent-flex"
    > This record replaces or incorporates the following deprecated resources: </b>
    
    <div
      v-if="reverseRecordAssociationExist"
      class="d-flex full-width flex-column flex-wrap ml-md-14 ml-13"
    >
      <router-link
        v-for="(item,index) in getAllReverseRecordAssociations"
        :key="item.id+'_'+index"
        class="underline-effect"
        :to="'/'+item.fairsharingRecord.id"
      >
        {{ item.fairsharingRecord.name }}
      </router-link>
    </div>

    <div
      v-if="recordAssociationExist"
      class="d-flex full-width flex-column flex-wrap ml-md-14 ml-13"
    >
      <router-link
        v-for="(item,index) in getAllRecordAssociations"
        :key="item.id+'_'+index"
        class="underline-effect"
        :to="'/'+item.linkedRecord.id"
      >
        {{ item.linkedRecord.name }}
      </router-link>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "ReplacedByRecord",
  computed: {
    ...mapState("record", ["currentRecord"]),
    anyAssociationExist() {
      return (!!this.currentRecord['fairsharingRecord'].reverseRecordAssociations.find(item => item.recordAssocLabel === 'deprecates') && !!this.currentRecord['fairsharingRecord'].reverseRecordAssociations)
          ||
          (!!this.currentRecord['fairsharingRecord'].recordAssociations.find(item => item.recordAssocLabel === 'deprecates' && !!this.currentRecord['fairsharingRecord'].recordAssociations))
    },
    recordAssociationExist() {
      return !!this.currentRecord['fairsharingRecord'].recordAssociations.find(item=>item.recordAssocLabel==='deprecates')
    },
    reverseRecordAssociationExist() {
      return !!this.currentRecord['fairsharingRecord'].reverseRecordAssociations.find(item=>item.recordAssocLabel==='deprecates')
    },
    getAllRecordAssociations() {
      return this.currentRecord['fairsharingRecord'].recordAssociations.filter(obj=>obj.recordAssocLabel==='deprecates')
    },
    getAllReverseRecordAssociations() {
      return this.currentRecord['fairsharingRecord'].reverseRecordAssociations.filter(obj=>obj.recordAssocLabel==='deprecates')
    }
  }
}
</script>