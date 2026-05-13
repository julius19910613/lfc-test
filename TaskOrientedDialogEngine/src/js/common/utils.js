import FileSaver from 'file-saver';

function exportJsonFile(json, fileName) {
  console.log(JSON.stringify(json));
  const data = JSON.stringify(json);
  const blob = new Blob([data], { type: '' });
  FileSaver.saveAs(blob, `${fileName}.json`);
}

export default {
  exportJsonFile,
};
