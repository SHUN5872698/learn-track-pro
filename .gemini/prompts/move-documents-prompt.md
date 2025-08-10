# Workflow: move-documents

このプロンプトは、指定されたファイルを適切なディレクトリに移動させる `workflow:move-documents` の実行をガイドします。

## パラメータ:
- `source_file_path`: 移動するファイルのパスを指定します。
- `destination_directory_path`: 移動先のディレクトリのパスを指定します。

## ステップ:

1.  **引数の解析**: ユーザーのリクエストから `source_file_path` と `destination_directory_path` を抽出します。
2.  **ファイルの存在確認**: `source_file_path` のファイルが存在することを確認します。
3.  **ディレクトリの存在確認**: `destination_directory_path` のディレクトリが存在することを確認します。
4.  **ファイルの移動**: `source_file_path` のファイルを `destination_directory_path` へ移動します。
5.  **移動の確認**: ファイルが正しく移動されたことを確認します。
