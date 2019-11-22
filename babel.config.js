module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
        "@babel/env",
        {"modules": false }
    ]
  ],
  sourceType: "unambiguous",
  "env": {
    "test": {
      "plugins": ["istanbul"]
    }
  }
}
