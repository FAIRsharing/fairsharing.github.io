<template>
  <main class="pa-15 mb-10">
    <!-- eslint-disable vue/no-v-html -->
    <!--  Header  -->
    <h1
      class="text-h5 text-xl-h4 mb-2 mb-xl-6"
      v-html="$sanitize(newData.header)"
    />
    <!--  subtitle  -->
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="$sanitize(newData.firstDescription)"
    />
    <!--  BulletPoints  -->
    <div
      v-for="(item,index) in newData.description"
      :key="item.header+'_'+index"
    >
      <h2
        v-if="item.header"
        class="text-h6 text-xl-h5"
      >
        {{ item.header }}
      </h2>
      <p
        v-if="item.textBefore"
        :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="$sanitize(item.textBefore)"
      />
      <ul v-if="item.bulletPoints">
        <li
          v-for="(bulletPoint,bulletPoint_index) in item.bulletPoints"
          :key="bulletPoint_index"
          class="mb-2"
          v-html="$sanitize(bulletPoint)"
        />
      </ul>
      <p
        v-if="item.textAfter"
        :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="$sanitize(item.textAfter)"
      />
    </div>
    <v-btn
      color="primary"
      to="/create"
    >
      Add New Record
    </v-btn>
    <!-- eslint-enable vue/no-v-html -->
  </main>
</template>

<script>
import newData from '@/data/NewStaticPageData.json'
export default {
  name: "New",
  data: () => {
    return {
      newData
    }
  }
}
</script>

<style scoped>
P {
  white-space: break-spaces;
}
</style>
