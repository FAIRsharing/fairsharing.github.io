<template>
  <div>
    <h4 class="text-center">Associated Records</h4>
    <!--   row style     -->
    <div
      v-if="!isColumn"
      class="associated-records-holder"
    >
      <div
        v-for="(associatedRecord, associationName) in associatedRecords"
        :key="associationName+associatedRecord.val"
        class="associated-records"
      >
        <span>{{ associatedRecord.label }}</span>
        <b>{{ associatedRecord.val }}</b>
      </div>
    </div>

    <!--   column style     -->
    <div
      v-else
      class="associated-records-holder-column"
    >
      <div
        v-for="(associatedRecord, associationName) in associatedRecords"
        :key="associationName+associatedRecord.val"
        class="associated-records"
      >
        <span>{{ associatedRecord.label }}</span>
        <b>{{ associatedRecord.val }}</b>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "AssociatedRecordsStack",
        props: {
            associatedRecords: {
                type: Object,
                default: null,
            },
            isColumn: {
                type: Boolean,
                default: false
            },
        }
    }
</script>

<style scoped lang="scss">

    .associated-records b {
        padding: 0 3px 0 2px;
    }

    .associated-records-holder {
        display: flex;
        flex-direction: row;

        .associated-records {
            margin-right: 5px;
            background: rgb(2, 0, 36);
            background: linear-gradient(rgba(102, 137, 153, 0.5), rgba(102, 137, 153, 0.2));
            padding: 2px 10px 2px 10px;
            border-radius: 10px 0 10px 0;
            -webkit-border-radius: 10px 0 10px 0;
            -moz-border-radius: 10px 0 10px 0;

            span {
                color: white;
                padding-right: 5px;
            }

            b {
                background: rgba(39, 170, 225, 0.5);
                color: white;
            }
        }
    }

    .associated-records-holder-column {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;

        .associated-records {
            margin: 5px 5px 0 0;
            background: rgb(2, 0, 36);
            background: linear-gradient(rgba(102, 137, 153, 0.5), rgba(102, 137, 153, 0.2));
            padding: 2px 10px 2px 10px;
            border-radius: 10px 0 10px 0;
            -webkit-border-radius: 10px 0 10px 0;
            -moz-border-radius: 10px 0 10px 0;

            span {
                color: white;
                padding-right: 5px;
            }

            b {
                background: rgba(39, 170, 225, 0.5);
                color: white;
            }
        }
    }

    h3 {
        color: rgba(170, 170, 170, 0.5);
        text-align: center;
        font-size: 1rem;
        font-weight: bold;
    }

</style>