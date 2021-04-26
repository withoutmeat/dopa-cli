/* eslint-disable no-console */
import { createApp } from 'vue';
import App from './App.vue';

// if (__DEV__ && __ACCESS_TOKEN__) {
//   document.cookie = `ACCESS-TOKEN=${__ACCESS_TOKEN__}`;
// }

const app = createApp(App);

app.config.errorHandler = (error, vm, info) => {
  // 将错误日志上报给服务器
  console.error('出错的组件:', vm);

  // logErrorToMyService(error, errorInfo)
  console.error('报告错误😭: ', error, info);
};

app.mount('#app');
