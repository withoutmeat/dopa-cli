import { Configuration, webpack } from 'webpack';
import { merge as webpackMerge } from 'webpack-merge';
import { baseWebpackConfig } from './base';
import { findAvailabePort, generateWebpackDevServer, supportStyle } from './parts';

/** webpack开发环境初始配置 */
const initialDevlopmentWebpackConfig: Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
};

/** webpack开发环境最终配置 */
const finalDevlopmentWebpackConfig = webpackMerge(baseWebpackConfig, initialDevlopmentWebpackConfig, supportStyle());

/** 寻找有效端口，开启开发服务 */
export function startServer(rawHost: string, rawPort: number) {
  findAvailabePort({
    port: rawPort,
  })
    .then((port) => {
      generateWebpackDevServer(webpack(finalDevlopmentWebpackConfig)).listen(port, rawHost, (err: Error | null) => {
        if (err) {
          console.error(err.message);
          process.exit(1);
        }
      });
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
