import FileSaver from 'file-saver';

function exportJsonFile(json, fileName) {
  const data = JSON.stringify(json);
  const blob = new Blob([data], { type: '' });
  FileSaver.saveAs(blob, `${fileName}.json`);
}

export default {
  exportJsonFile,
};
