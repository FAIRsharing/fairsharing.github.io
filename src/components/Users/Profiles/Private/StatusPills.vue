<template>
  <div class="mt-1">
    <div
      v-if="status"
      class="d-flex flex-column justify-center align-center mb-1"
    >
      <div
        class="led d-inline-block mr-0"
        :class="{'bg-green': status === 'approved', 'bg-red': status === 'rejected', 'bg-orange': status === 'pending', 'small': small}"
      />
      <b
        v-if="!small"
        class="mx-md-2"
        :class="{'text-green': status === 'approved', 'text-red': status === 'rejected', 'text-orange': status === 'pending'}"
      >{{ status.toUpperCase() }}</b>
    </div>

    <div
      v-if="recommended !== null"
      class="d-flex flex-column justify-center align-center"
    >
      <div
        class="led mr-0"
        :class="{'bg-green': recommended, 'bg-grey': !recommended, 'small': small}"
      />
      <b :class="recommended ? 'text-green' : 'text-grey'">
        <span v-if="recommended">Yes</span>
        <span v-else>No</span>
      </b>
    </div>

    <div
      v-if="recordStatus !== null"
      class="d-flex flex-column justify-center align-center"
    >
      <div
        class="led d-inline-block mr-0"
        :class="{
          'bg-green': recordStatus === 'ready',
          'bg-red': recordStatus === 'deprecated',
          'bg-orange': recordStatus === 'in_development',
          'bg-grey': recordStatus === 'uncertain',
          'small': small
        }"
      />
      <b
        v-if="!small"
        :class="{
          'text-green': recordStatus === 'ready',
          'text-red': recordStatus === 'deprecated',
          'text-orange': recordStatus === 'in_development',
          'text-grey': recordStatus === 'uncertain',
        }"
        class="text-center"
      >
        {{ cleanString(recordStatus) }}
      </b>
    </div>

    <div
      v-if="approved !== null"
      class="d-flex flex-column justify-center align-center mb-1"
    >
      <div
        class="led d-inline-block mr-0"
        :class="{'bg-green': approved, 'bg-red': !approved, 'small': small}"
      />
      <div v-if="!small">
        <b
          v-if="approved"
          class="mx-md-2 text-green"
        >
          APPROVED
        </b>
        <b
          v-if="!approved"
          class="mx-md-2 text-red"
        >
          NOT APPROVED
        </b>
      </div>
    </div>
  </div>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
export default {
  name: "StatusPills",
  mixins: [stringUtils],
  props: {
    status: {type: String, default: null},
    approved: {type: Boolean, default: null},
    small: {type: Boolean, default: false},
    recommended: {type: Boolean, default: null},
    recordStatus: {type: String, default: null}
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
