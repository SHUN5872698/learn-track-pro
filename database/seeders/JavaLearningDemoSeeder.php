<?php

namespace Database\Seeders;

use App\Models\LearningContent;
use App\Models\LearningSession;
use App\Models\Section;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class JavaLearningDemoSeeder extends Seeder
{
    /**
     * プレゼン用ダミーデータ（Java学習内容）を投入
     * IDは自動採番に任せる
     */
    public function run(): void
    {
        // ===========================================================
        // 学習内容: スッキリわかるJava入門
        // ===========================================================
        $learningContent = LearningContent::create([
            'user_id' => 1,
            'technology_id' => 9,  // Java
            'title' => 'スッキリわかるJava入門',
            'description' => 'Javaプログラミング言語を初めて学ぶ人向けの入門書。難しい概念や細かい理論を避け、実際にプログラムを書きながら学べる構成。',
            'total_sections' => 10,
            'completed_sections' => 7,
            'status' => 'in_progress',
            'completed_at' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $learningContentId = $learningContent->id;

        // ===========================================================
        // セクション: 10件（orderをキーにしてIDをマッピング）
        // ===========================================================
        $sectionsData = [
            ['title' => 'プログラムの書き方', 'order' => 1, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-10-08 00:00:00')],
            ['title' => '式と演算子', 'order' => 2, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-10-15 00:00:00')],
            ['title' => '条件分岐と繰り返し', 'order' => 3, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-10-25 00:00:00')],
            ['title' => '配列', 'order' => 4, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-11-05 00:00:00')],
            ['title' => 'メソッド', 'order' => 5, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-11-12 00:00:00')],
            ['title' => '複数クラスを用いた開発', 'order' => 6, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-11-20 00:00:00')],
            ['title' => 'オブジェクト指向の基本', 'order' => 7, 'status' => 'completed', 'completed_at' => Carbon::parse('2025-12-01 00:00:00')],
            ['title' => 'インスタンスとクラス', 'order' => 8, 'status' => 'in_progress', 'completed_at' => null],
            ['title' => 'さまざまなクラス機構', 'order' => 9, 'status' => 'not_started', 'completed_at' => null],
            ['title' => '継承とポリモーフィズム', 'order' => 10, 'status' => 'not_started', 'completed_at' => null],
        ];

        // セクションを作成し、orderをキーにIDをマッピング
        $sectionIdMap = [];
        foreach ($sectionsData as $sectionData) {
            $section = Section::create(array_merge($sectionData, [
                'learning_content_id' => $learningContentId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
            $sectionIdMap[$sectionData['order']] = $section->id;
        }

        // ===========================================================
        // 学習記録: 39件（section_orderで参照）
        // ===========================================================
        $learningSessionsData = [
            // セクション1: プログラムの書き方
            ['section_order' => 1, 'study_minutes' => 90, 'memo' => 'Hello Worldプログラムを作成', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-01T10:00')],
            ['section_order' => 1, 'study_minutes' => 120, 'memo' => 'コンパイルと実行の流れを理解', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-10-02T14:30')],
            ['section_order' => 1, 'study_minutes' => 60, 'memo' => 'エラーメッセージの読み方', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-04T09:00')],
            ['section_order' => 1, 'study_minutes' => 75, 'memo' => '変数と型の基本を確認', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-10-06T16:00')],

            // セクション2: 式と演算子
            ['section_order' => 2, 'study_minutes' => 90, 'memo' => '算術演算子と代入演算子', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-08T10:30')],
            ['section_order' => 2, 'study_minutes' => 120, 'memo' => '比較演算子と論理演算子', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-10-10T14:00')],
            ['section_order' => 2, 'study_minutes' => 60, 'memo' => '型変換の理解', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-12T11:00')],
            ['section_order' => 2, 'study_minutes' => 45, 'memo' => '演算子の優先順位', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-10-14T15:30')],

            // セクション3: 条件分岐と繰り返し
            ['section_order' => 3, 'study_minutes' => 150, 'memo' => 'if文とelse文の基本', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-16T09:30')],
            ['section_order' => 3, 'study_minutes' => 120, 'memo' => 'switch文の使い方', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-10-18T14:00')],
            ['section_order' => 3, 'study_minutes' => 180, 'memo' => 'for文とwhile文', 'mood_rating' => 2, 'studied_at' => Carbon::parse('2025-10-20T10:00')],
            ['section_order' => 3, 'study_minutes' => 90, 'memo' => 'breakとcontinue', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-23T16:00')],
            ['section_order' => 3, 'study_minutes' => 60, 'memo' => '章末問題の復習', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-10-25T11:30')],

            // セクション4: 配列
            ['section_order' => 4, 'study_minutes' => 120, 'memo' => '配列の宣言と初期化', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-10-27T09:00')],
            ['section_order' => 4, 'study_minutes' => 150, 'memo' => '配列の要素へのアクセス', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-10-29T14:30')],
            ['section_order' => 4, 'study_minutes' => 90, 'memo' => '拡張for文の使い方', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-10-31T10:00')],
            ['section_order' => 4, 'study_minutes' => 180, 'memo' => '多次元配列の理解', 'mood_rating' => 2, 'studied_at' => Carbon::parse('2025-11-02T09:30')],
            ['section_order' => 4, 'study_minutes' => 60, 'memo' => '配列の応用問題', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-04T15:00')],

            // セクション5: メソッド
            ['section_order' => 5, 'study_minutes' => 120, 'memo' => 'メソッドの定義と呼び出し', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-05T10:00')],
            ['section_order' => 5, 'study_minutes' => 90, 'memo' => '引数と戻り値', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-11-07T14:00')],
            ['section_order' => 5, 'study_minutes' => 150, 'memo' => 'オーバーロードの概念', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-11-09T09:30')],
            ['section_order' => 5, 'study_minutes' => 60, 'memo' => 'メソッドの分割設計', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-11T16:30')],

            // セクション6: 複数クラスを用いた開発
            ['section_order' => 6, 'study_minutes' => 180, 'memo' => 'クラスの基本構造', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-11-13T10:00')],
            ['section_order' => 6, 'study_minutes' => 120, 'memo' => 'パッケージとインポート', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-15T14:30')],
            ['section_order' => 6, 'study_minutes' => 150, 'memo' => 'アクセス修飾子の理解', 'mood_rating' => 2, 'studied_at' => Carbon::parse('2025-11-17T09:00')],
            ['section_order' => 6, 'study_minutes' => 90, 'memo' => 'クラス設計の実践', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-11-19T15:00')],

            // セクション7: オブジェクト指向の基本
            ['section_order' => 7, 'study_minutes' => 180, 'memo' => 'オブジェクト指向とは何か', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-21T10:00')],
            ['section_order' => 7, 'study_minutes' => 150, 'memo' => 'カプセル化の概念', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-11-24T14:00')],
            ['section_order' => 7, 'study_minutes' => 120, 'memo' => 'getter/setterの実装', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-11-26T09:30')],
            ['section_order' => 7, 'study_minutes' => 90, 'memo' => 'コンストラクタの使い方', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-28T16:00')],
            ['section_order' => 7, 'study_minutes' => 60, 'memo' => 'オブジェクト指向の演習問題', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-11-30T11:00')],

            // セクション8: インスタンスとクラス（進行中）
            ['section_order' => 8, 'study_minutes' => 150, 'memo' => 'staticメンバの理解', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-12-02T10:00')],
            ['section_order' => 8, 'study_minutes' => 120, 'memo' => 'クラス変数とインスタンス変数', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-12-04T14:30')],
            ['section_order' => 8, 'study_minutes' => 90, 'memo' => 'staticメソッドの活用', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-12-06T09:00')],
            ['section_order' => 8, 'study_minutes' => 60, 'memo' => 'シングルトンパターンの紹介', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-12-08T15:00')],
            ['section_order' => 8, 'study_minutes' => 120, 'memo' => 'finalキーワードの使い方', 'mood_rating' => 3, 'studied_at' => Carbon::parse('2025-12-10T10:30')],
            ['section_order' => 8, 'study_minutes' => 75, 'memo' => '章末問題に挑戦中', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-12-12T14:00')],
            ['section_order' => 8, 'study_minutes' => 90, 'memo' => '復習と理解度チェック', 'mood_rating' => 4, 'studied_at' => Carbon::parse('2025-12-14T09:30')],
            ['section_order' => 8, 'study_minutes' => 45, 'memo' => '次のセクションの予習', 'mood_rating' => 5, 'studied_at' => Carbon::parse('2025-12-16T11:00')],
        ];

        foreach ($learningSessionsData as $sessionData) {
            LearningSession::create([
                'user_id' => 1,
                'learning_content_id' => $learningContentId,
                'section_id' => $sectionIdMap[$sessionData['section_order']],
                'study_minutes' => $sessionData['study_minutes'],
                'memo' => $sessionData['memo'],
                'mood_rating' => $sessionData['mood_rating'],
                'session_type' => 'manual',
                'studied_at' => $sessionData['studied_at'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        $this->command->info("JavaLearningDemoSeeder: 学習内容ID={$learningContentId}、セクション10件、学習記録39件を投入しました");
    }
}
