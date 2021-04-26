import log from '@taco-cli/log';

interface Options {}

export default (_context: any, options: Partial<Options> = {}) => {
  log.info("@taco-cli/babel-preset-app's options: ", JSON.stringify(options));

  const presets = [];
  const plugins = [];

  presets.push(
    [
      require('@babel/preset-env'),
      {
        // 根据浏览器targets设置所有polyfill, 确保为第三方包处理好polyfill;
        // 如果确定所有的第三方依赖都处理了polyfill, 可使用 usage;
        useBuiltIns: 'entry',
        corejs: {
          version: 3,
          // 启用proposals阶段的api
          proposals: true,
        },
      },
    ],
    [
      require('@babel/preset-typescript'),
      {
        isTSX: true,
        allExtensions: true, // ?支持所有文件扩展名(例如 .vue)
      },
    ]
  );

  plugins.push(
    [require('@babel/plugin-syntax-dynamic-import')],
    // [
    //   require('@babel/plugin-proposal-decorators'),
    //   {
    //     decoratorsBeforeExport: true,
    //     legacy: false,
    //   },
    // ],
    // [require('@babel/plugin-proposal-class-properties'), { loose: false }],
    [
      require('@babel/plugin-transform-runtime'),
      {
        // 设置为true会导致@babel/preset-env的targets失效, 打包体积增大
        // 如果开发Library, 可以设置为
        // {
        //   version: 3,
        //   proposals: true,
        // }
        // 同时移除@babel/preset-env的options
        corejs: false,
      },
    ]
  );

  return {
    presets,
    plugins,
  };
};
