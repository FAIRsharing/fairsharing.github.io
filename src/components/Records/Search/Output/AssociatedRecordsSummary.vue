<template>
  <div class="d-flex flex-column mx-25-percent">
    <h4 class="my-0 font-weight-light">
      Related Standards
    </h4>
    <h4 class="my-0 font-weight-light text--disabled">
      Implementing Databases
    </h4>
    <h4 class="my-0 font-weight-light">
      Endorsing Policies
    </h4>
  </div>
</template>

<script>
export default {
name: "AssociatedRecordsSummary"
}
</script>

<style scoped>
h4{
  position: relative;
}
h4:before {
  content: '\A';
  width: 0;
  height: 0;
  bottom: 5px;
  margin-left: -15px;
  position: absolute;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  border-left: 6px solid gray;
}
</style>
