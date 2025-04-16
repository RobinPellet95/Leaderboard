function updateScore(player, points) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var range = sheet.getRange('A:A').getValues();
  for (var i = 0; i < range.length; i++) {
    if (range[i][0] == player) {
      var currentScore = sheet.getRange(i + 1, 2).getValue();
      sheet.getRange(i + 1, 2).setValue(currentScore + points);
      break;
    }
  }
}
