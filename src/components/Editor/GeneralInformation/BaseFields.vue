<template>
  <v-form
    ref="form"
    v-model="formValid"
    lazy-validation
  >
    <v-fade-transition v-if="logoLoading">
      <v-overlay
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>

    <v-row>
      <v-col
        xl="4"
        lg="6"
        md="12"
        sm="12"
        xs="12"
        cols="12"
      >
        <!-- Upload (Logo) -->
        <!-- current logo to go here -->
        <span>
          A record logo is optional (png or jpeg, max. 3MB).
        </span>
        <v-file-input
          v-model="recordLogo"
          :rules="[rules.isImage(), imageSizeCorrect]"
          clearable
          accept="image/png,image/jpeg"
          label="Logo"
          :loading="logoLoading"
          prepend-icon="fa-image"
        />
        <v-row>
          <v-img
            v-if="currentLogo"
            :src="getAPIEndPoint() + currentRecord.fairsharingRecord.urlForLogo"
            max-height="300"
            max-width="500"
          />
          <v-btn
            v-if="currentLogo"
            class="red white--text ma-1"
            small
            @click="deleteLogo"
          >
            Delete logo
          </v-btn>
        </v-row>
      </v-col>

      <v-col
        xl="4"
        lg="6"
        md="12"
        sm="12"
        xs="12"
        cols="12"
      >
        <!-- name -->
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
              {{ tooltips['name'] }}
            </v-tooltip>
          </template>
        </v-text-field>
        <!-- abbreviation -->
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
        <!-- homepage -->
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

      <!-- Duplicate warning box to go here -->
      <v-col
        v-if="possibleDuplicates.length > 0"
        cols="12"
      >
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

      <v-col
        xl="4"
        lg="12"
        md="12"
        sm="12"
        xs="12"
        cols="12"
      >
        <!-- creation year -->
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
        <!-- countries -->
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
        <!-- registry -->
        <v-autocomplete
          ref="editRecordType"
          v-model="fields.type"
          label="Registry and type"
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

      <v-col cols="12">
        <!-- status -->
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

      <!-- does this database only implement internal identifiers -->
      <v-col cols="12">
        <p
          v-if="isDatabase()"
        >
          FAIRsharing requires that each database record provide the type of identifier(s) used. Either add the
          persistent identifier schema to your record using the implements relationship type, or tick the box below
          that confirms that the database instead uses an internal identifier schema.
          More information is available in our
          <a
            href="https://fairsharing.gitbook.io/fairsharing/record-sections-and-fields/general-information/identifier-type"
            target="_blank"
          >
            identifier type
          </a>
          documentation.
        </p>
        <v-checkbox
          v-if="isDatabase()"
          v-model="fields.metadata['internal_identifiers']"
          class="mr-2 "
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
              {{ tooltips['internal_identifiers'] }}
            </v-tooltip>
          </template>
          <template #label>
            <span class="v-label-white">This database uses internal identifiers rather than a community-standard identifier schema.</span>
          </template>
        </v-checkbox>
        <!-- globally_unique -->
        <div
          v-if="isIdentifierSchema()"
          class="checkboxes"
        >
          <v-checkbox
            v-model="fields.metadata['globally_unique']"
            class="mr-2 "
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
                {{ tooltips['globally_unique'] }}
              </v-tooltip>
            </template>
            <template #label>
              <span class="v-label-white">Is this identifier schema <a href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas">globally unique</a> as defined by FAIRsharing?</span>
            </template>
          </v-checkbox>
          <!-- resolvable -->
          <v-checkbox
            v-model="fields.metadata['resolvable']"
            class="mr-2 "
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
                {{ tooltips['resolvable'] }}
              </v-tooltip>
            </template>
            <template #label>
              <span class="v-label-white">Is this identifier schema <a href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas">resolvable</a> as defined by FAIRsharing?</span>
            </template>
          </v-checkbox>
          <!-- persistent -->
          <v-checkbox
            v-model="fields.metadata['persistent']"
            class="mr-2 "
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
                {{ tooltips['persistent'] }}
              </v-tooltip>
            </template>
            <template #label>
              <span class="v-label-white">Is this identifier schema <a href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas">persistent</a> as defined by FAIRsharing?</span>
            </template>
          </v-checkbox>
        </div>
      </v-col>

      <!-- deprecation reasons -->
      <v-col
        v-if="fields.status === 'deprecated'"
        cols="12"
      >
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
      <!-- create record button -->
      <v-card-actions v-if="createMode">
        <v-btn
          class="primary"
          :loading="loading"
          :disabled="disableSubmit()"
          @click="createNewRecord()"
        >
          Create Record
        </v-btn>
      </v-card-actions>
    </v-row>
  </v-form>
</template>

<script>
    import CountryFlag from 'vue-country-flag'
    import { mapGetters,mapState } from "vuex"

    import Icon from "@/components/Icon"
    import Loaders from "@/components/Navigation/Loaders.vue";
    import StatusPills from "@/components/Records/Shared/StatusPills";
    import RESTClient from "@/lib/Client/RESTClient";
    import getAPIEndPoint, {toBase64} from "@/utils/generalUtils";
    import { isImage, isLongEnough, isRequired, isUrl } from "@/utils/rules.js"

    import DatabaseWarning from "./DatabaseWarning";

    let restClient = new RESTClient();

    export default {
      name: "BaseFields",
      components: {DatabaseWarning, CountryFlag, StatusPills, Icon, Loaders},
      mixins: [getAPIEndPoint],
      props:{
        createMode: {type: Boolean, default: false},
        submitRecord: {type: Boolean, default: false},
        loading: {type: Boolean, default: false}
      },
      data(){
          return {
              rules: {
                  isRequired: function(){return isRequired()},
                  isUrl: function(){return isUrl()},
                  isLongEnough: function(val){return isLongEnough(val)},
                  isImage: function(val){return isImage(val)}
              },
              submitAnywayDisabled: false,
              formValid: false,
              initialType: '',
              allowedFileSize: 1048576,
              recordLogo: null,
              logoLoading: false,
              currentLogo: null
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
          ...mapState("record", ["currentRecord"]),
          fields(){
            return this.getSection("generalInformation").data;
          },
          imageSizeCorrect() {
            if (!this.recordLogo) {
              this.$emit('imageTooBig', false);
              return true;
            }
            if (this.recordLogo.size < this.allowedFileSize) {
              this.$emit('imageTooBig', false);
              return true;
            }
            this.$emit('imageTooBig', true);
            return false;
          }
      },
      watch: {
        recordLogo: {
          async handler(logo) {
            let _module = this;
            if (logo === null || logo === undefined) {
              // This is to prevent a logo being deleted if a user fiddles about with the form and then
              // submits with no image uploaded.
              if (_module.currentRecord.fairsharingRecord.urlForLogo) {
                _module.fields.delete('logo');
              }
              else {
                _module.fields.logo = {}
              }
              return;
            }
            _module.logoLoading = true;
            let convertedFile = await toBase64(logo);
            _module.fields.logo = {
              filename: logo.name,
              content_type: logo.type,
              data: convertedFile
            };
            _module.logoLoading = false;
          }
        }
      },
      mounted() {
        this.$refs.form.validate();
        if (this.$router.currentRoute.path !== '/create' && this.currentRecord.fairsharingRecord.urlForLogo)
        {
          this.currentLogo = this.currentRecord.fairsharingRecord.urlForLogo;
        }
      },
      methods: {
        async deleteLogo() {
          this.logoLoading = true;
          let response;
          response = await restClient.clearLogo(this.currentRecord.fairsharingRecord.id, this.user().credentials.token);
          if (!response.error) {
            this.currentLogo = null;
          }
          this.logoLoading = false;
        },
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
        },
        disableSubmit() {
          let _module = this;
          if (!_module.formValid) {
            return true;
          }
          if (_module.possibleDuplicates.length > 0) {
            if (_module.submitRecord) {
              return false;
            }
            else {
              return true;
            }
          }
          return false;
        },
        createNewRecord(){
          this.$emit('createnewrecord');
        },
        isDatabase() {
          if (this.fields.type.name === 'repository' ||
              this.fields.type.name === 'knowledgebase' ||
              this.fields.type.name === 'knowledgebase_and_repository' ||
              this.fields.type === 'repository' ||
              this.fields.type === 'knowledgebase' ||
              this.fields.type === 'knowledgebase_and_repository') {
            return true;
          }
          return false;
        },
        isIdentifierSchema() {
          if (this.fields.type.name === 'identifier_schema' ||
            this.fields.type === 'identifier_schema') {
            return true;
          }
          return false;
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
  .checkboxes {
    text-align:center;
  }
  .checkboxes input{
    margin: 0px 0px 0px 0px;
  }
  .checkboxes label{
    margin: 0px 20px 0px 3px;
  }
</style>
