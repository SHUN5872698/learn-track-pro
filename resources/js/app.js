import '@/bootstrap';
import { createApp } from 'vue';
import '../css/app.css';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import { useMasterDataStore } from '@/stores/masterData';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// マスターデータを初期化してからアプリをマウント
const masterDataStore = useMasterDataStore();
masterDataStore
  .initializeMasterData()
  .then(() => {
    console.log('マスターデータ初期化完了');
    app.mount('#app');
  })
  .catch((error) => {
    console.error('マスターデータ初期化エラー:', error);
    // エラーがあってもアプリはマウント（ユーザーに何か表示する）
    app.mount('#app');
  });
