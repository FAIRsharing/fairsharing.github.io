module.exports = {
    presets: [
        "@vue/cli-plugin-babel/preset",
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "entry",
                "corejs": "3.28.0"
            }
        ]
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
    ]
};
