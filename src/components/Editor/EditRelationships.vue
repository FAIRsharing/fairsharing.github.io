<template>
  <v-card id="editRelationships">
    <v-card-title class="grey lighten-4 blue--text">
      Edit Relationships
    </v-card-title>
    <v-card-text class="pt-2">
      <v-container fluid>
        <v-row>
          <!-- LEFT PANEL -->
          <v-col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            xs="12"
          >
            <v-card
              class="my-5 pl-4 grey lighten-3"
              elevation="5"
            >
              <v-card-title>
                Available records:
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="search"
                  outlined
                  label="Refine search"
                  placeholder="e.g. GenBank"
                  hide-details
                  :loading="loading"
                />
              </v-card-text>
              <v-list
                v-if="availableRecords.length > 0"
                class="transparent scrollZone pr-3"
                style="border-bottom: 1px solid #ccc;"
              >
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
                      @click="showRelationsPanel = true"
                    >
                      <!--@click="addItem(index)"-->
                      <v-icon small>
                        fa-arrow-right
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <v-list
                v-else
                class="transparent scrollZone pr-3"
              >
                <v-list-item>No records could be found with this search term.</v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- RIGHT PANEL -->
          <v-col
            xl="6"
            lg="6"
            md="6"
            sm="6"
            xs="12"
          >
            <v-card
              class="my-5 pl-4 grey lighten-3"
              elevation="5"
            >
              <v-card-title>
                <span>Associated records ({{ associations.length }})</span>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  v-model="searchAssociations"
                  outlined
                  label="Search through existing associations names"
                  placeholder="e.g. GenBank"
                  hide-details
                />
              </v-card-text>
              <v-list
                v-if="getAssociations.length > 0"
                id="associatedRecords"
                class="transparent scrollZone pr-3"
              >
                <v-list-item
                  v-for="(association, index) in getAssociations"
                  :id="'association_' + association.linkedRecord.id"
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
              <v-list
                v-else
                class="transparent scrollZone pr-3"
              >
                <v-list-item>
                  This record does not have any association.
                </v-list-item>
              </v-list>
            </v-card>
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

    <v-dialog
      v-model="showRelationsPanel"
      class="py-0"
      :dark="false"
      opacity="0.8"
      persistent
      width="700px"
    >
      <v-container
        fluid
        class="py-0"
      >
        <v-row justify="center">
          <v-card
            class="flexCard"
            width="100%"
          >
            <v-card-text>
              Select a relationship type
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="error"
                @click="showRelationsPanel = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-container>
    </v-dialog>
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
            search: null,
            searchAssociations: null,
            showRelationsPanel: false
          }
        },
        computed: {
          ...mapState("record", ["sections"]),
          ...mapState("editor", ["icons", "availableRecords"]),
          associations(){
            return this.sections.relations.data.recordAssociations;
          },
          getAssociations(){
            if (!this.searchAssociations) return this.associations;
            return this.associations.filter(obj => {
              return obj.linkedRecord.name.includes(this.searchAssociations)
            });
          }
        },
        watch: {
          async search() {
            this.loading = true;
            let search = null;
            if (this.search.length >= 3) {
              search = this.search;
            }
            await this.getAvailableRecords(search);
            this.loading = false;
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
            this.searchAssociations = null;
            this.sections.relations.data.recordAssociations.push({
              linkedRecord: this.availableRecords[id],
              recordAssocLabel: "undefined",
              new: true,
            });
            this.$nextTick(() => {
              this.$scrollTo('#association_' + this.availableRecords[id].id, 450, {
                container: '#associatedRecords',
                easing: 'ease-in',
              })
            });
          },
          removeItem(id){
            this.sections.relations.data.recordAssociations.splice(id, 1);
          }
        }
    }
</script>

<style scoped>

  .scrollZone {
    height: 50vh;
    width: 100%;
    overflow-y: scroll;
  }

  .bordered{
    border-bottom: 1px dashed #ccc;
  }

</style>
