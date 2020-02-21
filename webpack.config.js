// webpack.config.js
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules|bower_components)/
            },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    "vue-style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true // optional
                            },
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],

};