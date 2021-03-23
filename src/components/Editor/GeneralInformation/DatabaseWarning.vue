<template>
  <div>
    <v-expand-transition>
      <v-overlay
        v-if="showOverlay"
        :dark="false"
        opacity="0.8"
      >
        <v-card width="1000px">
          <v-card-title
            class="white--text"
            :class="{'red': answered, 'info': !answered}"
          >
            <span v-if="!answered">Before you begin...</span>
            <span v-else>
              FAIRsharing does not allow the uploading of experimental data!
            </span>
          </v-card-title>
          <v-card-text class="pt-4">
            <v-slide-x-transition>
              <div v-if="!answered">
                <h2 class="mb-2">
                  Please take a moment to answer the following question.
                </h2>
                <div>
                  Are you intending to upload experimental results to FAIRsharing,
                  e.g as a prerequisite for submitting an article to a journal?
                </div>
              </div>
              <div v-if="answered">
                <div>
                  FAIRsharing records describe community resources such as
                  databases, standards and policies and
                  are not used to describe or store experimental data.
                  For more information, please see the 'Adding Database Records'
                  section within our new record documentation. <br>
                  FAIRsharing can help you find a repository for you to store your data via our Wizard or Advanced Search pages. If you are still unsure as to how to proceed then you may contact us.
                </div>
              </div>
            </v-slide-x-transition>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="!answered"
              class="success"
              @click="pressYes()"
            >
              Yes
            </v-btn>
            <v-btn
              v-if="!answered"
              class="warning"
              @click="pressNo()"
            >
              <span>No</span>
            </v-btn>
            <v-btn
              v-else
              class="error"
              @click="closeMenu()"
            >
              <span>Go back</span>
            </v-btn>
            <v-btn
              class="info"
              href="mailto:contact@fairsharing.org?subject=Creating/editing a record in FAIRsharing"
            >
              Ask a question
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";

    export default {
        name: "DatabaseWarning",
        data(){
            return {
                showOverlay: false,
                answered: false,
                oldVal: null,
                submitted: 0
            }
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            ...mapState("record", ["sections"]),
            type: {
                get(){
                  return this.getSection("generalInformation").data.type.name
                }
            }
        },
        watch: {
            type(val, oldVal){
                this.oldVal = oldVal;
                if (val === 'knowledge_base' || val === 'repository'){
                    this.showOverlay = true;
                }
            }
        },
        methods: {
          closeMenu(){
            this.$store.commit("record/resetRegistry");
            this.showOverlay = false;
            this.answered = false;
          },
          pressYes(){
            this.answered = true;
            this.submitted += 1;
          },
          pressNo(){
            this.showOverlay = false;
            if (this.submitted >= 1) {
              // Instead of this log, access the store and add the relevant field to the record.
              this.sections.generalInformation.data.is_dataset = true;
            }
          }
        }
    }
</script>
