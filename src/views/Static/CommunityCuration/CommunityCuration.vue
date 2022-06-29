<template>
  <main class="pa-15 mb-10">
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text_1"
    />
    <!-- eslint-enable vue/no-v-html -->
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="communityCurationData.first_section.text_2"
    />
    <!-- eslint-enable vue/no-v-html -->
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
              <v-avatar
                v-if="props.item.orcid"
                :height="17"
              >
                <a :href="'http://orcid.org/' + props.item.orcid">
                  <Icon
                    item="Orcid"
                    :height="17"
                    wrapper-class=""
                  />
                </a>
              </v-avatar>
            </td>
            <td>
              <a :href="'/organisations/' + props.item.id_organisation">
                {{ props.item.organisation }}
              </a>
            </td>
            <td>{{ props.item.scope }}</td>
          </tr>
        </template>
      </v-data-table>
    </div>
    <br>
    <v-expansion-panels
      v-model="panel"
      :readonly="readonly"
      multiple
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCurationData.third_section.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
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
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- eslint-enable vue/no-v-html -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCurationData.fourth_section.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- eslint-disable vue/no-v-html -->
          <p
            :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
            v-html="communityCurationData.fourth_section.text"
          />
          <!-- eslint-enable vue/no-v-html -->
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h1 class="text-h6 text-xl-h5 mb-2">
            <strong>
              {{ communityCodeOfConductData.main_title }}
            </strong>
          </h1>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div
            v-for="(item,index) in communityCodeOfConductData.sections"
            :key="'A'+ index"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p
              :class="['mb-6 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
              v-html="item.text"
            />
          </div>
          <div
            v-for="(item,index_two) in communityCodeOfConductData.commitments"
            :key="index_two"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p :class="['mb-2 ml-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]">
              {{ index_two+1 }} . <b>{{ item.black_text }}</b>  {{ item.text }}
            </p>
          </div>
          <!-- eslint-enable vue/no-v-html -->

          <h3 class="text-h6 text-xl-h5 mb-2 mt-4">
            Reporting
          </h3>
          <div
            v-for="(item,index) in communityCodeOfConductData.reporting"
            :key="'B'+index"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p
              :class="['mb-3 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
              v-html="item.text"
            />
          </div>
          <!-- eslint-enable vue/no-v-html -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </main>
</template>

<script>
import {communityCuration, communityCodeOfConductData} from '@/data/communityCurationData.json';
import Icon from "@/components/Icon";
import getHostname from "@/utils/generalUtils";
    export default {
      name: "CommunityCuration",
      components: {
        Icon
      },
      mixins: [ getHostname ],
      data: () => {
        return {
          communityCurationData: communityCuration,
          communityCodeOfConductData: communityCodeOfConductData
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
