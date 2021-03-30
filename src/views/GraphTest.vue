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
                if (nodes.length > 200){
                  this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = 40;
                  this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = 50;
                }
                else if (nodes.length > 100){
                  this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = 60;
                  this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = 100;
                }
                else if (nodes.length < 30) {
                  this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = 80;
                  this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = 300;
                }
                else {
                  this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = 60;
                  this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = 120;
                }
                this.options.series[0].nodes = nodes;
                this.options.series[0].data = seriesData;
                this.loading = false;
                /*
                console.log("NODES: ");
                console.log(JSON.stringify(nodes));
                console.log("DATA: ");
                console.log(JSON.stringify(seriesData));
                */

            }
        }
    }
    /*
    Nodes: [{"id":"GenBank","marker":{"symbol":"square","radius":20,"fillColor":"red"}},{"id":"DNA Data Bank of Japan","marker":{"radius":10,"symbol":"square"}},{"id":"Integrated Microbial Genomes And Microbiomes","marker":{"radius":10,"symbol":"square"}},{"id":"NONCODE","marker":{"radius":10,"symbol":"square"}},{"id":"GENI-ACT","marker":{"radius":10,"symbol":"square"}},{"id":"Genomes OnLine Database","marker":{"radius":10,"symbol":"square"}},{"id":"Influenza Research Database","marker":{"radius":10,"symbol":"square"}},{"id":"European Nucleotide Archive","marker":{"radius":10,"symbol":"square"}},{"id":"VirHostNet 2.0","marker":{"radius":10,"symbol":"square"}},{"id":"TIGRFAMs","marker":{"radius":10,"symbol":"square"}},{"id":"Expressed Sequence Tags database","marker":{"radius":10,"symbol":"square"}},{"id":"The Protein Database","marker":{"radius":10,"symbol":"square"}},{"id":"NCBI Viral Genomes Resource","marker":{"radius":10,"symbol":"square"}},{"id":"Dryad","marker":{"radius":10,"symbol":"square"}},{"id":"NCBI BioSample","marker":{"radius":10,"symbol":"square"}},{"id":"Ascidian Network for In Situ Expression and Embryological Data","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Genomes","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Bacteria","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Protists","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Plants","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Fungi","marker":{"radius":10,"symbol":"square"}},{"id":"Ensembl Metazoa","marker":{"radius":10,"symbol":"square"}},{"id":"Visual Database for Organelle Genome","marker":{"radius":10,"symbol":"square"}},{"id":"Genomic Observatories Meta-Database","marker":{"radius":10,"symbol":"square"}},{"id":"ViruSurf","marker":{"radius":10,"symbol":"square"}},{"id":"MycoCosm","marker":{"radius":10,"symbol":"square"}},{"id":"RNA Atlas of Structure Probing","marker":{"radius":10,"symbol":"square"}},{"id":"Paired Omics Data Platform","marker":{"radius":10,"symbol":"square"}},{"id":"Short Read Archive eXtensible Markup Language","marker":{"radius":10,"symbol":"circle"}},{"id":"NCBI Taxonomy","marker":{"radius":10,"symbol":"circle"}},{"id":"GenBank Sequence Format","marker":{"radius":10,"symbol":"circle"}},{"id":"FASTA Sequence Format","marker":{"radius":10,"symbol":"circle"}},{"id":"FASTQ Sequence and Sequence Quality Format","marker":{"radius":10,"symbol":"circle"}},{"id":"Access to Biological Collection Data DNA extension","marker":{"radius":10,"symbol":"circle"}},{"id":"INSD sequence record XML","marker":{"radius":10,"symbol":"circle"}},{"id":"Minimum Information about any (x) Sequence","marker":{"radius":10,"symbol":"circle"}},{"id":"A Gold Path format","marker":{"radius":10,"symbol":"circle"}},{"id":"Common Metadata Elements for Cataloging Biomedical Datasets","marker":{"radius":10,"symbol":"circle"}},{"id":"DDBJ/ENA/GenBank Feature Table","marker":{"radius":10,"symbol":"circle"}}]
    Data: [["GenBank","DNA Data Bank of Japan","RELATED TO"],["GenBank","Integrated Microbial Genomes And Microbiomes","RELATED TO"],["GenBank","NONCODE","RELATED TO"],["GenBank","GENI-ACT","RELATED TO"],["GenBank","Genomes OnLine Database","RELATED TO"],["GenBank","Influenza Research Database","RELATED TO"],["GenBank","European Nucleotide Archive","RELATED TO"],["GenBank","VirHostNet 2.0","RELATED TO"],["GenBank","TIGRFAMs","RELATED TO"],["GenBank","Expressed Sequence Tags database","RELATED TO"],["GenBank","The Protein Database","RELATED TO"],["GenBank","NCBI Viral Genomes Resource","RELATED TO"],["GenBank","Dryad","RELATED TO"],["GenBank","NCBI BioSample","RELATED TO"],["GenBank","Ascidian Network for In Situ Expression and Embryological Data","RELATED TO"],["GenBank","Ensembl Genomes","RELATED TO"],["GenBank","Ensembl Bacteria","RELATED TO"],["GenBank","Ensembl Protists","RELATED TO"],["GenBank","Ensembl Plants","RELATED TO"],["GenBank","Ensembl Fungi","RELATED TO"],["GenBank","Ensembl Metazoa","RELATED TO"],["GenBank","Visual Database for Organelle Genome","RELATED TO"],["GenBank","Genomic Observatories Meta-Database","RELATED TO"],["GenBank","ViruSurf","RELATED TO"],["GenBank","MycoCosm","RELATED TO"],["GenBank","RNA Atlas of Structure Probing","RELATED TO"],["GenBank","Paired Omics Data Platform","RELATED TO"],["GenBank","Short Read Archive eXtensible Markup Language","IMPLEMENTS"],["GenBank","NCBI Taxonomy","IMPLEMENTS"],["GenBank","GenBank Sequence Format","IMPLEMENTS"],["GenBank","FASTA Sequence Format","IMPLEMENTS"],["GenBank","FASTQ Sequence and Sequence Quality Format","IMPLEMENTS"],["GenBank","Access to Biological Collection Data DNA extension","IMPLEMENTS"],["GenBank","INSD sequence record XML","IMPLEMENTS"],["GenBank","Minimum Information about any (x) Sequence","IMPLEMENTS"],["GenBank","A Gold Path format","IMPLEMENTS"],["GenBank","Common Metadata Elements for Cataloging Biomedical Datasets","IMPLEMENTS"],["GenBank","DDBJ/ENA/GenBank Feature Table","IMPLEMENTS"],["DNA Data Bank of Japan","European Nucleotide Archive","RELATED TO"],["DNA Data Bank of Japan","NCBI Viral Genomes Resource","RELATED TO"],["DNA Data Bank of Japan","Ensembl Genomes","RELATED TO"],["DNA Data Bank of Japan","Ensembl Bacteria","RELATED TO"],["DNA Data Bank of Japan","Ensembl Protists","RELATED TO"],["DNA Data Bank of Japan","Ensembl Plants","RELATED TO"],["DNA Data Bank of Japan","Ensembl Metazoa","RELATED TO"],["DNA Data Bank of Japan","Paired Omics Data Platform","RELATED TO"],["DNA Data Bank of Japan","NCBI Taxonomy","IMPLEMENTS"],["DNA Data Bank of Japan","GenBank Sequence Format","IMPLEMENTS"],["DNA Data Bank of Japan","FASTA Sequence Format","IMPLEMENTS"],["DNA Data Bank of Japan","FASTQ Sequence and Sequence Quality Format","IMPLEMENTS"],["DNA Data Bank of Japan","INSD sequence record XML","IMPLEMENTS"],["DNA Data Bank of Japan","Minimum Information about any (x) Sequence","IMPLEMENTS"],["DNA Data Bank of Japan","DDBJ/ENA/GenBank Feature Table","IMPLEMENTS"],["Integrated Microbial Genomes And Microbiomes","GENI-ACT","RELATED TO"],["Integrated Microbial Genomes And Microbiomes","Genomes OnLine Database","RELATED TO"],["Integrated Microbial Genomes And Microbiomes","Paired Omics Data Platform","RELATED TO"],["Integrated Microbial Genomes And Microbiomes","GenBank Sequence Format","IMPLEMENTS"],["Integrated Microbial Genomes And Microbiomes","FASTA Sequence Format","IMPLEMENTS"],["Integrated Microbial Genomes And Microbiomes","FASTQ Sequence and Sequence Quality Format","IMPLEMENTS"],["NONCODE","GenBank Sequence Format","IMPLEMENTS"],["NONCODE","FASTA Sequence Format","IMPLEMENTS"],["GENI-ACT","FASTA Sequence Format","IMPLEMENTS"],["Genomes OnLine Database","MycoCosm","RELATED TO"],["Genomes OnLine Database","Minimum Information about any (x) Sequence","IMPLEMENTS"],["Influenza Research Database","GenBank Sequence Format","IMPLEMENTS"],["Influenza Research Database","FASTA Sequence Format","IMPLEMENTS"],["European Nucleotide Archive","NCBI Viral Genomes Resource","RELATED TO"],["European Nucleotide Archive","Ensembl Genomes","RELATED TO"],["European Nucleotide Archive","Ensembl Bacteria","RELATED TO"],["European Nucleotide Archive","Ensembl Protists","RELATED TO"],["European Nucleotide Archive","Ensembl Plants","RELATED TO"],["European Nucleotide Archive","Ensembl Fungi","RELATED TO"],["European Nucleotide Archive","Ensembl Metazoa","RELATED TO"],["European Nucleotide Archive","Paired Omics Data Platform","RELATED TO"],["European Nucleotide Archive","Short Read Archive eXtensible Markup Language","IMPLEMENTS"],["European Nucleotide Archive","NCBI Taxonomy","IMPLEMENTS"],["European Nucleotide Archive","FASTA Sequence Format","IMPLEMENTS"],["European Nucleotide Archive","FASTQ Sequence and Sequence Quality Format","IMPLEMENTS"],["European Nucleotide Archive","INSD sequence record XML","IMPLEMENTS"],["European Nucleotide Archive","Minimum Information about any (x) Sequence","IMPLEMENTS"],["European Nucleotide Archive","DDBJ/ENA/GenBank Feature Table","IMPLEMENTS"],["VirHostNet 2.0","NCBI Viral Genomes Resource","RELATED TO"],["VirHostNet 2.0","GenBank Sequence Format","IMPLEMENTS"],["VirHostNet 2.0","FASTA Sequence Format","IMPLEMENTS"],["VirHostNet 2.0","NCBI Taxonomy","IMPLEMENTS"],["Expressed Sequence Tags database","FASTA Sequence Format","IMPLEMENTS"],["The Protein Database","FASTA Sequence Format","IMPLEMENTS"],["NCBI Viral Genomes Resource","FASTA Sequence Format","IMPLEMENTS"],["Dryad","Common Metadata Elements for Cataloging Biomedical Datasets","IMPLEMENTS"],["Ensembl Genomes","Ensembl Bacteria","RELATED TO"],["Ensembl Genomes","Ensembl Protists","RELATED TO"],["Ensembl Genomes","Ensembl Plants","RELATED TO"],["Ensembl Genomes","Ensembl Fungi","RELATED TO"],["Ensembl Genomes","Ensembl Metazoa","RELATED TO"],["Ensembl Genomes","NCBI Taxonomy","IMPLEMENTS"],["Ensembl Bacteria","NCBI Taxonomy","IMPLEMENTS"],["Ensembl Protists","NCBI Taxonomy","IMPLEMENTS"],["Ensembl Plants","NCBI Taxonomy","IMPLEMENTS"],["Ensembl Fungi","NCBI Taxonomy","IMPLEMENTS"],["Ensembl Metazoa","NCBI Taxonomy","IMPLEMENTS"],["Visual Database for Organelle Genome","GenBank Sequence Format","IMPLEMENTS"],["Visual Database for Organelle Genome","FASTA Sequence Format","IMPLEMENTS"],["Visual Database for Organelle Genome","NCBI Taxonomy","IMPLEMENTS"],["Genomic Observatories Meta-Database","FASTA Sequence Format","IMPLEMENTS"],["Genomic Observatories Meta-Database","FASTQ Sequence and Sequence Quality Format","IMPLEMENTS"],["Genomic Observatories Meta-Database","Minimum Information about any (x) Sequence","IMPLEMENTS"],["RNA Atlas of Structure Probing","FASTA Sequence Format","IMPLEMENTS"],["FASTQ Sequence and Sequence Quality Format","FASTA Sequence Format","RELATED TO"]]
     */
</script>

<style scoped>
</style>
