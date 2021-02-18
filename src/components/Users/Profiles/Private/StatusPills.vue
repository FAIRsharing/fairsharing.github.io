<template>
  <div class="mt-1">
    <div
      v-if="status"
      class="d-flex"
    >
      <div
        class="led d-inline-block"
        :class="{'green': status === 'approved', 'red': status === 'rejected', 'orange': status === 'pending', 'small': small}"
      />
      <b
        class="ml-2"
        :class="{'green--text': status === 'approved', 'red--text': status === 'rejected', 'orange--text': status === 'pending'}"
      >{{ status.toUpperCase() }}</b>
    </div>
    <div
      v-if="approved !== null"
      class="d-flex"
    >
      <div
        class="led d-inline-block"
        :class="{'green': approved, 'red': !approved, 'small': small}"
      />
      <b
        v-if="approved"
        class="ml-2 green--text"
      >
        APPROVED
      </b>
      <b
        v-if="!approved"
        class="ml-2 red--text"
      >
        NOT APPROVED
      </b>
    </div>
  </div>
</template>

<script>
    export default {
        name: "StatusPills",
        props: {
            status: {type: String, default: null},
            approved: {type: Boolean, default: null},
            small: {type: Boolean, default: false}
        }
    }
</script>

<style scoped>
  .led {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    box-shadow: #D6D6D6 2px 2px 3px 1px, inset #304701 0 -1px 9px;
  }


  .small {
    width: 15px;
    height: 15px;
  }

  .led:not(.small){
    margin-right: 8px;
  }
</style>
