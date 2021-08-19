<template>
  <div
    v-if="(!!currentRecord['fairsharingRecord'].reverseRecordAssociations.find(item=>item.recordAssocLabel==='deprecates') && currentRecord['fairsharingRecord'].reverseRecordAssociations) || (!!currentRecord['fairsharingRecord'].recordAssociations.find(item=>item.recordAssocLabel==='deprecates' && currentRecord['fairsharingRecord'].recordAssociations))"
    class="d-flex flex-row mt-4 min-height-40"
  >
    <b
      v-if="!!currentRecord['fairsharingRecord'].reverseRecordAssociations.find(item=>item.recordAssocLabel==='deprecates')"
      class="width-200"
    >This record is replaced by: </b>
    <b
      v-if="!!currentRecord['fairsharingRecord'].recordAssociations.find(item=>item.recordAssocLabel==='deprecates')"
      class="width-200"
    > This record replaces or incorporates the following deprecated resources: </b>
    
    <div
      v-if="!!currentRecord['fairsharingRecord'].reverseRecordAssociations.find(item=>item.recordAssocLabel==='deprecates')"
      class="d-flex full-width flex-column flex-wrap ml-md-14 ml-13"
    >
      <router-link
        v-for="(item,index) in currentRecord['fairsharingRecord'].reverseRecordAssociations.filter(obj=>obj.recordAssocLabel==='deprecates')"
        :key="item.id+'_'+index"
        class="underline-effect"
        :to="'/'+item.fairsharingRecord.id"
      >
        {{ item.fairsharingRecord.name }}
      </router-link>
    </div>

    <div
      v-if="!!currentRecord['fairsharingRecord'].recordAssociations.find(item=>item.recordAssocLabel==='deprecates')"
      class="d-flex full-width flex-column flex-wrap ml-md-14 ml-13"
    >
      <router-link
        v-for="(item,index) in currentRecord['fairsharingRecord'].recordAssociations.filter(obj=>obj.recordAssocLabel==='deprecates')"
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
  }
}
</script>

<style scoped>

</style>