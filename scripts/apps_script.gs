function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Listings');
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const json = data.map(row => {
    const o = {};
    headers.forEach((h, i) => o[h] = row[i]);
    return o;
  });
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}
