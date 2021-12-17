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

    <!-- Duplicate warning box to go here -->
    <!-- curator notes -->
    <v-col cols="12">
      <v-expand-transition>
        <v-card
          v-if="possibleDuplicates.length > 0"
          class="mx-auto deep-orange darken-4 mb-5"
          dark
        >
          <v-card-title>
            <span class="text-h5 font-weight-bold">
              This record may duplicate an existing FAIRsharing record!
            </span>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-light">
            <p>
              Please see below for details of records we have detected that may be similar to yours:
            </p>
            <ul>
              <li
                v-for="(dup, dupIndex) in possibleDuplicates"
                :key="'dup_' + dupIndex"
              >
                <a
                  :href="'/' + dup.id"
                  target="_blank"
                >
                  {{ dup.name }}
                </a>
                <span v-if="dup.abbreviation">
                  ({{ dup.abbreviation }}) /
                </span>
                <span v-else>
                  /
                </span>
                <a
                  :href="dup.homepage"
                  target="_blank"
                >
                  {{ dup.homepage }}
                </a>
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="white black--text"
              :disabled="submitAnywayDisabled"
              @click="submitAnyway"
            >
              I know what I'm doing...
            </v-btn>
            <v-btn
              class="black white--text"
              @click="tryAgain"
            >
              Clear and retry
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
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
            class="blue white--text removeStyle"
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
                  <Icon
                    :item="data.item.name"
                    wrapper-class=""
                    :height="40"
                  />
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

    <!-- curator notes -->
    <v-col cols="12">
      <v-expand-transition>
        <v-textarea
          v-if="user().is_curator"
          v-model="fields.curator_notes"
          label="Curator notes"
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
              {{ tooltips['curator_notes'] }}
            </v-tooltip>
          </template>
        </v-textarea>
      </v-expand-transition>
    </v-col>

    <!-- Upload logo -->
    <v-col cols="12">
      Logo:
      <upload-images
        :credential-info="{id:getField('id'),token:user().credentials.token}"
        :initial-images="getField('urlForLogo')"
      />
    </v-col>
    
    <!-- isHidden -->
    <v-col cols="12">
      <v-checkbox
        v-if="user().is_curator"
        v-model="fields.isHidden"
        class="d-inline-block mr-2"
        label="hide record"
      >
        <template #label>
          <span class="v-label-white">Hidden if selected.</span>
        </template>
      </v-checkbox>
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
    import Icon from "@/components/Icon"
    import UploadImages from "@/components/UploadImages/UploadImages";

    export default {
      name: "BaseFields",
      components: {UploadImages, DatabaseWarning, CountryFlag, StatusPills, Icon},
      data(){
          return {
              rules: {
                  isRequired: function(){return isRequired()},
                  isUrl: function(){return isUrl()},
                  isLongEnough: function(val){return isLongEnough(val)},
              },
              submitAnywayDisabled: false
          }
      },
      computed: {
          ...mapGetters("record", ["getSection", "getCreatingNewRecord","getField"]),
          ...mapState("editor", [
              "countries",
              "years",
              "tooltips",
              "recordTypes",
              "status",
              "possibleDuplicates"
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
        },
        submitAnyway() {
          this.submitAnywayDisabled = true;
          this.$emit('submission');
        },
        tryAgain() {
          this.fields.metadata.homepage = null;
          this.fields.metadata.name = null;
          this.fields.metadata.abbreviation = null;
          this.$emit('clearing');
        }
      }
    }
</script>

<style>
  .registryList {
    max-width: 780px;
  }
  .removeStyle button {
    color: white !important;
    margin-left: 12px !important;
  }
</style>
