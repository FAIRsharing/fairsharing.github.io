<template>
  <div class="d-flex flex-column ml-25-percent">
    <div
      v-for="(associatedRecord, associationName) in associatedRecords.registryNumber"
      :key="associationName+'_'+associatedRecord.val"
      class="d-flex flex-row"
    >
      <h4
        :class="['my-0 font-weight-light mr-15',{'opacity-low':associatedRecord.val===0}]"
      >
        {{ setRecordLabels(associatedRecord.label) }}
      </h4>
      <span
        :class="['counter-style',{'opacity-low':associatedRecord.val===0}]"
      >{{ associatedRecord.val }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssociatedRecordsSummary",
  props: {
    associatedRecords: {
      type: Object,
      default: null,
    },
    isColumn: {
      type: Boolean,
      default: false
    },
  },
  methods: {
    setRecordLabels(label) {
      if (this.associatedRecords.registry === 'standard')
      {
        switch (label)
        {
          case 'standards':
            return 'Related Standards';
          case 'databases':
            return 'Implementing Databases';
          case 'policies':
            return 'Endorsing Policies';
        }
      }
      else if(this.associatedRecords.registry === 'database')
      {
        switch (label)
        {
          case 'standards':
            return 'Standards Implemented';
          case 'databases':
            return 'Related Databases';
          case 'policies':
            return 'Endorsing Policies';
        }
      }else
      {
        switch (label)
        {
          case 'standards':
            return 'Related Standards';
          case 'databases':
            return 'Related Databases';
          case 'policies':
            return 'Related Policies';
        }
      }
    }
  }
}
</script>

<style scoped>
h4 {
  position: relative;
  min-width: 200px;
}

h4:before {
  content: '\A';
  width: 0;
  height: 0;
  bottom: 11px;
  margin-left: -15px;
  position: absolute;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-left: 6px solid gray;
}

.counter-style {
  background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #253442), color-stop(1, #5a7087) );
  background:-moz-linear-gradient(top, #253442 5%, #5a7087 100% );
  background-color:#253442;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  border-radius: 6px;
  border:1px solid #dcdcdc;
  display:inline-block;
  color:white;
  font-style:normal;
  padding: 2px;
  margin-bottom: 5px;
  text-decoration:none;
  text-align:center;
  width: 40px;
  font-size: 12px;
}
</style>
