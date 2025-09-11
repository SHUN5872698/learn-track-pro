import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/auth/Login.vue';
import Register from './views/auth/Register.vue';
import PasswordReset from './views/auth/PasswordReset.vue';
import Dashboard from './views/Dashboard.vue';
import Reports from './views/Reports.vue';
import StudyProgress from './views/learning/StudyProgress.vue';
import StudySessionForm from './views/learning/StudySessionForm.vue';
import LearningContentCreate from './views/learning/LearningContentCreate.vue';
import LearningContentDetail from './views/learning/LearningContentDetail.vue';
import LearningContentEdit from './views/learning/LearningContentEdit.vue';
import SectionStudyRecords from './views/learning/SectionStudyRecords.vue';
import StudySessionEdit from './views/learning/StudySessionEdit.vue';
import Profile from './views/user/Profile.vue';
import ProfileEdit from './views/user/ProfileEdit.vue';
import NotFound from './views/NotFound.vue';

// アプリケーションのルート定義
const routes = [
  {
    path: '/',
    redirect: '/dashboard', // ルートパスへのアクセスはダッシュボードへリダイレクト
  },
  {
    path: '/login',
    name: 'login',
    component: Login, // ログインページ
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'register',
    component: Register, // 新規登録ページ
    meta: { requiresGuest: true },
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: PasswordReset, // パスワードリセットページ
    meta: { requiresGuest: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard, // ダッシュボードページ
    meta: { requiresAuth: true },
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { requiresAuth: true }, // 学習レポートページ
  },
  {
    path: '/learning/:id/progress',
    name: 'study-progress',
    component: StudyProgress,
    meta: { requiresAuth: true }, // 個別レポートページ
  },
  {
    path: '/learning-contents/:id/record',
    name: 'study-session-form',
    component: StudySessionForm, // 学習記録作成ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/learning-contents/create',
    name: 'learning-content-create',
    component: LearningContentCreate, // 学習内容新規作成ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/learning/:id',
    name: 'learning-detail',
    component: LearningContentDetail, // 学習内容詳細ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/learning/:id/edit',
    name: 'learning-edit',
    component: LearningContentEdit, // 学習内容編集ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/learning/:id/section/:sectionId',
    name: 'section-records',
    component: SectionStudyRecords, // セクション別学習記録一覧ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/learning-contents/:contentId/sessions/:sessionId/edit',
    name: 'study-session-edit',
    component: StudySessionEdit, // 学習記録編集ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile, // プロフィール表示ページ
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/edit',
    name: 'profile-edit',
    component: ProfileEdit, // プロフィール編集ページ
    meta: { requiresAuth: true },
  },
  {
    // Catch-all route for 404 Not Found
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound, // 存在しないパスへのアクセスは404ページへ
  },
];

// ルーターインスタンスの作成
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// ナビゲーションガード: ルート遷移前に認証状態をチェックし、適切なページへリダイレクトする
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // 認証トークンの有無で認証状態を判定

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 認証が必要なページで未認証の場合、ログインページへ
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard'); // ゲストユーザーのみアクセス可能なページで認証済みの場合、ダッシュボードへ
  } else {
    next(); // それ以外の場合はそのまま遷移
  }
});

export default router;
