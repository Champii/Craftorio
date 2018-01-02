/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-implicit-dependencies */

import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

import { AppConfig } from '../app.config';

module.exports = {
  entry: [
    './app/index.ts',
  ],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
        ],
        exclude: path.resolve(__dirname, '../node_modules'),
        include: [path.resolve(__dirname, '../app')],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
      /**
       * File loader for supporting images, for example, in CSS files.
       */
      {
        test: /\.(jpg|png|gif)$/,
        use: 'file-loader',
      },

      /* File loader for supporting fonts, for example, in CSS files.
      */
      {
        test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
        use: 'file-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin([path.resolve('dist')]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: './index.html',
      chunksSortMode: 'dependency',
      title: AppConfig.APP_NAME,
    }),
    /**
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../assets'),
      to: path.resolve(__dirname, '../dist/assets'),
    }]),
  ],
};
