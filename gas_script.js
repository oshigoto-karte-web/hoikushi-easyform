/**
 * Google Apps Script - 保育士転職フォーム データ受信スクリプト
 *
 * 設定方法:
 * 1. https://script.google.com/ にアクセスして新しいプロジェクトを作成
 * 2. 下記コードをコピー&ペースト
 * 3. SPREADSHEET_ID と SHEET_NAME を確認・修正
 * 4. 「デプロイ」→「新しいデプロイ」→「ウェブアプリ」を選択
 * 5. 「次のユーザーとして実行」→「自分」
 * 6. 「アクセスできるユーザー」→「全員」
 * 7. デプロイして表示されたURLをコピー
 * 8. ManusのシークレットにVITE_GAS_WEBHOOK_URLとして設定
 */

// ===== 設定 =====
const SPREADSHEET_ID = "178RjAhJ-Te1PxpZo8KUYtFHuCYODsftQEsJBNDfF9jk";
const SHEET_NAME = "簡易版";

// ===== POSTリクエスト受信 =====
function doPost(e) {
  try {
    // リクエストボディをパース
    const data = JSON.parse(e.postData.contents);

    // スプレッドシートを開く
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "シートが見つかりません: " + SHEET_NAME })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 送信日時（日本時間）
    const now = new Date();
    const jstOffset = 9 * 60 * 60 * 1000;
    const jstDate = new Date(now.getTime() + jstOffset);
    const dateStr = Utilities.formatDate(jstDate, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");

    // スプレッドシートに書き込み
    // A=送信日時, B=記入者のお名前, C=電話番号, D=ご連絡希望日程, E=ご連絡希望時間
    sheet.appendRow([
      dateStr,          // A: 送信日時
      data.name || "",  // B: 記入者のお名前
      data.phone || "", // C: 電話番号
      data.date || "",  // D: ご連絡希望日程
      data.time || "",  // E: ご連絡希望時間
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== GETリクエスト（動作確認用） =====
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: "OK", message: "保育士フォームGASスクリプト稼働中" })
  ).setMimeType(ContentService.MimeType.JSON);
}
