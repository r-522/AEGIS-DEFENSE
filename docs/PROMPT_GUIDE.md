# AEGIS DEFENSE — Prompt Guide for Claude Code

このドキュメントは、既存の仕様書から Claude Code 用の実装プロンプトを作るためのガイドです。  
実コードを書く前に、必ず対象フェーズ・参照仕様・完了条件を明確にしてください。

## 1. 基本方針

Claude Code への依頼は、以下の順番で組み立てます。

1. **対象フェーズを選ぶ**: `docs/IMPLEMENTATION_PLAN.md` の Phase 1 以降から選ぶ。
2. **参照する仕様を指定する**: `CLAUDE.md` と、作業に関係する `docs/*.md` を明示する。
3. **今回やることを狭くする**: 1プロンプトにつき、1つの成果物または1つの縦切りに絞る。
4. **やらないことを明記する**: 例: 「ゲームバランス実装はまだしない」「Supabase本番設定はまだしない」。
5. **完了条件を箇条書きにする**: 画面、ファイル、テスト、ドキュメント更新の期待値を書く。
6. **品質条件を付ける**: anti-AI UI、Vercel deployability、Supabase security、TypeScript strictness など。

## 2. 汎用プロンプトテンプレート

```text
あなたはこのリポジトリの実装担当です。

まず以下を読んで前提にしてください。
- CLAUDE.md
- docs/IMPLEMENTATION_PLAN.md
- docs/PRODUCT_REQUIREMENTS.md
- docs/DESIGN_DIRECTION.md
- docs/TECHNICAL_ARCHITECTURE.md
- 必要に応じて docs/GAME_SYSTEMS.md / docs/CLASS_BALANCE.md

今回の作業対象:
- Phase: <IMPLEMENTATION_PLAN のフェーズ名>
- Goal: <今回達成したいことを1文で>

実装してほしいこと:
1. <具体的な作業1>
2. <具体的な作業2>
3. <具体的な作業3>

やらないこと:
- <今回スコープ外にすること>
- <まだ作らない機能>

品質条件:
- Vercel にデプロイできる構成を維持すること。
- Supabase の service role key をクライアントに出さないこと。
- UI を作る場合は docs/DESIGN_DIRECTION.md の anti-AI checklist を満たすこと。
- 実装値やゲームバランスは可能な限りデータ駆動にすること。
- 実コードを変更した場合はテスト/型チェック/ビルド確認を行うこと。

完了条件:
- <ユーザー視点で何ができるか>
- <どのファイル/機能が増えるか>
- <どのコマンドが通るべきか>

最後に、変更内容・テスト結果・残課題を日本語でまとめてください。
```

## 3. Phase 1 用プロンプト例: プロジェクトスキャフォールド

```text
あなたは AEGIS DEFENSE の初期実装担当です。

まず以下を読んでください。
- CLAUDE.md
- docs/IMPLEMENTATION_PLAN.md
- docs/PRODUCT_REQUIREMENTS.md
- docs/DESIGN_DIRECTION.md
- docs/TECHNICAL_ARCHITECTURE.md

今回の作業対象:
- Phase 1 — Project scaffold
- Goal: Vercel にデプロイ可能な Next.js + TypeScript の土台を作る。

実装してほしいこと:
1. Next.js + TypeScript の基本構成を作成してください。
2. ログイン、メインメニュー、設定、ゲームプレイシェル用のルーティングだけ用意してください。
3. docs/DESIGN_DIRECTION.md の色・フォント方針を反映できる design tokens の土台を作ってください。
4. README にローカル起動、lint、build のコマンドを追記してください。
5. Supabase の環境変数名だけ `.env.example` に定義してください。秘密値は入れないでください。

やらないこと:
- まだ Supabase 本番接続やマイグレーションは作らない。
- まだ 3D 戦闘、職業、ウェーブ、ローグライト処理は実装しない。
- 仮のゲーム UI を作る場合でも、汎用 SaaS 風・AI 生成風の見た目にしない。

品質条件:
- Vercel deployability を崩さないこと。
- TypeScript を前提にすること。
- UI は AEGIS DEFENSE の重厚な方向性に合わせること。

完了条件:
- `npm run lint` が通る。
- `npm run build` が通る。
- README の起動手順でローカル確認できる。
```

## 4. Phase 2 用プロンプト例: Supabase 認証

```text
あなたは AEGIS DEFENSE の認証実装担当です。

まず以下を読んでください。
- CLAUDE.md
- docs/PRODUCT_REQUIREMENTS.md
- docs/TECHNICAL_ARCHITECTURE.md
- docs/IMPLEMENTATION_PLAN.md

今回の作業対象:
- Phase 2 — Authentication and profile persistence
- Goal: Supabase Auth を使って、ユーザー名とパスワードでログインでき、明示ログアウトまでセッションが維持される基盤を作る。

実装してほしいこと:
1. Supabase client/server helper を追加してください。
2. サインアップ、ログイン、ログアウトの UI と処理を実装してください。
3. `profiles.username` をユーザー表示名として扱う設計にしてください。
4. セッション復元後にメインメニューで username と rank を表示してください。
5. 必要な SQL migration と RLS policy を追加してください。

やらないこと:
- パスワードを独自テーブルに保存しない。
- Supabase service role key をクライアントへ露出しない。
- ゲームプレイ本体はまだ作らない。

品質条件:
- リロード後もログイン状態が復元されること。
- ログアウト後は認証画面へ戻ること。
- RLS により他人の profile/settings を読めないこと。

完了条件:
- 認証関連のテストまたは手動検証手順が README か PR summary に残る。
- `npm run lint` と `npm run build` が通る。
```

## 5. Phase 3 用プロンプト例: 3D 縦切り

```text
あなたは AEGIS DEFENSE の 3D gameplay vertical slice 担当です。

まず以下を読んでください。
- CLAUDE.md
- docs/GAME_SYSTEMS.md
- docs/DESIGN_DIRECTION.md
- docs/PRODUCT_REQUIREMENTS.md
- docs/IMPLEMENTATION_PLAN.md

今回の作業対象:
- Phase 3 — 3D gameplay vertical slice
- Goal: 三人称視点でプレイヤーが移動し、簡単なウェーブを開始/終了できる最小の縦切りを作る。

実装してほしいこと:
1. React Three Fiber / Three.js を使った 3D gameplay shell を作ってください。
2. 三人称カメラ、移動、簡易ドッジまたはスプリントを実装してください。
3. 1つのテストマップ、base objective、spawn lane を置いてください。
4. HUD に player name、wave、rank、base integrity を表示してください。
5. gameplay simulation は React rendering と密結合しない構成にしてください。

やらないこと:
- まだ全職業や本格スキルは実装しない。
- まだ本格的なタワー配置は作らない。
- 汎用的な青紫グラデーション UI にしない。

品質条件:
- docs/DESIGN_DIRECTION.md の HUD 方針に合わせること。
- カメラ感度を後で settings から変更できる構成にすること。
- 低スペック向けの描画設定を後で追加しやすい構成にすること。

完了条件:
- ログイン済みユーザーが gameplay route に入り、3D空間で移動できる。
- wave 表示が変化する最小処理がある。
- `npm run lint` と `npm run build` が通る。
```

## 6. Phase 5 用プロンプト例: 職業キット実装

```text
あなたは AEGIS DEFENSE の職業システム実装担当です。

まず以下を読んでください。
- CLAUDE.md
- docs/CLASS_BALANCE.md
- docs/GAME_SYSTEMS.md
- docs/PRODUCT_REQUIREMENTS.md

今回の作業対象:
- Phase 5 — Professions and abilities
- Goal: ローンチ推奨12職のうち、まず Warrior / Mage / Engineer のデータ駆動キット定義と選択 UI を作る。

実装してほしいこと:
1. profession data schema を TypeScript で定義してください。
2. Warrior / Mage / Engineer の passive、ability、ultimate を docs/CLASS_BALANCE.md に沿ってデータ化してください。
3. 職業選択画面で role、strength、weakness、tower synergy を表示してください。
4. gameplay 側が選択 profession を参照できる状態管理を作ってください。

やらないこと:
- まだ全職業を実装しない。
- まだ最終数値バランスを固定しない。
- アビリティの豪華な VFX/SFX は後工程に残してよい。

品質条件:
- 職業データはコンポーネントに直書きしないこと。
- 1職ごとに 1–2 passives、1–2 abilities、1 ultimate の構造を守ること。
- どの職業も tower-defense contribution を表示できること。

完了条件:
- 職業選択から gameplay shell へ選択結果が渡る。
- 型チェックと build が通る。
```

## 7. 悪いプロンプト例

以下のような依頼は避けてください。

```text
このゲームを全部作って。かっこよくして。AIっぽくしないで。
```

問題点:

- スコープが大きすぎる。
- 参照仕様が指定されていない。
- 完了条件がない。
- テスト条件がない。
- 何を作らないかが不明。

## 8. 良いプロンプトのチェックリスト

- [ ] `CLAUDE.md` を読むよう指定している。
- [ ] 対象 phase を `docs/IMPLEMENTATION_PLAN.md` から選んでいる。
- [ ] 関連仕様書を明示している。
- [ ] 1回の依頼が大きすぎない。
- [ ] やらないことを書いている。
- [ ] Vercel / Supabase / anti-AI UI / data-driven balance の品質条件が入っている。
- [ ] 完了条件とテストコマンドがある。
- [ ] 変更後に日本語で summary と残課題を出すよう依頼している。
