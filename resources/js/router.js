import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import PasswordReset from '@/views/auth/PasswordReset.vue';
import PasswordConfirm from '@/views/auth/PasswordResetConfirm.vue';
import Dashboard from '@/views/Dashboard.vue';
import Reports from '@/views/Reports.vue';
import StudyProgress from '@/views/learning/StudyProgress.vue';
import StudySessionCreate from '@/views/learning/StudySessionCreate.vue';
import LearningContentCreate from '@/views/learning/LearningContentCreate.vue';
import LearningContentDetail from '@/views/learning/LearningContentDetail.vue';
import LearningContentEdit from '@/views/learning/LearningContentEdit.vue';
import SectionStudyRecords from '@/views/learning/SectionStudyRecords.vue';
import StudySessionEdit from '@/views/learning/StudySessionEdit.vue';
import Profile from '@/views/user/Profile.vue';
import ProfileEdit from '@/views/user/ProfileEdit.vue';
import NotFound from '@/views/NotFound.vue';

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
    path: '/reset-password/:token',
    name: 'password-reset-confirm',
    component: PasswordConfirm, // パスワードリセット実行ページ
    meta: { requiresGuest: true, layout: 'auth' },
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
    component: StudySessionCreate, // 学習記録作成ページ
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

// ナビゲーションガード
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // 初回アクセス時に認証状態を確認
  if (!authStore.authUser && localStorage.getItem('isLoggedIn') === 'true') {
    await authStore.fetchUser();
  }

  const isAuthenticated = authStore.isLoggedIn;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (requiresGuest && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
