import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true; // CORSリクエストでクッキーを送信
window.axios.defaults.withXSRFToken = true; // CSRFトークンをリクエストヘッダーに自動で含める

// すべてのAxiosリクエストにデフォルトで `Accept: application/json` ヘッダーを付与
window.axios.defaults.headers.common['Accept'] = 'application/json';
