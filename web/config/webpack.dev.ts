/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-implicit-dependencies */

import * as path from 'path';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as common from './webpack.common';

import { AppConfig } from '../app.config';

module.exports = merge(common, {
  devtool: 'eval',

  devServer: {
    hot: false,
    port: AppConfig.PORT,
    // proxy: {
    //   '/': 'ws://:' + AppConfig.PROXY + '/ws',
    // },
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
});
