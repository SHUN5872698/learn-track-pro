import { computed } from 'vue';
import { useUser } from '@/composables/useUser';
import { useMenuState } from '@/composables/ui/useMenuState';
import { useLearningContentStore } from '@/stores/learningContent';
import { useSectionStore } from '@/stores/sections';
import { useLearningContents as useLearningContentsComposable } from '@/composables/learning/useLearningContents';
import { useMasterDataStore } from '@/stores/masterData';
import { useLearningSessionStore } from '@/stores/learningSession';

// 学習関連の全データを集約し、操作ロジックを提供するコンポーザブル
export const useLearningData = () => {
  const { user } = useUser();
  const { activeMenuId, setActiveMenu } = useMenuState();
  const contentStore = useLearningContentStore();
  const sectionStore = useSectionStore();
  const sessionStore = useLearningSessionStore();
  const masterDataStore = useMasterDataStore();

  const technologies = computed(() => masterDataStore.technologies);

  // useLearningContentsコンポーザブルから取得したデータとアクション
  const {
    learningContents: learningContentsFromComposable, // NOTE：このスコープ内でlearningContentsを再定義するため別名で受け取る(名前衝突回避)
    learningContentsRaw,
    createContent,
    updateLearningContent,
    deleteContent,
    completeContent,
    reopenContent,
    loading,
    error,
    pagination,
    fetchContents,
  } = useLearningContentsComposable();

  // 学習セッションデータを集計し、総学習時間と最終学習日を各コンテンツに追加（ダッシュボードの統計表示用）
  const learningContents = computed(() => {
    return learningContentsFromComposable.value.map((content) => {
      const contentSessions = sessionStore.sessions.filter((session) => session.learning_content_id === content.id);
      const totalStudyMinutes = contentSessions.reduce((sum, session) => sum + session.study_minutes, 0);
      // 最新のセッションを取得（最終学習日の表示用）
      const latestSession = contentSessions.reduce((latest, current) => {
        return !latest || new Date(current.studied_at) > new Date(latest.studied_at) ? current : latest;
      }, null);

      return {
        ...content,
        totalStudyMinutes,
        latestSessionUpdatedAt: latestSession ? latestSession.studied_at : null,
      };
    });
  });

  // ストアメソッドをそのまま公開すると依存関係が複雑になるため、統一インターフェースとしてラッパー関数を提供
  const deleteLearningContentWrapper = async (contentId) => {
    await contentStore.deleteContent(contentId);
  };

  return {
    user, // 現在ログイン中のユーザー情報
    learningContents, // 学習セッション集計済みの学習内容リスト
    learningContentsRaw, // 集計前の生データ（編集画面などで使用）
    sections: computed(() => sectionStore.sections), // 全学習内容のセクション一覧
    learningSessions: computed(() => sessionStore.sessions), // 全学習記録
    technologies, // 技術マスターデータ
    loading, // API通信中のローディング状態
    error, // APIエラーメッセージ
    pagination, // ページネーション情報
    activeMenuId, // アクティブなメニューID（サイドバー表示制御用）

    // Actions
    fetchContents,
    fetchLearningSessions: sessionStore.fetchLearningSessions,
    createContent,
    updateLearningContent,
    deleteLearningContent: deleteLearningContentWrapper,
    completeContent,
    reopenContent,
    addStudySession: (sessionData) => sessionStore.createLearningSession(sessionData),
    updateStudySession: (id, data) => sessionStore.updateLearningSession(id, data),
    deleteStudySession: (id) => sessionStore.deleteLearningSession(id),
    setActiveMenu,
    // 特定セクションの学習記録数を取得（セクション削除前の確認用）
    getRecordCountForSection: (sectionId) => {
      const sessions = sessionStore.sessions || [];
      return sessions.filter((s) => s.section_id === sectionId).length;
    },
  };
};
