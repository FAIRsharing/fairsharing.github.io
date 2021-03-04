<template>
  <v-row>
    <!-- name -->
    <v-col
      xl="3"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-text-field
        v-model="fields.metadata.name"
        label="Record Name"
        :rules="[rules.isRequired()]"
        outlined
      >
        <template #prepend>
          <v-tooltip bottom>
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            Name of the record
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>

    <!-- abbreviation -->
    <v-col
      xl="3"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-text-field
        v-model="fields.metadata.abbreviation"
        label="Abbreviation"
        :rules="[rules.isRequired()]"
        outlined
      >
        <template #prepend>
          <v-tooltip
            bottom
            max-width="300px"
            class="text-justify"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ tooltips['abbreviation'] }}
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>

    <!-- homepage -->
    <v-col
      xl="3"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-text-field
        v-model="fields.metadata.homepage"
        label="Homepage"
        :rules="[rules.isRequired(), rules.isUrl()]"
        outlined
      >
        <template #prepend>
          <v-tooltip
            bottom
            max-width="300px"
            class="text-justify"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ tooltips['homepage'] }}
          </v-tooltip>
        </template>
      </v-text-field>
    </v-col>

    <!-- creation year -->
    <v-col
      xl="3"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-autocomplete
        v-model="fields.metadata.year_creation"
        label="Year of creation"
        :items="years()"
        outlined
      >
        <template #prepend>
          <v-tooltip
            bottom
            max-width="300px"
            class="text-justify"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ tooltips['year'] }}
          </v-tooltip>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- countries -->
    <v-col
      xl="4"
      lg="12"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-autocomplete
        v-model="fields.countries"
        label="Countries"
        :items="countries"
        item-text="name"
        item-value="name"
        multiple
        outlined
        return-object
      >
        <template #prepend>
          <v-tooltip
            bottom
            max-width="300px"
            class="text-justify"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ tooltips['countries'] }}
          </v-tooltip>
        </template>

        <!-- autocomplete selected -->
        <template #selection="data">
          <v-chip
            class="blue white--text"
            close
            @click:close="removeCountry(data.item)"
          >
            {{ data.item.name }}
          </v-chip>
        </template>

        <!-- autocomplete data -->
        <template #item="data">
          <country-flag
            v-if="data.item.code !== null"
            :country="data.item.code"
            size="normal"
          />
          <img
            v-else
            src="@/assets/placeholders/country.png"
            class="ml-4 mr-3"
          >
          <div> {{ data.item.name }} </div>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- registry -->
    <v-col
      xl="4"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-autocomplete
        ref="editRecordType"
        v-model="fields.type"
        label="Registry type"
        :rules="[rules.isRequired()]"
        :items="recordTypes"
        item-text="name"
        item-value="name"
        outlined
        return-object
        :disabled="typeChangeDisabled()"
      >
        <!-- autocomplete selected -->
        <template #selection="data">
          {{ data.item.name.replace(/_/g, ' ') }}
        </template>

        <!-- autocomplete data -->
        <template #item="data">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-list-item
                class="registryList"
                v-bind="attrs"
                v-on="on"
              >
                <v-list-item-avatar>
                  <v-img :src="icons()[data.item.name]" />
                </v-list-item-avatar>
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    <b>{{ data.item.name.replace(/_/g, ' ').toUpperCase() }}</b>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ data.item.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>{{ data.item.description }}</span>
          </v-tooltip>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- status -->
    <v-col
      xl="4"
      lg="6"
      md="12"
      sm="12"
      xs="12"
      cols="12"
    >
      <v-autocomplete
        v-model="fields.status"
        label="Status"
        :items="status"
        item-text="name"
        item-value="name"
        outlined
        :disabled="fields.type === 'collection' || fields.type.name === 'collection'"
      >
        <!-- autocomplete selected -->
        <template #selection="data">
          {{ data.item.name.replace(/_/g, ' ') }}
        </template>

        <!-- autocomplete data -->
        <template #item="data">
          <v-tooltip left>
            <template #activator="{ on, attrs }">
              <v-list-item
                class="registryList"
                v-bind="attrs"
                v-on="on"
              >
                <v-list-item-avatar>
                  <status-pills :status="data.item.name" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title> <b>{{ data.item.name.replace(/_/g, ' ').toUpperCase() }} </b></v-list-item-title>
                  <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span> {{ data.item.description }} </span>
          </v-tooltip>
        </template>
      </v-autocomplete>
    </v-col>

    <!-- deprecation reasons -->
    <v-col cols="12">
      <v-expand-transition>
        <v-textarea
          v-if="fields.status === 'deprecated'"
          v-model="fields.metadata['deprecation_reason']"
          label="Reason for deprecation"
          outlined
        >
          <template #prepend>
            <v-tooltip
              bottom
              max-width="300px"
              class="text-justify"
            >
              <template #activator="{ on }">
                <v-icon v-on="on">
                  fa-question-circle
                </v-icon>
              </template>
              {{ tooltips['deprecation_reason'] }}
            </v-tooltip>
          </template>
        </v-textarea>
      </v-expand-transition>
    </v-col>

    <!-- description -->
    <v-col cols="12">
      <v-textarea
        v-model="fields.metadata.description"
        label="Description"
        :rules="[rules.isRequired(), rules.isLongEnough(40)]"
        outlined
      >
        <template #prepend>
          <v-tooltip
            bottom
            max-width="300px"
            class="text-justify"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ tooltips['description'] }}
          </v-tooltip>
        </template>
      </v-textarea>
    </v-col>

    <database-warning />
  </v-row>
</template>

<script>
    import { mapState, mapGetters } from "vuex"
    import CountryFlag from 'vue-country-flag'
    import StatusPills from "@/components/Records/Shared/StatusPills";
    import { isRequired, isUrl, isLongEnough } from "@/utils/rules.js"
    import DatabaseWarning from "./DatabaseWarning";

    export default {
        name: "BaseFields",
        components: {DatabaseWarning, CountryFlag, StatusPills},
        data(){
            return {
                rules: {
                    isRequired: function(){return isRequired()},
                    isUrl: function(){return isUrl()},
                    isLongEnough: function(val){return isLongEnough(val)},
                }
            }
        },
        computed: {
            ...mapGetters("record", ["getSection", "getCreatingNewRecord"]),
            ...mapState("editor", [
                "countries",
                "years",
                "tooltips",
                "recordTypes",
                "icons",
                "status"
            ]),
            ...mapState('users', ['user']),
            fields(){
              return this.getSection("generalInformation").data;
            }
        },
        methods: {
          removeCountry(country){
              this.fields.countries = this.fields.countries.filter(obj =>
                  obj.label !== country.name && obj.id !== country.id
              );
          },
          typeChangeDisabled(){
            let _module = this;
            if (_module.getCreatingNewRecord) {
              return false;
            }
            return !_module.user().is_curator;
          }
        }
    }
</script>

<style scoped>
  .registryList {
    max-width: 780px;
  }
</style>
