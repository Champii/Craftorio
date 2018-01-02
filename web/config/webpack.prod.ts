/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-implicit-dependencies */

import * as path from 'path';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import * as common from './webpack.common';

module.exports = merge(common, {
  plugins: [
    new UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': 'production',
    }),
  ],
});
