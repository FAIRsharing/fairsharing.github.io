module.exports = {
    presets: [
        "@vue/cli-plugin-babel/preset",
        {
            "useBuiltIns": "entry",
        },
        "@babel/preset-env"
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
    ]
};
