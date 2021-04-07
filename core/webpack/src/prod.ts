import path from 'path';
import { Configuration, webpack } from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import { baseWebpackConfig } from './base';
import { minimizeCss, pugrecss, supportStyle } from './parts';
import { cwd } from './utils';

/** webpack生产环境初始配置 */
const initialProdlopmentWebpackConfig: Configuration = {
  mode: 'production',
  devtool: 'hidden-source-map',
  output: {
    path: path.join(cwd, 'dist'),
    publicPath: '/',
    filename: 'scripts/[name].[contenthash:5].js',
    assetModuleFilename: '',
    clean: true,
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
};

/** webpack生产环境最终配置 */
const finalProdlopmentWebpackConfig = webpackMerge(
  baseWebpackConfig,
  initialProdlopmentWebpackConfig,
  supportStyle(true),
  minimizeCss(),
  pugrecss()
);

export function startBuild() {
  webpack(finalProdlopmentWebpackConfig).run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    if (stats == undefined) return;

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    console.log(
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true, // Shows colors in the console
      })
    );
  });
}
