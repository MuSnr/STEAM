const cache = CacheService.getScriptCache();
const CACHE_PREFIX = 'MY_APP_CACHE_';
const CACHE_EXPIRATION = 3600; // Cache expiration time in seconds (1 hour)
const sp = SpreadsheetApp.getActiveSpreadsheet();
const clearCells = sp.getSheetByName("Mid Term 1");
const ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
const activeCell = ss.getActiveCell();
// Constants for magic values
const SHEET_NAMES = {
  MID_TERM1: "MidTerm1",
  END_TERM1: "EndTerm1",
  OPENER_TERM2: "OpenerTerm2",
  MID_TERM2: "MidTerm2",
  END_TERM2: "EndTerm2"
};
const RANGE_ADDRESSES = {
  CLEAR_CELLS: "C8:U21"
};
const SEARCH_COL_IDX = 0;
const RETURN_COL_IDX = 0;

let cachedKeys = [];
let sheetCache = {};

// Utility functions for caching
function getCachedValue(key) {
  const cachedValue = cache.get(key);
  return cachedValue ? JSON.parse(cachedValue) : null;
}

function setCachedValue(key, value) {
  cache.put(key, JSON.stringify(value), CACHE_EXPIRATION);
}

// Utility function to get sheet values
function getSheet(sheetName) {
  if (!sheetCache[sheetName]) {
    const sheet = sp.getSheetByName(sheetName);
    if (!sheet) {
      console.warn(`Sheet "${sheetName}" does not exist.`);
      return null;
    }
    sheetCache[sheetName] = sheet;
  }
  return sheetCache[sheetName];
}

function getSheetValues(sheetName) {
  const cachedValue = getCachedValue(CACHE_PREFIX + sheetName);
  if (cachedValue !== null) {
    return cachedValue;
  }

  const sheet = getSheet(sheetName);
  if (!sheet) {
    return null;
  }

  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();

  if (lastRow === 0 || lastColumn === 0) {
    console.warn(`Sheet "${sheetName}" is empty.`);
    return [];
  }

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  setCachedValue(CACHE_PREFIX + sheetName, values);

  return values;
}

// Utility function to get matching row
function getMatchingRow(row) {
  const matchingRow = getCachedValue(CACHE_PREFIX + row);
  if (matchingRow !== null) {
    return matchingRow;
  }

  const sheetValues = getSheetValues(SHEET_NAMES.CLASS_DATA);
  const rowValues = sheetValues.map((sheetValue) =>
    sheetValue.find((rowData) => rowData[SEARCH_COL_IDX] === row)
  );

  setCachedValue(CACHE_PREFIX + row, rowValues);
  cachedKeys.push(CACHE_PREFIX + row);

  return rowValues;
}

// Clear cache for modified sheet
function clearCacheOnSheetChange() {
  const modifiedSheet = SpreadsheetApp.getActiveSheet().getName();

  cachedKeys = cachedKeys.filter((key) => !key.startsWith(CACHE_PREFIX + modifiedSheet));

  cache.removeAll(cachedKeys);
}

// Create trigger for clearing cache on sheet changes
function createTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  const triggerExists = triggers.some((trigger) => trigger.getHandlerFunction() === 'clearCacheOnSheetChange');

  if (!triggerExists) {
    ScriptApp.newTrigger('clearCacheOnSheetChange')
      .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
      .onChange()
      .create();
  }
}

// Set up trigger on script initialization
function setupTrigger() {
  createTrigger();
}

function showFullScreenOverlay() {
  const htmlOutput = HtmlService.createHtmlOutputFromFile('FullScreenOverlay')
    .setWidth(400) // Adjust the width as needed
    .setHeight(200); // Adjust the height as needed

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Please wait...');
}

function closeFullScreenOverlay() {
  // Add any cleanup actions or data processing here if needed

  // Close the dialog by returning a success message
  return 'Dialog closed successfully';
}

function onEdit() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const activeCell = sheet.getActiveCell();
  const rangeAddress = activeCell.getA1Notation();

  showFullScreenOverlay();

  //spreadsheet.toast("Processing...", "Please wait", -1);

  if (rangeAddress === 'C1') {
    processRangeC1(activeCell, spreadsheet);
  }

  if (rangeAddress === 'C3') {
    processRangeC3(activeCell, spreadsheet);
  }

  clearCells.getRange(RANGE_ADDRESSES.CLEAR_CELLS).clearContent();
  SpreadsheetApp.flush();
  
  executeFunctions();
  
  closeFullScreenOverlay();

  //spreadsheet.toast("Done", "", -1);
}

function processRangeC1(activeCell, spreadsheet) {
  const rangeToClear = activeCell.offset(2, 0, 4, 1);
  const rangeToClearC3 = activeCell.offset(0, 2, 1, 1);
  const rangeToClearC8_U21 = clearCells.getRange(RANGE_ADDRESSES.CLEAR_CELLS);

  clearRange(rangeToClearC1);
  clearRange(rangeToClearC3);
  clearRange(rangeToClearC8_U21);

  const makesSheet = spreadsheet.getSheetByName(SHEET_NAMES.CLASS_SELECTION);
  const makesRange = makesSheet.getRange(1, 1, 1, makesSheet.getLastColumn());
  const makes = makesRange.getValues()[0];
  const makeIndex = makes.indexOf(activeCell.getValue()) + 1;

  if (makeIndex) {
    applyValidationRule(rangeToClear, makesSheet, makeIndex);
  }
}

function processRangeC3(activeCell, spreadsheet) {
  const rangeToClear = activeCell.offset(2, 0, 1, 1);
  
  clearRange(rangeToClear);

  const makesSheet = spreadsheet.getSheetByName(SHEET_NAMES.STUDENT_NAMES);
  const makesRange = makesSheet.getRange(1, 1, 1, makesSheet.getLastColumn());
  const makes = makesRange.getValues()[0];
  const makeIndex = makes.indexOf(activeCell.getValue()) + 1;

  if (makeIndex) {
    applyValidationRule(rangeToClear, makesSheet, makeIndex);
  }
}

function clearRange(range) {
  range.clearDataValidations().clearContent().setBackground("red");
}

function applyValidationRule(range, sheet, columnIndex) {
  const validationRange = sheet.getRange(2, columnIndex, sheet.getLastRow());
  const validationRule = SpreadsheetApp.newDataValidation().requireValueInRange(validationRange).setAllowInvalid(true).build();
  range.setDataValidation(validationRule).setBackground('#fff');
}




