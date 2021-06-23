<template>
  <main class="pa-15 mb-10">
    <!--  main_title -->
    <h1 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Making standards, databases and policies count, collaborators and activities, all working to enable the FAIR Principles and to make Standards, Knowledgebases, Repositories and Data Policies FAIR.
    </h1>

    <!--  main_title_2 -->
    <h2 class="text-h6 mt-8 text-xl-h5 mb-2 mb-xl-6">
      How to cite FAIRsharing:
    </h2>

    <!-- eslint-disable vue/no-v-html -->
    <p
      v-linkified:options="{ className: 'underline-effect' }"
      :class="['mb-8 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="subtitle"
    />
    <!-- eslint-enable vue/no-v-html -->

    <p
      :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      A selection of official reports from funders and other organizations that recommend the use of FAIRsharing as a key asset for all stakeholders to enable FAIR data:
    </p>

    <!--  External Links  -->
    <v-row
      class="mt-2"
    >
      <v-col
        v-for="(item,index) in externalLinks"
        :key="index+'_'+item.titleLink"
        cols="12"
        md="12"
        lg="4"
        :class="['pa-5 links',{'max-width-32-percent':$vuetify.breakpoint.mdAndUp}]"
      >
        <a
          :href="item.titleLink"
          target="_blank"
        >
          <p
            :class="['mb-0 lato-font-medium lato-text-sm underline-effect',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
          >
            {{ item.title }}
          </p>
        </a>
        <p
          :class="['mb-0 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
        >
          {{ item.text }}
        </p>
      </v-col>
    </v-row>

    <p
      :class="['mb-0 mt-2 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Learn more about the FAIRsharing community, and please do not hesitate to <a
        href="mailto:contact@fairsharing.org"
        class="underline-effect"
      >contact</a> us if you are interested in working with us.
    </p>

    <!-- Adopters, activities, Governance -->
    <v-container>
      <v-row
        class="block-category"
      >
        <v-col
          cols="12"
          sm="12"
          md="4"
          lg="4"
        >
          <v-card
            v-scroll-to="'#Adopters'"
            class="mx-auto block-category__card cursor-pointer"
            max-width="350"
            height="300"
            @click="()=>$router.push({path:'#Adopters'})"
          >
            <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
              <div
                style="height: 136px"
                class="d-flex justify-center"
              >
                <v-img
                  contain
                  height="130px"
                  :src="$vuetify.icons.values['home_standard'].icon"
                />
              </div>
              <v-card-title class="d-inline text-h4 text-center text-md-h5 text-lg-h4">
                Adopters
              </v-card-title>
            </div>
            <v-card-text
              class="text--primary text-justify"
            >
              <p class="text-center">
                Lighthouse stakeholders from our user base.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!--  content    -->
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div id="Adopters">
        Adopters
      </div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div id="Activities">
        Activities
      </div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div id="Governance">
        Governance
      </div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
      <div>a</div>
    </v-container>
  </main>
</template>

<script>
/**
* All static pages will be handle through this namespace
* @namespace Static
*/
/** This component handles the sign-up/register page
* @memberOf Static
* @name Community
* @type module
* @instance
* */
    export default {
        name: "Community",
        title: "This will be the community page",
        data:()=> {
          return {
            subtitle:'Sansone, McQuilton, Rocca-Serra et al. FAIRsharing as a community approach to standards, repositories and policies. Nat Biotech. 37, 358–367(2019).\n' +
                'https://doi.org/10.1038/s41587-019-0080-8\n',
            externalLinks: [
              {
                title: '“EOSC Strategic Research and Innovation Agenda" 2021',
                titleLink: 'https://www.eosc.eu/sites/default/files/EOSC-SRIA-V1.0_15Feb2021.pdf',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“Recommendations on certifying services required to enable FAIR within EOSC” 2021',
                titleLink: 'https://doi.org/10.2777/127253',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“FAIR Metrics for EOSC” 2021',
                titleLink: 'https://doi.org/10.2777/70791',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“Six Recommendations for implementation of FAIR practice” 2020',
                titleLink: 'https://doi.org/10.2777/986252',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“Country Sheets Analysis” 2020',
                titleLink: 'https://doi.org/10.2777/568900',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“Horizon 2020 projects working on COVID-19, SARS-CoV-2 and related topics” 2020',
                titleLink: 'https://ec.europa.eu/research/participants/data/ref/h2020/other/hi/oa-pilot/h2020-guidelines-oa-covid-19_en.pdf',
                text:' Funder: EU H2020\n' +
                    'Discipline: Coronavirus research '
              },
              {
                title: '“Horizon 2020 Annotated Grant Agreement” 2019',
                titleLink: 'https://ec.europa.eu/research/participants/data/ref/h2020/grants_manual/amga/h2020-amga_en.pdf',
                text:' Funder: EU H2020\n' +
                    'Discipline: All '
              },
              {
                title: '“Sustainable and FAIR Data Sharing in the Humanities” 2020',
                titleLink: 'https://doi.org/10.7486/DRI.tq582c863',
                text:' Federation: Academies of Sciences and Humanities - ALLEA\n' +
                    'Discipline: Humanities '
              },
              {
                title: '“Open Research Data and Data Management Plans” 2019',
                titleLink: 'https://erc.europa.eu/sites/default/files/document/file/ERC_info_document-Open_Research_Data_and_Data_Management_Plans.pdf',
                text:' Funder: European Research Council - ERC\n' +
                    'Discipline: All '
              },
              {
                title: '“Turning FAIR into Reality” 2018',
                titleLink: 'https://doi.org/10.2777/1524',
                text:' Funder: EU European Open Science Cloud - EOSC\n' +
                    'Discipline: All '
              },
              {
                title: '“Open Research Data Task Force Case Study” 2018',
                titleLink: 'https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/775379/Case-studies-ORDTF-July-2018.pdf',
                text:' Governamental: UK Open Research Data Task Force\n' +
                    'Discipline: All '
              },
              {
                title: '“Framework for Discipline-specific Research Data Management” 2018',
                titleLink: 'https://www.scienceeurope.org/wp-content/uploads/2018/01/SE_Guidance_Document_RDMPs.pdf',
                text:' Funders Association: Science Europe\n' +
                    'Discipline: All '
              }
            ],

          }
        },
        methods: {
            greet: function () {
                return 0
            }
        }
    }
</script>

<style scoped lang="scss">
.links {
  border: 1px #d4d4d4 solid;
  margin: 2px;
}

.block-category {
  &__card {
    transition: all .2ms ease;
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradiant {
      height: 200px;
      background: rgb(171, 171, 171);
      background: linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -webkit-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -o-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -ms-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
    }
  }
}

.v-divider {
  margin: 8px;
}

</style>
