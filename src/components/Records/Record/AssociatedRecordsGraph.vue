<template>
  <div>
    <h3>{{ recordAssociations }}</h3>
  </div>
</template>

<script>
  export default {
    name: "AssociatedRecordsGraph",
    props: {
        recordAssociations: {
            type: Array,
            default: null
        }
    }
  }
</script>
