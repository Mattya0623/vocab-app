# 日本語フラッシュカードアプリ

_Started 2026-05-26 16:56 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Vocab"
Project is currently empty (no files)
Current date is now May 27, 2026
</system-info>

<default aesthetic>
If no references, art direction or design systems were provided, use this default professional modern, minimal aesthetic as a base. Declare your choice out loud so you stick to it. Guidance:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic>

<pasted_text name="Pasted text (73 lines)">
想定している技術スタック（必要に応じて書き換えてください）:
- Frontend: React / Next.js (TypeScript), Tailwind CSS
- Backend/Database: Firebase (Authentication, Firestore)
- Hosting: Vercel or Firebase Hosting
- Target Devices: レスポンシブ対応（スマホ、MacBook、iPad）

---

【開発タスク：単語学習Webアプリケーション（ベータ版）の実装】

単語を覚えるのが苦手な人向けの、オンライン単語帳Webアプリ（レスポンシブ対応）のMVP（最小限の検証可能製品）を構築してください。
以下の詳細要件に基づき、UI/UXのデザイン、データ構造の設計、および機能の実装をお願いします。

### 1. 認証とデータ紐付け
- Google Accountによるログイン機能（Firebase Auth等を想定）。
- ユーザー名、パスワード（Google連携）、およびインポートされた単語データは、ログインしたGoogleアカウント（ユーザー固有のID）に完全に紐付けて保存すること。
- 他のユーザーとデータが混ざらないよう、セキュリティルールを徹底すること。

### 2. データ構造（単語データ）
各単語は以下のメタデータを持つ必要があります。
- `id`: ユニーク識別子
- `word`: 覚えたい単語（例: apple）
- `meaning`: 単語の意味（例: りんご）
- `attempts`: 試行回数（総回答数）
- `correct_answers`: 正解回数
- `accuracy`: 正確度（%単位。計算式：correct_answers / attempts * 100。初期値は0%だが、attemptsが0の時の扱いを考慮すること）

### 3. 単語の追加・削除機能（CSV/テキストインポート）
- ユーザーが「単語,意味」のように、カンマ（または改行・タブなど）で区切られたテキストをコピペ、あるいはファイルインポートして一括登録できる機能。
- 単語を個別に、あるいは一括で削除できる機能。

### 4. ボックス（システム（ライトナーシステム風））
単語の「正確度（accuracy）」に応じて、自動的に7つのボックスに振り分けるロジックを実装してください。
- ボックス1: 正確度 0% 〜 25%
- ボックス2: 正確度 26% 〜 40%
- ボックス3: 正確度 40% 〜 55%
- ボックス4: 正確度 55% 〜 75%
- ボックス5: 正確度 76% 〜 90%
- ボックス6: 正確度 91% 〜 95%
- ボックス7: 正確度 96% 〜 100%
※単語の正確度が変動するたび、リアルタイムに対応するボックスへ自動移動させてください。

### 5. フラッシュカードのコアロジック（4択クイズ）
- 画面に「覚えたい単語」が1つ提示されます。
- その下に、4つの選択肢（ボタン）を表示します。
  - 1つは「正しい意味」
  - 残り3つは「他の単語データからランダムに抽出したダミーの意味」（単語数が4つ未満の場合のフォールバック処理も考慮すること）
- ユーザーが選択肢をクリックした際、即座に正解/不正解を判定。
- 【データ更新】結果に応じて、その単語の `attempts` を +1 し、正解なら `correct_answers` も +1。これに伴い `accuracy` を再計算して保存。

### 6. 画面構成（ページ遷移・ナビゲーション）
スマホ・タブレット・PCで快適に動くレスポンシブなUIで、以下のページを実装してください。

- **A. メインページ（全単語モード）**
  - 全ての登録単語の中から、正確度に関わらず「ランダムに1件」が選ばれ、4択のフラッシュカードとして表示される。
- **B. ボックス毎のページ（絞り込みモード）**
  - ボックス1〜4を選択するメニュー。
  - 選択されたボックスの正確度範囲内にある単語だけを分母とし、その中からランダムに1件ずつ4択フラッシュカードを出題する。
- **C. 統計 ＆ レベリングページ**
  - **統計データ:**
    - アカウント全体の累計解答回数（全単語のattemptsの総和）
    - 全体の平均正確度
    - 各ボックス（1〜4）ごとの累計回答数および平均正確度
    - 最高連続正解数（現在のセッション、または通算でのストリーク数）
  - **レベリングシステム:**
    - ユーザー自身の「レベル」を表示。
    - 経験値（XP）は「累計解答回数」とする。
    - レベルアップに必要な回答数は、一定レベルに達するまで「指数関数的」に増加する設計にすること（例: 必要XP = $10 \times (\text{現在のレベル})^2$ など、適切なバランスの数式をコード内にコメント付きで実装してください）。

### 7. 将来の拡張性
- 今後、新しい機能（タイマー機能、音声読み上げ、忘却曲線に基づいた通知など）を追加しやすいよう、コンポーネントは疎結合にし、状態管理（State Management）をクリーンに設計してください。

まずは、データモデルの設計と、全体の画面遷移（ルーティング）のモックアップから構築を開始してください。準備ができたらステップバイステップで実装を進めましょう。
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Wireframe">
Help the user explore design ideas quickly. Interview them, then generate multiple rough wireframes to map out the design space before committing to a direction. Prioritize breadth over polish: show 3-5 distinctly different approaches for each idea. Use simple shapes, placeholder text, and minimal color to keep the focus on structure and flow. Use a sketchy vibe -- handwritten but readable fonts; b&w with some color; low-fi and simple. Provide simple tweaks; show options side-by-side if small or using a tab control if large.
</attached-skill>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- language: 日本語
- scope: ログイン / 認証, メイン (全単語モード) フラッシュカード, ボックス選択 + ボックス別出題, 単語一覧 / 削除管理, 単語インポート (CSV/テキスト), 結果フィードバック (正解/不正解の瞬間), 統計 & レベリング, 空状態 (単語が0件)
- device: デスクトップ / ノートPC, モバイル (縦), タブレット
- style: 2
- leitner_viz: 7枚のカード積み (本棚風)
- card_interaction: タップして選ぶ (基本)
- stats_emphasis: レベル & XP バー
- level_metaphor: RPG / ゲーム的 (バッジ・ランク)
- nav_pattern: 両方 (レスポンシブで切替)
- tweaks: デバイス (mobile/desktop)
- deliver: 両方

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: write_file]_

Plan locked. Style commitment:
- **Hand-drawn lo-fi**: Kalam (body) + Caveat (accents), warm cream paper #fdfaf0, ink #1a1a1a, dashed/wobbly strokes, one orange accent #d97a3c
- **System**: SketchBox, SketchBtn, SketchInput, WobbleHR, SketchProgress, ScribbleBadge primitives, then composed screens
- **Deliverables**: `Wireframes.html` (canvas of all screens × variations) + `Prototype.html` (clickable, device-tweakable)

Let me write the shared CSS and primitives.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: show_to_user]_

_[tool: get_webview_logs]_

_[tool: write_file]_

Now the navigable prototype with device tweak.

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

2つのファイルを用意しました：

- **`Wireframes.html`** — 全画面 × バリエーションを一覧できる手書き風のデザインキャンバス（ピンチ/ドラッグで自由に閲覧、各アートボードはフォーカス可）
- **`Prototype.html`** — クリックで遷移する動くプロトタイプ。右下の **Tweaks** で <kbd>📱 モバイル ↔ 💻 デスクトップ</kbd> を即切替、各画面のバリエーション(A/B/C) もパネルから切替できます

含めた画面（全て 日本語UI · 手書き風 · 本棚メタファー · RPGレベリング）：
1. **エントリー** — Googleログイン / 空状態
2. **メインフラッシュカード** 3案（メタ強調 / ミニマル / 詳細パネル）+ デスクトップ版
3. **結果フィードバック** — 正解(+1XP) / 不正解(答え開示)
4. **ボックス (7段ライトナー)** 3案（縦積み / 本棚 / 引き出し）+ デスクトップ + Box絞り込み出題
5. **単語管理** 2案（チェックリスト / カードグリッド）+ デスクトップテーブル
6. **インポート** 2案（ペースト+プレビュー / テーブル直接編集）+ デスクトップ
7. **統計 & レベル** 2案（RPGヒーローカード / データ重視）+ デスクトップダッシュボード
8. **設計メモ** — データモデル / Box振り分け / XPカーブ (10×Lv²) / 状態管理方針

次のステップの候補：方向性が決まったら、いずれかの案に絞ってhi-fiモック（実色・実フォント・実コンポーネント）に発展、もしくはNext.js + Firebase での実装スケルトンに移れます。

## User

デザインは、もっとかっこいい形にしてください。
背景は小さい星座がちらほらある感じで、ネオン風の見た目が好ましいです。

## Assistant

_[tool: update_todos]_

了解しました。星座×ネオンの方向で、別バージョンとして組み直します（既存のワイヤーフレームは残します）。

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now the v2 prototype.

_[tool: write_file]_

_[tool: done]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

Nebulae looks gorgeous. Let me fix the Polaris label getting clipped on the right edge.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: done]_

_[tool: fork_verifier_agent]_

ネオン × 星座で組み直しました。

**`Prototype.html`** が新ビジュアルに更新済みです（旧スケッチ版より大幅にかっこよく）：

- **暗い宇宙背景** — 小さな星々がきらめき、薄い線で星座を結ぶ
- **ネオングロー** — シアン/マゼンタ/アンバーの三色を使い分け、要素ごとに発光
- **タイポ** — Orbitron (英) × Zen Kaku Gothic (日) × JetBrains Mono (テック)
- **ライトナーの再解釈** — 7つのボックスを「**7つの星雲 (NEBULAE)**」に: NYX → LYRA → ORION → VEGA → ANDROMEDA → SIRIUS → POLARIS。銀河の腕に沿ってマッピングされ、習熟するほど星が外側で輝きます
- **アニメーション** — 星のtwinkle、スキャンラインの走査、パルスリング

各画面（モバイル＆デスクトップ両対応）：
① LOGIN ② PLAY (フラッシュカード) ③ RESULT 正解/不正解 ④ NEBULAE 星図 + 星雲別出題 ⑤ CODEX 単語管理 ⑥ IMPORT ⑦ PROFILE (XP・バッジ・レベルカーブ) ⓪ NO SIGNAL (空状態)

Tweaks で `デバイス` `画面ヒント` `背景の星座` `画面ジャンプ` `Nebula選択` を切替可能。

旧スケッチ版は **`Wireframes.html`** に残してあります（構造マップが必要になったとき用）。

## User

７つの星は、Vega、Altair、Sirius、Betelgeuse、Rigel、Polaris、Antaresでお願いします。
プロフィールの方はよくできています。


Codexの方もよくできて居ます。しかし、Codexに正解率で順番を変える機能がほしいです。（例えば、正答率が低い順など）
Nebulaeでは改善が必要です。ユーザーが特定のボックス（星）に移動した際には、一回の回答で、メインページに飛ばすのではなく、ユーザー自身がメインページに移動するボタンを押さない限り、持続的にその特定のボックス（星）の単語を出題してください。

また、設定ページも作成し、単語をリバース（現在、英語->日本語ですが、これを有効にすると、逆となり、日本語->英語となります。）する機能を搭載し、このアプリケーション全体の言語を変更するボタンも作成してください。対象言語は、英語、日本語、中国語、韓国語でお願いします

## Assistant

_[tool: update_todos]_

了解しました。一気に対応します：

1. 7つの星名を Vega/Altair/Sirius/Betelgeuse/Rigel/Polaris/Antares に
2. Codex に並び替え（正答率順など）
3. Nebula 別出題を持続セッション化（戻るボタンで終了）
4. 設定ページ追加：リバースモード + 4言語切替（en / ja / zh / ko）

_[tool: write_file]_

_[tool: str_replace_edit]_

Now apply the updates across files. Start with new star names + descriptions in `neon-screens.jsx`:

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Make several edits to neon-screens.jsx for sticky session, reverse mode, sort, and add Settings.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Update `neon-ui.jsx` side nav + tab bar with i18n and Settings entry.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: done]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

The page renders. Let me also quickly verify the nebulae + settings flows work.

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

4点まとめて反映しました：

**① 7つの星名**を実在のものに変更（N1→N7）：
**Vega → Altair → Sirius → Betelgeuse → Rigel → Polaris → Antares**
（色は習熟度を表す赤→金のグラデーションを維持）

**② Codex に並び替え**追加：
チップで `既定 / 正答率↑ / 正答率↓ / 試行↓ / A→Z` を切替できます。モバイル・デスクトップ両対応。

**③ Nebula 別の持続セッション**化：
星をクリック → そのネビュラ専用クイズが起動 → 解答 → 結果 → **NEXT** で**同じネビュラ内で次の単語が続く**（メインには戻らない）。明示的に **EXIT** ボタンを押した時だけマップ／メインに戻ります。デスクトップでは星雲固有色のオーバーレイモーダルとして表示され、サイドナビとの位置関係も保ちます。

**④ 設定ページ追加** — サイドナビの **SETTINGS**（または右上の歯車）からアクセス：
- **リバースモード** — EN→JA ⇄ JA→EN を即時切替（Play/Box Quiz 両方で適用）
- **アプリ全体の言語** — `日本語 / English / 中文 / 한국어` の 4 言語切替。サイドナビ、画面タイトル、ボタンラベル、設定ページ全体に即反映
- **アカウント** — ログアウト + 全データ削除（モック）

i18n の対象範囲：nav・主要ボタン・カラムヘッダ・設定ページは完全に翻訳済み。単語データ（apple/りんご 等）はそのまま維持される設計です。

## User

プロフィールの見た目はいいですが、横長くて、合計正答率や、単語数などが見切れているため、きちんと枠内に入るサイズ間にしてください。
また、レベルシステムに関してですが、5レベルごとに、自分のプロフィールに表示されるレベルの色を変化させ、25レベルが上がるごとに、美しいエフェクトがレベルを表示するところに表示されるようにしてください

## Assistant

_[tool: screenshot_user_view]_

_[tool: str_replace_edit]_

I see the bar chart overflowing and the right KPI tiles getting clipped. Plus, let me add the level color/ascension system you asked for.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: sleep]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: done]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: save_screenshot]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: eval_js_user_view]_

_[tool: screenshot_user_view]_

_[tool: str_replace_edit]_

The avatar in side nav still shows old level because it reads from `window.__currentLevel` synchronously. Let me wire it through Context for consistent reactivity.

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: eval_js_user_view]_

_[tool: update_todos]_

_[tool: update_todos]_

_[tool: done]_

対応完了です：

**プロフィールのレイアウト修正：**
- KPI タイル（累計解答 / 平均正答率 / MAX STREAK / 登録単語）のフォント縮小＋overflow制御で枠内に収まるように
- Nebulae 棒グラフは星名を **VEG / ALT / SIR / BET / RIG / POL / ANT** の 3 文字略号に変更し、7 本全てが枠内に収まるよう列幅と高さも再調整
- 各カードに `minWidth: 0` を設定し、グリッドからのはみ出しを防止

**レベルカラーシステム（5レベルごとに変化）：**
6 段階のティアで循環します（**SPECTRA / NOVA / PULSAR / QUASAR / STELLAR / NEBULA**）
- LV 1–5 → シアン
- LV 6–10 → マゼンタ（現在の見た目）
- LV 11–15 → バイオレット
- LV 16–20 → ライム
- LV 21–25 → アンバー
- LV 26–30 → レッド … 以降ループ

**昇格エフェクト（25レベルごと）：**
LV 25, 50, 75, 100… で **ASCENSION 効果** が発動します：
- 周囲を回転するレインボーのコニックグラデーション ハロー
- アバター中央のリングが回転する虹色光
- 6+本のスパークル（白い星）が放射状に瞬き
- アバター右下に **★N** バッジ
- 段数（25, 50, 75）が増えるごとにスパークル数も増加

**確認方法：**
Tweaks パネルの **学習 / Study → Level (preview)** スライダーで 1〜100 まで動かすと、レベル数字・カラー・ティア名・昇格エフェクトがリアルタイムで切り替わります。LV 25 でハロー＋スパークルが現れ、サイドナビ左下のアバターも同期して光ります。

## User

<system-info comment="Only acknowledge these if relevant">
User adjusted these values via the in-page Tweaks panel (already saved to disk):
Prototype.html:
  level: 25
  lang: "ja"
</system-info>

<pasted_text name="Pasted text (100 lines)">
アセンションとはいいシステムですね！！

そうしたら、次に、マップを作成してください
マップの中にはステージが８つあり、もしマップ一のステージ八まで到達することができたら、マップ２が解放され、ロックが外れアクセスできるようになります。
ステージを開放するためには、ユーザーのレベルを上げることが必要です。
（初期状態なので、１ステージ開放に5レベルが必要）。（例：マップ１のステージ６開放には、40レベルが必要）

マップ1：太陽系エリア
ステージ1： 地球（基本チュートリアル・戦闘）
ステージ2： 月（低重力アクション）
ステージ3： 水星（灼熱タイムアタック）
ステージ4： 金星（酸性雨サバイバル）
ステージ5： 火星（廃墟探索・中ボス戦）
ステージ6： アステロイドベルト（岩石回避パズル）
ステージ7： 木星（超重力バトル）
ステージ8： 海王星（極寒ボス戦・太陽系脱出）
マップ2：太陽系外縁・衛星エリア
ステージ1： 冥王星（氷上スライドパズル）
ステージ2： 衛星イオ（火山弾アスレチック）
ステージ3： 衛星エウロパ（水中深海探索）
ステージ4： 衛星タイタン（メタンの海・ボート戦）
ステージ5： ケレス鉱山（資源大量ボーナスステージ）
ステージ6： エリス（暗闇ステルスミッション）
ステージ7： ボイジャー1号（古代データ回収パズル）
ステージ8： オールトの雲（彗星群ディフェンス戦）
マップ3：ミルキー銀河・オリオン腕
ステージ1： シリウス星系（高速ドッグファイト）
ステージ2： プロキオン（二連星ギミックバトル）
ステージ3： プレアデス星団（星屑コレクト任務）
ステージ4： オリオン大星雲（濃霧迷宮探索）
ステージ5： ベテルギウス（崩壊プラットフォーム）
ステージ6： リゲル（高エネルギー回避）
ステージ7： カニ星雲（パルサー周期ビーム）
ステージ8： はくちょう座X-1（ブラックホール吸引ボス戦）
マップ4：ミルキー銀河・ペルセウス腕
ステージ1： ケプラー22b（海洋惑星アスレチック）
ステージ2： TRAPPIST-1（7連惑星ラッシュバトル）
ステージ3： タビ―の星（巨大建造物パズル）
ステージ4： プロトディスク（原始塵の嵐サバイバル）
ステージ5： フォマルハウトb（ゴーストエネミー戦）
ステージ6： 浮遊惑星ローグ（無電源極寒サバイバル）
ステージ7： 中性子パルサー（電磁波パズルリレー）
ステージ8： 超新星残骸網（エネルギーストーム戦）
マップ5：ミルキー銀河・中心バルジ
ステージ1： 球状星団入り口（超密集弾幕バトル）
ステージ2： 高重力ハイウェイ（超高速レース）
ステージ3： 恒星メトシェラ（古代トラップ迷宮）
ステージ4： マイクロクエーサー（縦一閃ジェット回避）
ステージ5： プラズマの海（スリップダメージ耐性戦）
ステージ6： UYシウティ（超巨大ボス壁面登り）
ステージ7： コア・シティ（エイリアン要塞潜入）
ステージ8： いて座A*（銀河中心コアボス戦）
マップ6：アンドロメダ銀河
ステージ1： 銀河間ボイド（超長距離ノーダメージ巡航）
ステージ2： アンドロメダハロー（見えない罠の索敵戦）
ステージ3： 二重コア惑星（変則重力アクション）
ステージ4： 青い巨星砂漠（オーバーヒート耐久）
ステージ5： 衝突境界線（2銀河激突の崩壊ステージ）
ステージ6： 幻影星系（偽ルート見極めパズル）
ステージ7： 反物質ポケット（一撃死回避スリルエリア）
ステージ8： アンドロメダ要塞（機械生命体首領戦）
マップ7：暗黒物質（ダークマター）エリア
ステージ1： 重力レンズ（画面歪み視覚パズル）
ステージ2： シャドウ・プラネット（レーダー索敵バトル）
ステージ3： 暗黒星雲（視界ゼロ探索）
ステージ4： タイム・ディレイ（スローモーションアクション）
ステージ5： 宇宙フィラメント（一本道ワイヤーアクション）
ステージ6： ゴーストギャラクシー（質量兵器防衛戦）
ステージ7： タキオンの嵐（逆再生ギミック）
ステージ8： ダークマター核（暗黒同化ボス戦）
マップ8：深宇宙・モンスター天体
ステージ1： TON 618（超重力限界バトル）
ステージ2： クエーサージェット（一撃必殺ビーム回避）
ステージ3： ガンマ線バースト（ランダム砲撃サバイバル）
ステージ4： ダイヤモンド惑星（超硬度オブジェクト破壊ボーナス）
ステージ5： WASP-76b（鉄の雨雨宿りパズル）
ステージ6： ブーテス・ボイド（無音・完全孤立戦闘）
ステージ7： ファースト・スター（純粋エネルギーコア破壊）
ステージ8： グレート・ウォール（連戦・銀河壁突破戦）
マップ9：異次元・亜空間
ステージ1： ローゼン橋（ワープトンネル・スピードラン）
ステージ2： ホワイトホール（逆風・吹き飛ばしアスレチック）
ステージ3： 4次元キューブ（立体迷路パズル）
ステージ4： 宇宙ひも（極細足場アクション）
ステージ5： パラレル・アース（IF世界・鏡像エネミー戦）
ステージ6： ミラー・スペース（操作反転ステージ）
ステージ7： 虚数空間（概念書き換えパズル）
ステージ8： タキオン・ゲート（時間制限付きボス戦）
マップ10：ビッグバン・境界エリア
ステージ1： 背景放射CMB（宇宙最古の壁破壊）
ステージ2： インフレーション（超膨張ステージ・画面スクロール）
ステージ3： 事象の地平線（カウントダウン脱出）
ステージ4： ビッグクランチ（画面縮小・圧死回避）
ステージ5： ヒートデス（静寂の耐久サバイバル）
ステージ6： 原始のスープ（ドロドロ素粒子流アクション）
ステージ7： 時空の特異点（全ギミック混成パズル）
ステージ8： ビッグバン・コア（創造主・究極のラストボス戦）



</pasted_text>

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: sleep]_

_[tool: eval_js_user_view]_

_[tool: sleep]_

_[tool: screenshot_user_view]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

## User

re

## Assistant

