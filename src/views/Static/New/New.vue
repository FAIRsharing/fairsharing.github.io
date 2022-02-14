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
      <ul class="d-flex flex-wrap">
        <li
          v-for="(item,index) in newData.firstBlock.items"
          :key="item.icon+'_'+index"
          :class="['d-flex flex-column text-center',$vuetify.breakpoint.smAndDown?'ma-auto':'mr-auto']"
          style="width:400px;min-height:200px"
        >
          <Icon
            :item="item.icon"
            :height="50"
            size="50"
            wrapper-class="mb-1"
          />
          <b class="text-h5">{{ item.title }}</b>
          <p
            class="text-body-1 text-justify px-5"
            style="font-size: 1.1rem!important"
          >
            {{ item.description }}
          </p>
        </li>
      </ul>
      <v-sheet
        class="mb-5 pa-6"
        color="#f5d082"
        elevation="3"
      >
        <v-img
          src="/assets/icons/nodatasets.png"
          width="100"
        />
        <h2>No datasets, please</h2>
        <b>Datasets</b>
        <p style="font-size: 1.1rem!important">
          FAIRsharing helps researchers find the right database in which to submit their data. However, we do not store data ourselves. If you would like to find a home for your data, try browsing our complete <a
            href="https://fairsharing.org/browse/subject"
            class="underline-effect primary white--text"
            target="_blank"
          >subject hierarchy</a> or searching our <a
            href="https://fairsharing.org/databases"
            class="underline-effect primary white--text"
            target="_blank"
          >database records</a> to find an appropriate database for your data type. Alternatively, you could look at our collection of <a
            href="https://fairsharing.org/GeneralRepositoryComparison"
            class="underline-effect primary white--text"
            target="_blank"
          >Generalist Repositories</a> or browse all <a
            href="https://fairsharing.org/browse/subject?term=Subject%2520Agnostic"
            class="underline-effect primary white--text"
            target="_blank"
          >subject-agnostic records</a>, which may provide you with a location to store data from a wider range of research areas. If you are submitting to a particular journal, you can also search for that journal or its publisher; if they are registered with us, then their <a
            href="https://fairsharing.org/search?fairsharingRegistry=Policy"
            class="underline-effect primary white--text"
            target="_blank"
          >FAIRsharing data policy record(s)</a> may contain a list of recommended databases and/or standards.
        </p>
      </v-sheet>
      <v-sheet
        :class="['mb-5 pa-6',{'mx-25-percent':$vuetify.breakpoint.mdAndUp}]"
        color="ready_color white--text"
        elevation="3"
      >
        <h3 class="text-h4">
          Get Started!
        </h3>
        <p style="font-size:1.2rem">
          If you have not already done so, you may wish to <a
            href="https://fairsharing.gitbook.io/fairsharing/"
            target="_blank"
            class="underline-effect primary white--text"
          >create an account.</a>
        </p>
        <p style="font-size:1.2rem">
          Any questions? Don't hesitate to <a
            href="mailto:contact@fairsharing.org"
            class="primary white--text underline-effect"
          >contact us</a> or to
          <a
            href="https://fairsharing.gitbook.io/fairsharing/"
            class="primary white--text underline-effect"
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
import Icon from "@/components/Icon";
export default {
  name: "New",
  components: {Icon},
  data: () => {
    return {
      newData,
    }
  }
}
</script>
