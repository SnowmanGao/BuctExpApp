import { createApp } from 'vue';
import App from './App.vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration'
import './assets/index.css';

export const VERSION = '1.1.2';
export const BUILD_TIME = '2025-06-28';

dayjs.locale('zh-cn');
dayjs.extend(localizedFormat);
dayjs.extend(duration);

createApp(App).mount('#app');
