[![Build Status](http://172.31.12.206:8080/buildStatus/icon?job=rfid-angular-pipeline)](http://172.31.12.206:8080/job/rfid-angular-pipeline/)
[![Quality Gate Status](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=alert_status&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Security Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=security_rating&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
[![Maintainability Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=sqale_rating&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
[![Reliability Rating](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=reliability_rating&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
[![Vulnerabilities](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=vulnerabilities&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
[![Bugs](http://172.21.75.22:9000/api/project_badges/measure?project=rfid-angular-system&metric=bugs&token=sqb_c79d15d49cfd7d55439c69fc761e91521e62e94a)](http://172.21.75.22:9000/dashboard?id=rfid-angular-system)
## アイルスシステム

![alt text](screenshot/rfid.png)

作業者の位置確認。
緊急事態時に共通プラットフォームを活用する事での安否確認高度化(所在の把握) 
## システム所有者
ブライアンフェルナンデズ
### ソフトウェア要件
* 最新のNodeJSをダウンロードする。[NodeJS](https://nodejs.org/en/download/)
* 最新のAngularCLIをインストールする。[Angular CLI](https://angular.io/cli) 

### インストールと構成方法
* ステップ 1: ソースコードリポジトリをダウンロードする。 http://172.31.12.207:7080/git/jt0191340/rfidsystem-angular.git
* ステップ  2: ZIPファイルでダウンロードする場合は好きなファイルフォルダに抽出する。
* ステップ  3: 解凍するフォルダにCMDターミナルを設定する.
* ステップ  4: システムの依存関係ダウンロードするには**`npm install`**コマンドを実行する。
* ステップ  5: CMDターミナルで**`npm start`**コマンドを実行し、ブラウザで**http://localhost:4200/**を閲覧する。
プロジェクトは[Angular CLI](https://github.com/angular/angular-cli) version 15.1.1で生成される。

### 使用技術
* Angular CLI Version 15.1.1
* Material UI
* SASS
* Typescript/Rxjs
* GraphQL

### ビルド
* システムビルドをするようにCMDターミナルで`npm run build`コマンドを実行する。
* ビルドしたファイルは`dist/`フォルダにある。
