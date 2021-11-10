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
        v-if="!small"
        class="ml-2"
        :class="{'green--text': status === 'approved', 'red--text': status === 'rejected', 'orange--text': status === 'pending'}"
      >{{ status.toUpperCase() }}</b>
    </div>

    <div
      v-if="recommended !== null"
      class="d-flex flex-column justify-center align-center"
    >
      <div
        class="led mr-0"
        :class="{'green': recommended, 'grey': !recommended, 'small': small}"
      />
      <b :class="recommended ? 'green--text' : 'grey--text'">
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
          'green': recordStatus === 'ready',
          'red': recordStatus === 'deprecated',
          'orange': recordStatus === 'in_development',
          'grey': recordStatus === 'uncertain',
          'small': small
        }"
      />
      <b
        v-if="!small"
        :class="{
          'green--text': recordStatus === 'ready',
          'red--text': recordStatus === 'deprecated',
          'orange--text': recordStatus === 'in_development',
          'grey--text': recordStatus === 'uncertain',
        }"
        class="text-center"
      >
        {{ cleanString(recordStatus) }}
      </b>
    </div>

    <div
      v-if="approved !== null"
      class="d-flex"
    >
      <div
        class="led d-inline-block"
        :class="{'green': approved, 'red': !approved, 'small': small}"
      />
      <div v-if="!small">
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
