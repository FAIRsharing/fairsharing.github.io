<template>
  <main class="pa-15 mb-10">
    <!-- eslint-disable vue/no-v-html -->
    <!--  Header  -->
    <h1
      class="text-h5 text-xl-h4 mb-2 mb-xl-6"
      v-html="$sanitize(newData.header)"
    />
    <!--  subtitle  -->
    <p
      :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
      v-html="$sanitize(newData.firstDescription)"
    />
    <!--  BulletPoints  -->
    <div
      v-for="(item,index) in newData.description"
      :key="item.header+'_'+index"
    >
      <h2
        v-if="item.header"
        class="text-h6 text-xl-h5"
      >
        {{ item.header }}
      </h2>
    </div>
    <br>
    <strong class="text-h4">What to add</strong>
    <div
      v-if="newData.firstBlock"
      class="mt-2"
    >
      <v-container>
        <v-row
          class="block-category"
        >
          <v-col
            v-for="(item,index) in newData.firstBlock.items"
            :key="item+'_'+index"
            cols="12"
            sm="12"
            md="4"
            lg="4"
          >
            <v-card
              class="mx-auto block-category__card"
              max-width="350"
              height="320"
            >
              <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
                <div
                  style="height: 136px"
                  class="d-flex justify-center"
                >
                  <v-img
                    class="mt-5"
                    contain
                    height="100px"
                    :src="$vuetify.icons.values['home_standard'].icon"
                  />
                </div>
                <v-card-title class="d-inline text-h4 text-center text-md-h5 text-lg-h4">
                  {{ newData.firstBlock.items[index].title }}
                </v-card-title>
              </div>
              <v-card-text
                class="text--primary height-100"
              >
                {{ newData.firstBlock.items[index].description }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-sheet
        class="mb-5 pa-6"
        color="accent3 white--text"
        elevation="3"
      >
        <div style="background-color:white;width:100px;padding:5px">
          <v-img
            src="/assets/icons/nodatasets.png"
            width="100"
          />
        </div>
        <h2 class="text-h4 my-2">
          No datasets, please
        </h2>
        <b>Datasets</b>
        <p style="font-size: 1.1rem!important">
          FAIRsharing helps researchers find the right database in which to submit their data. However, we do not store data ourselves. If you would like to find a home for your data, try browsing our complete <a
            href="https://fairsharing.org/browse/subject"
            class="underline-effect font-weight-black white--text"
            target="_blank"
          >subject hierarchy</a> or searching our <a
            href="https://fairsharing.org/databases"
            class="underline-effect font-weight-black white--text"
            target="_blank"
          >database records</a> to find an appropriate database for your data type. Alternatively, you could look at our collection of <a
            href="https://fairsharing.org/GeneralRepositoryComparison"
            class="underline-effect font-weight-black white--text"
            target="_blank"
          >Generalist Repositories</a> or browse all <a
            href="https://fairsharing.org/browse/subject?term=Subject%2520Agnostic"
            class="underline-effect font-weight-black white--text"
            target="_blank"
          >subject-agnostic records</a>, which may provide you with a location to store data from a wider range of research areas. If you are submitting to a particular journal, you can also search for that journal or its publisher; if they are registered with us, then their <a
            href="https://fairsharing.org/search?fairsharingRegistry=Policy"
            class="underline-effect font-weight-black white--text"
            target="_blank"
          >FAIRsharing data policy record(s)</a> may contain a list of recommended databases and/or standards.
        </p>
      </v-sheet>
      <v-sheet
        :class="['mb-5 pa-6',{'mx-25-percent':$vuetify.breakpoint.mdAndUp}]"
        color="uncertain_color white--text"
        elevation="3"
      >
        <h3 class="text-h4">
          Get Started!
        </h3>
        <p style="font-size:1.2rem">
          If you have not already done so, you may wish to <a
            href="https://fairsharing.gitbook.io/fairsharing/"
            target="_blank"
            class="underline-effect font-weight-black white--text"
          >create an account.</a>
        </p>
        <p style="font-size:1.2rem">
          Any questions? Don't hesitate to <a
            href="mailto:contact@fairsharing.org"
            class="font-weight-black white--text underline-effect"
          >contact us</a> or to
          <a
            href="https://fairsharing.gitbook.io/fairsharing/"
            class="font-weight-black white--text underline-effect"
          >
            consult our documentation.
          </a>
        </p>
        <v-btn
          color="primary"
          to="/create"
        >
          Add New Record
        </v-btn>
      </v-sheet>
    </div>
    <!-- eslint-enable vue/no-v-html -->
  </main>
</template>

<script>
import newData from '@/data/NewStaticPageData.json'
export default {
  name: "New",
  data: () => {
    return {
      newData,
    }
  }
}
</script>

<style scoped lang="scss">
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
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>