<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCurationData.first_section.main_title }}
    </h1>
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text"
    />

    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCurationData.second_section.main_title }}
    </h1>
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.second_section.text"
    />

    <!-- eslint-enable vue/no-v-html -->
    <div
      align="center"
      class="lato-text-md"
    >
      <v-data-table
        id="tableCurators"
        :headers="communityCurationData.headers_table"
        :items="communityCurationData.community_curators"
        item-key="name"
        class="elevation-1"
      >
        <template #item="props">
          <tr>
            <td>
              <a :href="'/users/' + props.item.id">
                {{ props.item.name }}
              </a>
            </td>
            <td>
              <div v-if="props.item.id_organisation">
                <a :href="'/organisations/' + props.item.id_organisation">
                  {{ props.item.organisation }}
                </a>
              </div>
              <div v-else>
                <a :href="props.item.url_organisation">
                  {{ props.item.organisation }}
                </a>
              </div>
            </td>
            <td>{{ props.item.scope }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCurationData.third_section.main_title }}
    </h1>
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.third_section.text"
    />
    <div
      v-for="(item,index) in communityCurationData.third_section.subsections"
      :key="index"
    >
      <a :id="item.anchor" />
      <h3 class="text-h6 text-xl-h5 mb-2">
        {{ item.title }}
      </h3>
      <!-- eslint-disable vue/no-v-html -->
      <p
        :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        v-html="item.content"
      />
    </div>
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      {{ communityCurationData.fourth_section.main_title }}
    </h1>
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.fourth_section.text"
    />
    <!-- eslint-enable vue/no-v-html -->
  </main>
</template>

<script>
import {communityCuration} from '@/data/communityCurationData.json'
import getHostname from "@/utils/generalUtils";
    export default {
      name: "CommunityCuration",
      mixins: [ getHostname ],
      data: () => {
        return {
          communityCurationData: communityCuration,
        }
      }
    }
</script>
<style scoped>
p {
  /* make the line of paragraph to break when reaching /n in a string
   same time having breaking lines and justify texts
   */
  white-space: pre-line;
  text-align: justify;
  -moz-text-align-last: justify;
}
</style>
