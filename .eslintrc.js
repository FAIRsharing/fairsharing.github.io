module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:vue/base",
    "plugin:vuetify/base",
    "prettier",
  ],
  rules: {
    "no-console": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.VITE_NODE_ENV === "production" ? "error" : "off",
    "vue/multi-word-component-names": "off",
    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "key",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          ["provide", "inject"],
          "ROUTER_GUARDS",
          "layout",
          "middleware",
          "validate",
          "scrollToTop",
          "transition",
          "loading",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "emits",
          "setup",
          "asyncData",
          "data",
          "beforeRouteEnter",
          "fetch",
          "head",
          "computed",
          "watch",
          "watchQuery",
          "LIFECYCLE_HOOKS",
          "methods",
          ["template", "render"],
          "renderError",
        ],
      },
    ],
    "brace-style": [
      "error",
      "stroustrup",
      {
        allowSingleLine: true,
      },
    ],
    indent: ["error", 2],
    "space-in-parens": ["error", "never"],
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    // parser: '@babel/eslint-parser',
    // babelOptions: {
    //   parserOpts: {
    //     plugins: ["jsx"]
    //   }
    // }
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        // jest: true
        // vitest: true,
      },
    },
  ],
};
