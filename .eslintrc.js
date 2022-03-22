module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  "extends": [
    "plugin:vue/recommended",
    "eslint:recommended"
  ],
  rules: {
    'no-console': process.env.NODE_ENV === "production" ? "error" : "off",
    'no-debugger': process.env.NODE_ENV === "production" ? "error" : "off",
    'vue/multi-word-component-names': "off",
    "vue/order-in-components": ["error", {
	"order": [
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
      	"fetch",
      	"head",
      	"computed",
      	"watch",
      	"watchQuery",
      	"LIFECYCLE_HOOKS",
    	"methods",
      	["template", "render"],
      	"renderError"
    ]
    }
  ]
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
