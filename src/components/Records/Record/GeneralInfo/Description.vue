<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <span class="d-flex align-baseline width-15-percent-flex">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon class="mr-2" size="15" v-bind="props">
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips["description"] }}
      </v-tooltip>
      <b>Description</b>
    </span>

    <!-- this should have been sanitised... -->
    <!-- eslint-disable vue/no-v-html -->
    <p
      :class="{ 'text-end': $vuetify.display.smAndDown }"
      class="ma-0 full-width ml-md-12 ml-8"
      v-html="descriptionHtml"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { mapGetters, mapState } from "vuex";
import { capitalize } from "lodash";

const md = new MarkdownIt({
  html: true, // allow inline HTML in Markdown input (we will sanitize below)
  linkify: true,
  typographer: true,
});

export default {
  name: "Description",
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),

    // raw description string from store (fallback to empty string)
    descriptionRaw() {
      const d = this.getField("description");
      return d == null ? "" : d;
    },

    // capitalise using stringutils capitalize method, then render => sanitize
    descriptionHtml() {
      //VUE-3 upgrade : Commenting the below code in order to display the description as entered in the field
      //BEFORE
      // if your mixin exposes `capitalize`, call it; otherwise remove the call
      // const capitalized =
      //   typeof this.capitalize === "function"
      //     ? capitalize(this.descriptionRaw)
      //     : this.descriptionRaw;
      //
      // const unsafe = md.render(capitalized || "");
      //AFTER
      const unsafe = md.render(this.descriptionRaw || "");
      // Sanitize the generated HTML to avoid XSS.
      return DOMPurify.sanitize(unsafe);
    },
  },

  methods: {
    capitalize,
  },
};
</script>
