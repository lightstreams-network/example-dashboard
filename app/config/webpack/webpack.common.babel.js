import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const Dotenv = require('dotenv-webpack');

import paths from './paths';
import rules from './rules';


module.exports = {
    entry: paths.entryPath,
    module: {
        rules
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.scss', '.css']
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                minifyURLs: true,
                removeComments: true,
                removeAttributeQuotes: true
            }
        }),
      new Dotenv({
        path: process.env.PWD + '/.env', // load this now instead of the ones in '.env'
      })
    ]
};
