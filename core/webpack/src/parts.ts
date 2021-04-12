import path from 'path';
import glob from 'glob';

import dotenv from 'dotenv';
import portfinder, { PortFinderOptions } from 'portfinder';
import webpack, { Configuration, Compiler } from 'webpack';

// @ts-expect-error
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import ImageminPlugin from 'imagemin-webpack-plugin';
// @ts-expect-error
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import PurgeCSSPlugin from 'purgecss-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import WebpackBarPlugin from 'webpackbar';
// @ts-expect-error
import WebpackDevServer from 'webpack-dev-server';

import { cwd, resolveApp } from './utils';

/**
 * 支持多入口
 * @todo 支持自定义配置
 */
export function generateEntries(): Configuration {
  return {
    entry: {
      app: path.join(cwd, 'src/index.ts'),
    },
  };
}

/**
 * 支持多页面
 * @todo 接受自定义配置
 */
export function generateMultiPages(): Configuration {
  return {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'generate by webpack',
        filename: 'index.html',
        template: path.join(cwd, 'public/index.html'),
        chunks: ['app'],
      }),
    ],
  };
}

export function resolveExtensions(): Configuration {
  return {
    resolve: {
      extensions: ['.ts', '.tsx', '.vue', '.js', '.json', '.jsx', '.css'],
    },
  };
}

export function resolveAlias(): Configuration {
  return {
    resolve: {
      alias: {
        '@': path.join(cwd, './src'),
        vue: '@vue/runtime-dom',
      },
    },
  };
}

export function supportVueFile(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: {
            loader: 'vue-loader',
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
    ],
  };
}

/**
 * 支持vuejsx热更新
 * @deprecated
 */
export function supportVueJsx(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.tsx$/,
          use: [
            'babel-loader',
            {
              loader: '@ant-design-vue/vue-jsx-hot-loader',
            },
          ],
        },
      ],
    },
  };
}

export function supportTypescriptFile(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
  };
}

/**
 * 开启打包进度
 * @param profile 打包完成后输出分析图标
 */
export function enableProgressBar(profile = false) {
  return {
    plugins: [
      new WebpackBarPlugin({
        name: 'webpack',
        profile,
      }),
    ],
  };
}

/** 递增寻找有效端口: 3000-? */
export function findAvailabePort(options: PortFinderOptions = { port: 3000, startPort: 3000 }) {
  return portfinder.getPortPromise(options);
}

/**
 * 创建WebpackDevServer实例
 * @param compiler webpack编译模块
 * @param options WebpackDevServer配置
 */
export function generateWebpackDevServer(
  compiler: Compiler,
  options = {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    publicPath: '/',
    hot: true,
    stats: 'errors-only',
    compress: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        pathRewrite: {
          '^/api': '',
        },
        secure: false,
        changeOrigin: true,
      },
    },
  }
) {
  return new WebpackDevServer(compiler, options);
}

/** 支持.env环境变量 */
export function supportDotEnv(): Configuration {
  const dotenvConfig = dotenv.config();
  if (dotenvConfig.parsed == void 0) return {};
  // 把环境转换为 `webpack.DefinePlugin` 需要的形式
  Object.keys(dotenvConfig.parsed).forEach((key) => {
    dotenvConfig.parsed![`__${key}__`] = JSON.stringify(dotenvConfig.parsed![key]);
    delete dotenvConfig.parsed![key];
  });

  return {
    plugins: [new webpack.DefinePlugin(dotenvConfig.parsed)],
  };
}

/** 将 \_\_DEV__ 和 \_\_PROD__ 注入环境  */
export function defineDevAndProd(isProd = false): Configuration {
  return {
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: !isProd,
        __PROD__: isProd,
      }),
    ],
  };
}

/**
 * 支持css
 * @param isProd 是否为生产环境
 */
export function supportStyle(isProd = false): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.(post)?css$/,
          sideEffects: true,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                esModule: isProd,
                importLoaders: 1,
                sourceMap: isProd,
                modules: {
                  auto: true,
                  localIdentName: '[name]_[local]_[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !isProd,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      isProd &&
        new MiniCssExtractPlugin({
          filename: 'styles/[name].[contenthash:5].css',
        }),
    ].filter(Boolean),
  };
}

export function supportFont(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
        },
      ],
    },
  };
}

export function supportImage(): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            },
          },
        },
      ],
    },
  };
}

export function minimizeCss(): Configuration {
  return {
    optimization: {
      minimize: true,
      minimizer: [
        // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
  };
}

// 不支持webpack5
export function minimizeImage(): Configuration {
  return {
    // plugins: [new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i })],
  };
}

/**
 * 移除未使用css
 * @returns
 */
export function pugrecss(): Configuration {
  return {
    plugins: [
      new PurgeCSSPlugin({
        paths: glob.sync(`${resolveApp('./src')}/**/*`, { nodir: true }),
        safelist: ['html', 'body'],
      }),
    ],
  };
}
