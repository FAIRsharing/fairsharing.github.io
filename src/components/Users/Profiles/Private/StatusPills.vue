<template>
  <div>
    <div
      v-if="status"
      class="ml-1 mt-2 d-flex"
    >
      <div
        class="led d-inline-block"
        :class="{'green': status === 'approved', 'red': status === 'rejected', 'orange': status === 'pending'}"
      />
      <b
        class="ml-4"
        :class="{'green--text': status === 'approved', 'red--text': status === 'rejected', 'orange--text': status === 'pending'}"
      >{{ status.toUpperCase() }}</b>
    </div>
    <div
      v-if="approved !== null"
      class="ml-1 mt-2 d-flex"
    >
      <div
        class="led d-inline-block"
        :class="{'green': approved, 'red': !approved}"
      />
      <b
        v-if="approved"
        class="ml-4 green--text"
      >
        APPROVED
      </b>
      <b
        v-else
        class="ml-4 red--text"
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
            approved: {type: Boolean, default: null}
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
</style>
