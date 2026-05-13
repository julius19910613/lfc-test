import XLSX from 'xlsx';

export function turnWorkBook2Json(workbook) {
  const result = {};
  workbook.SheetNames.forEach((sheetName) => {
    let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if (roa.length > 0) {
      result[sheetName] = roa;
    }
    roa = null;
  });
  return result;
}

export function fixData(data) {
  let output = '';
  let len = 0;
  const unit = 10240;
  for (len = 0; len < data.byteLength / unit; len += 1) {
    const unitArr = new Uint8Array(data.slice(len * unit, (len * unit) + unit));
    output += String.fromCharCode.apply(null, unitArr);
  }
  output += String.fromCharCode.apply(null, new Uint8Array(data.slice(len * unit)));
  return output;
}

export function readXLSXFile(file, params) {
  return XLSX.read(file, params);
}
