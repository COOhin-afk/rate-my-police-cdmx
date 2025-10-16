const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: node scripts/bulkImportOfficers.js <path-to-excel.xlsx>');
  process.exit(1);
}

const abs = path.resolve(inputPath);
if (!fs.existsSync(abs)) {
  console.error('File not found:', abs);
  process.exit(1);
}

console.log('Reading file:', abs);
const wb = XLSX.readFile(abs);
const sheetName = wb.SheetNames[0];
if (!sheetName) {
  console.error('No sheets found in workbook.');
  process.exit(1);
}

const sheet = wb.Sheets[sheetName];
// Convert to JSON; defval:'' keeps empty cells as empty strings
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

if (!rows.length) {
  console.error('No data rows found in first sheet:', sheetName);
  process.exit(1);
}

const headers = Object.keys(rows[0]);
console.log('Sheet:', sheetName);
console.log('Detected headers:', headers.join(', '));
console.log('Row count:', rows.length);

// Write to data/officers.json so your app can consume it
const outDir = path.resolve('data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, 'officers.json');
fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');

console.log('Wrote JSON to:', outPath);
console.log('Import complete (parsed Excel → JSON).');
