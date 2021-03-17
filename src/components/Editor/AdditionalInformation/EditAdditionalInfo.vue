<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
  >
    <v-card>
      {{allowedFields}}
      <v-card-title class="blue white--text">
        Edit Additional Information
      </v-card-title>
      <v-card-text>
        <v-container
          fluid
        >
          <v-row>
            <v-col
              v-for="(field, fieldName, fieldIndex) in allowedFields.properties"
              :key="'field_' + fieldIndex"
              cols="3"
            >
              <div v-if="field.type === 'object'">
                <b class="mr-2"> {{ cleanString(fieldName) }}: </b>
                {{fields[fieldName]}}
                <div
                  v-for="prop in field.properties"
                  :key="prop.description"
                >
                  {{ prop }}
                </div>
              </div>
              <div v-else-if="field.type === 'string'">
                <v-text-field
                  v-if="!field.enum"
                  :value="fields[fieldName]"
                  :label="cleanString(fieldName)"
                  outlined
                  @input="setField($event, fieldName)"
                />
                <v-autocomplete
                  v-else
                  :value="fields[fieldName]"
                  :label="cleanString(fieldName)"
                  :items="field.enum"
                  outlined
                  @input="setField($event, fieldName)"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
        <!--
          <div v-else-if="field.type === 'array'">
            <b class="mr-2"> {{ cleanString(fieldName) }}: </b>
            {{ field }}
          </div>
          -->
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import {mapActions, mapGetters, mapState, mapMutations} from "vuex";
import RestClient from "@/components/Client/RESTClient.js"
import stringUtils from '@/utils/stringUtils'

let restClient = new RestClient();

export default {
  name: "EditAdditionalInfo",
  components: { },
  mixins: [ stringUtils ],
  data() {
    return {
      initialized: false,
      loading: true,
      allowedFields: []
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    fields() {
      console.log(this.getSection("additionalInformation").data);
      return this.getSection("additionalInformation").data
    }
  },
  mounted(){
    this.$nextTick(async () => {
      this.allowedFields = await this.getFieldNames();
      this.initialized = true;
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("record", ["updateAdditionalInformation"]),
    ...mapMutations("record", ["setAdditionalInformation"]),
    async getFieldNames() {
      return restClient.extraMetadataFields(
          this.fields.type,
          this.user().credentials.token
      );
    },
    setField(fieldValue, fieldName) {
      this.setAdditionalInformation({fieldName, fieldValue})
    }
  }
}
</script>

<style>
</style>
