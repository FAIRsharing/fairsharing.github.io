<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <span class="d-flex align-baseline width-15-percent-flex">
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon class="mr-2" size="15" v-on="on"> fa-question-circle </v-icon>
        </template>
        {{ recordTooltips.description }}
      </v-tooltip>
      <b>Description</b>
    </span>

    <!-- use v-html to inject sanitized HTML -->
    <p
      class="ma-0 full-width ml-md-12 ml-8"
      :class="{ 'text-end': $vuetify.breakpoint.smAndDown }"
      v-html="descriptionHtml"
    />
  </div>
</template>

<script>
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { mapGetters, mapState } from "vuex";

import stringUtils from "@/utils/stringUtils";

const md = new MarkdownIt({
  html: true, // allow inline HTML in Markdown input (we will sanitize below)
  linkify: true,
  typographer: true,
});

export default {
  name: "Description",
  mixins: [stringUtils],
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
      // if your mixin exposes `capitalize`, call it; otherwise remove the call
      const capitalized =
        typeof this.capitalize === "function"
          ? this.capitalize(this.descriptionRaw)
          : this.descriptionRaw;

      const unsafe = md.render(capitalized || "");
      // Sanitize the generated HTML to avoid XSS.
      return DOMPurify.sanitize(unsafe, {
        // ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      });
    },
  },
};
</script>
