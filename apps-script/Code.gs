/**
 * Giri ♥ Sowmi — wishes endpoint
 * ─────────────────────────────────────────────────────────────────────────
 * Paste this into the Apps Script editor of the Google Sheet that should
 * collect the wishes, then deploy it. Setup steps are in the project README.
 *
 * It appends one row per submission and creates the header row on first use.
 * ─────────────────────────────────────────────────────────────────────────
 */

var SHEET_NAME = 'Wishes';
var HEADERS = ['Received', 'Name', 'Wish', 'Joining', 'Language'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // two guests submitting at the same instant would otherwise race for the
    // same row and one write would be lost
    lock.waitLock(20000);

    var p = (e && e.parameter) || {};

    // honeypot: a real guest never sees this field, so anything in it is a bot
    if (p.trap) return reply({ ok: true, skipped: true });

    var name = String(p.name || '').trim();
    var wish = String(p.wish || '').trim();
    if (!name && !wish) return reply({ ok: false, error: 'empty' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      name.slice(0, 120),
      wish.slice(0, 2000),
      String(p.joining || '').slice(0, 60),
      String(p.lang || '').slice(0, 8)
    ]);

    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignored) {}
  }
}

/** Opening the /exec URL in a browser should say something friendly. */
function doGet() {
  return reply({ ok: true, msg: 'Giri & Sowmi — wishes endpoint is live' });
}

function reply(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
