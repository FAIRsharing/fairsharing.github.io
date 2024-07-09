
<template>
  <div class="query-builder-group-slot__group-control pa-4 d-flex">
    <!-- General Component -->
    <GeneralRule :group-ctrl="groupCtrl" />
    <!-- Database Component -->
    <DatabaseRule :group-ctrl="groupCtrl" />
    <!-- Policy Component -->
    <PolicyRule :group-ctrl="groupCtrl" />
    <div class="query-builder-group-slot__spacer" />
    <button
      class="query-builder-group-slot__group-adding-button"
      @click="addNewGroup(groupCtrl)"
    >
      Add Group
    </button>
  </div>
</template>

<script>
import {DatabaseRule,GeneralRule, PolicyRule} from "./index";
export default {
  name: "GroupCtrlSlot",
  components:{GeneralRule, DatabaseRule, PolicyRule},
  props: {
    groupCtrl: {
      type: Object,
      default: null
    }
  },

  methods:{
    /**
     * Add group to query builder
     * @param item - Object
     */
    addNewGroup(item) {
      item.newGroup()
    },
  }
};
</script>

