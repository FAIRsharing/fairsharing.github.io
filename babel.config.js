module.exports = {
    presets: [
        "@vue/cli-plugin-babel/preset",
        {
            targets: {
                esmodules: true
            },
            polyfills: []
        },
        "@babel/preset-env"
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
    ]
};
