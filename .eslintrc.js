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
    'vue/multi-word-component-names': ['error', {
        'ignores': ['default']
    }]
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
