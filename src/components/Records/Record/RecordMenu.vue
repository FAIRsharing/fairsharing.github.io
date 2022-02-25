<template>
  <div class="text-right">
    <v-menu
      offset-y
      :disabled="readOnlyMode"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="mt-1"
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          Actions
          <v-icon
            small
            right
          >
            fa-chevron-down
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(button, index) in buttons"
          :key="button.name()+'_'+button.isDisabled()+'_'+ index"
          :disabled="button.isDisabled()"
          @click="button.method()"
        >
          <v-list-item-title>
            {{ button.name() }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "RecordMenu",
  props: {
    buttons: {
      type: Array, default: () => {
      }
    },
    readOnlyMode: {
      default: false, type: Boolean
    }
  },
}
</script>

<style scoped>

</style>