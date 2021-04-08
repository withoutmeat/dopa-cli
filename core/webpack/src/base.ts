import { Configuration } from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';

import {
  generateEntries,
  generateMultiPages,
  resolveExtensions,
  resolveAlias,
  supportVueFile,
  supportTypescriptFile,
  supportDotEnv,
  defineDevAndProd,
  enableProgressBar,
  supportImage,
  supportFont,
} from './parts';

/** webpack基础配置初始状态 */
const initialConfig: Configuration = {
  target: 'web', // fix: hmr不生效(2020-11-05)
  cache: {
    type: "filesystem"
  }
};

/** webpack基础配置 */
export const baseWebpackConfig = webpackMerge(
  initialConfig,
  generateEntries(),
  generateMultiPages(),
  resolveExtensions(),
  resolveAlias(),
  supportTypescriptFile(),
  supportVueFile(),
  supportImage(),
  supportFont(),
  supportDotEnv(),
  defineDevAndProd(),
  enableProgressBar()
);

export default baseWebpackConfig;
