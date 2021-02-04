<template>
  <v-card id="editRelationships">
    <v-card-title class="grey lighten-4 blue--text">
      Edit Relationships
    </v-card-title>
    <v-card-text class="pt-2">
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <div class="my-5 pl-4 grey lighten-3 elevation-5">
              <v-list class="transparent scrollZone pr-3">
                <v-subheader
                  style="border-bottom: 1px solid #ccc;"
                  class="mb-3"
                >
                  Select the records you want to add:
                </v-subheader>
                <v-list-item class="mb-4">
                  <v-text-field
                    v-model="search"
                    outlined
                    label="Refine search"
                    placeholder="e.g. GenBank"
                    hide-details
                    :loading="loading"
                  />
                </v-list-item>
                <v-list-item
                  v-for="(record, index) in availableRecords"
                  :key="'availableRecord_' + index"
                  dense
                  ripple
                  class="bordered"
                >
                  <v-list-item-avatar>
                    <v-img :src="icons()[record.type]" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ record.name }}
                    </v-list-item-title>
                    <span class="text-capitalize">
                      {{ record.registry }} / {{ cleanString(record.type) }}
                    </span>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-btn
                      icon
                      class="green white--text"
                      :disabled="isActive(record)"
                      @click="addItem(index)"
                    >
                      <v-icon small>
                        fa-arrow-right
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="my-5 pl-4 grey lighten-3 elevation-5">
              <v-list
                id="associatedRecords"
                class="transparent scrollZone pr-3"
              >
                <v-subheader
                  style="border-bottom: 1px solid #ccc;"
                  class="mb-3"
                >
                  <i
                    v-if="associations.length === 0"
                    class="mt-3"
                  >This record does not have any associated record.</i>
                  <span v-else>Associated records ({{ associations.length }})</span>
                </v-subheader>
                <v-list-item
                  v-for="(association, index) in associations"
                  :id="'association_' + index"
                  :key="'association_' + index"
                  dense
                  ripple
                  class="bordered my-1"
                  :class="{'orange lighten-3': association.new}"
                >
                  <v-list-item-avatar>
                    <v-img :src="icons()[association.linkedRecord.type]" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ association.linkedRecord.name }}
                    </v-list-item-title>
                    <span class="text-capitalize">
                      {{ association.linkedRecord.registry }} / {{ cleanString(association.linkedRecord.type) }}
                    </span>
                    <b>- {{ cleanString(association.recordAssocLabel.toUpperCase()) }} -</b>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-btn
                      icon
                      class="red white--text"
                      @click="removeItem(index)"
                    >
                      <v-icon small>
                        fa-trash
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="primary"
        :loading="saving"
      >
        Save and continue
      </v-btn>
      <v-btn
        :loading="saving"
        class="primary"
      >
        Save and exit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
    import { mapState, mapActions } from "vuex"
    import stringUtils from '@/utils/stringUtils';

    export default {
        name: "EditRelationships",
        mixins: [stringUtils],
        data(){
          return {
            saving: false,
            loading: false,
            search: null
          }
        },
        computed: {
          ...mapState("record", ["sections"]),
          ...mapState("editor", ["icons", "availableRecords"]),
          associations(){
            return this.sections.relations.data.recordAssociations;
          }
        },
        watch: {
          async search(){
            if (this.search.length >= 3){
              this.loading = true;
              await this.getAvailableRecords(this.search);
              this.loading = false;
            }
          }
        },
        mounted() {
          this.$nextTick(async function () {
            this.loading = true;
            await this.getAvailableRecords(null);
            this.loading = false;
          });
        },
        methods: {
          ...mapActions("editor", ["getAvailableRecords"]),
          addItem(id) {
            this.sections.relations.data.recordAssociations.push({
              linkedRecord: this.availableRecords[id],
              recordAssocLabel: "",
              new: true,
            });
            this.$scrollTo('#association_' + id, 450, {
              container: '#associatedRecords',
              easing: 'ease-in',
            })
          },
          removeItem(id){
            this.sections.relations.data.recordAssociations.splice(id, 1);
          },
          isActive(record){
            let found = null;
            this.associations.forEach((obj) => {
              if (obj.linkedRecord.id === record.id && obj.linkedRecord.registry === record.registry){
                found = obj;
              }
            });
            return !!found;
          }
        }
    }
</script>

<style scoped>

  .scrollZone {
    height: 60vh;
    width: 100%;
    overflow-y: scroll;
  }

  .bordered{
    border-bottom: 1px dashed #ccc;
  }

</style>
