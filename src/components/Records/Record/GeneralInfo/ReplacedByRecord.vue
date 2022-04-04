<template>
  <div>
    <v-col
      v-if="anyAssociationExist"
      class="align-left"
      cols="12"
    >
      <div
        v-if="reverseRecordAssociationExist"
      >
        <b>This record is replaced by: </b>
        <br>


        <router-link
          v-for="(item,index) in getAllReverseRecordAssociations"
          :key="item.id+'_'+index"
          class="underline-effect"
          :to="'/'+item.fairsharingRecord.id"
        >
          {{ item.fairsharingRecord.name }}<br>
        </router-link>
      </div>


      <div
        v-if="recordAssociationExist"
      >
        <b> This record replaces or incorporates the following deprecated resources: </b>
        <br>

        <router-link
          v-for="(item,index) in getAllRecordAssociations"
          :key="item.id+'_'+index"
          class="underline-effect"
          :to="'/'+item.linkedRecord.id"
        >
          {{ item.linkedRecord.name }}<br>
        </router-link>
      </div>
    </v-col>
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