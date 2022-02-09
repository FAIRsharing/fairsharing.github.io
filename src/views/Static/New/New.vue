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
      <!--      <p
        v-if="item.textBefore"
        :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="$sanitize(item.textBefore)"
      />-->
    </div>
    <div v-if="newData.firstBlock">
      <ul class="d-flex flex-wrap">
        <li
          v-for="(item,index) in newData.firstBlock.items"
          :key="item.icon+'_'+index"
          :class="['d-flex flex-column text-center mb-4',$vuetify.breakpoint.smAndDown?'ma-auto':'mr-auto']"
          style="max-width:300px;min-height:200px"
        >
          <Icon
            :item="item.icon"
            :height="50"
            size="50"
            wrapper-class=""
          />
          <b class="text-h5">{{ item.title }}</b>
          <p class="text-body-1 text-justify">
            {{ item.description }}
          </p>
        </li>
      </ul>
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
import Icon from "@/components/Icon";
export default {
  name: "New",
  components: {Icon},
  data: () => {
    return {
      newData,
    }
  }
}
</script>
