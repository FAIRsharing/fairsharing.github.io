<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="2"
        class="pt-0 mt-0"
      >
        <v-card height="1180px">
          <v-card-title class="blue white--text">
            Legend and configuration
          </v-card-title>
          <v-card-text class="pt-3">
            Configuration parameters and legend will go in this box.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="10"
        class="pt-0 mt-0"
      >
        <v-card
          v-if="loading"
          height="100%"
        >
          <v-card-text class="text-center blue--text body-1">
            Loading your data
          </v-card-text>
          <Loaders />
        </v-card>
        <highcharts
          v-else
          ref="chartComponent"
          :options="options"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import {Chart} from 'highcharts-vue'
    import GraphClient from '@/components/GraphClient/GraphClient.js'
    import graphQuery from '@/components/GraphClient/queries/getGraphRelations.json'
    import Loaders from "../components/Navigation/Loaders";

    const graphClient = new GraphClient();

    export default {
        name: "GraphTest",
        components: {
          Loaders,
            highcharts: Chart,
        },
        data () {
            return {
                loading: false,
                options: {
                    exporting: {
                        sourceWidth: 1502,
                        sourceHeight: 1600,
                        scale: 1,
                    },
                    tooltip: {
                      enabled: false
                    },
                    chart: {
                        type: 'networkgraph',
                        height: '1280px',
                        plotBorderWidth: 0,
                        plotShadow: true,
                        renderTo: 'container',
                        margin: 10,
                        marginBottom: 100,
                        plotBackgroundColor: "#FFFFFF",
                    },
                    title: {
                        text: 'FAIRsharing',
                        align: 'left',
                        verticalAlign: 'top',
                        y: 30,
                        x: 10,
                        style: {
                            color: '#2F2F30',
                            font: 'bold 32px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    subtitle: {
                        text: 'Network Graph',
                        align: 'left',
                        verticalAlign: 'top',
                        y: 60,
                        x: 10,
                        style: {
                            color: '#2F2F30',
                            font: 'bold 25px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        networkgraph: {
                            keys: ['from', 'to', 'rel'],
                            layoutAlgorithm: {
                                enableSimulation: true,
                                linkLength: 60,
                                maxIterations: 120
                            }
                        },
                    },
                    series: [{
                        animation: false,
                        dataLabels: {
                            enabled: true,
                            linkFormat: '{point.rel}',
                            color: '#2F2F30',
                            font: 'light 30px "Trebuchet MS", Verdana, sans-serif',
                            linkTextPath: {
                              attributes: {
                                dy: 12
                              }
                            },
                            formatter: function() {
                              // this is not the component but the point
                              if (this.key.length < 40) {
                                return this.key
                              }
                              return this.key.substring(0, 40) + "..."
                            }
                        },
                        link: {
                          color: "rgba(0, 0, 0, 0.5)",
                          width: 2,
                        },
                        id: 'relationships',
                        data: [],
                        states: {
                          inactive: {
                            enabled: true,
                            linkOpacity: 0.000001,
                            opacity: 0.000001
                          }
                        }
                    }],
                    nodes: null
                },
                relations: null,
                markers: {
                    standard: 'circle',
                    database: 'square',
                    policy: 'triangle',
                    collection: 'diamond'
                }
            }
        },
        mounted() {
            this.$nextTick(async function () {
                await this.getData();
            })
        },
        methods: {
            async getData(){
                this.loading = true;
                this.options.series[0].data = [];
                this.options.series[0].nodes = [];

                let seriesData = [];
                let nodes = [];
                graphQuery.queryParam = {id: this.$route.params.id};
                const response = await graphClient.executeQuery(graphQuery);
                this.relations = response.fairsharingRecord;
                this.options.subtitle.text = this.relations.metadata.name + ' Network Graph';
                nodes.push({
                    id: this.relations.metadata.name,
                    marker: {
                        symbol: this.markers[this.relations.registry.toLowerCase()],
                        radius: 20,
                        fillColor: "red",
                        // symbol: `url(${this.$vuetify.icons.values[this.relations.type].icon})`
                    }
                });
                let newIDs = [];
                this.relations.recordAssociations.forEach(association => {
                    newIDs.push(association.linkedRecord.id);
                    seriesData.push([
                        this.relations.metadata.name,
                        association.linkedRecord.name,
                        association.recordAssocLabel.replace(/_/g, " ").toUpperCase()
                    ]);
                    nodes.push({
                        id: association.linkedRecord.name,
                        marker: {
                            radius: 10,
                            symbol: this.markers[association.linkedRecord.registry.toLowerCase()]
                            // symbol: `url(${this.$vuetify.icons.values[association.linkedRecord.type].icon})`
                        }
                    });
                });
                let newRelations = await Promise.all(newIDs.map(id => {
                    if (id) {
                        let subQuery = JSON.parse(JSON.stringify(graphQuery));
                        subQuery.queryParam.id = id;
                        return graphClient.executeQuery(subQuery);
                    }
                }));
                newRelations.forEach(newRelation => {
                  if (Object.keys(newRelation).includes('fairsharingRecord')) {
                    let subAssociations = newRelation.fairsharingRecord.recordAssociations;
                    subAssociations.forEach(subAssociation => {
                      if (newIDs.includes(subAssociation.linkedRecord.id)) {
                        seriesData.push([
                          newRelation.fairsharingRecord.metadata.name,
                          subAssociation.linkedRecord.name,
                          subAssociation.recordAssocLabel.replace(/_/g, " ").toUpperCase()
                        ]);
                        /*nodes.push({
                                id: subAssociation.linkedRecord.name,
                                color: 'orange',
                                marker: {
                                    radius: 5
                                }
                            });*/
                      }
                    });
                  }
                });
                this.options.series[0].nodes = nodes;
                this.options.series[0].data = seriesData;
                this.loading = false;

            }
        }
    }
</script>

<style scoped>
</style>
