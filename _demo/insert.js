const axios = require('axios').default;
const xlsx = require('node-xlsx').default;

const url = "http://localhost:9200/question_answering_search/_doc"

function parseExcel (fileName, keys) {
  const workSheetsFromFile = xlsx.parse(`${__dirname}/${fileName}`);
  const data = workSheetsFromFile[0]['data'];
  const head = data.shift().join(',').split(',')
  return data.map( one => {
    const itemValue = {};
    head.forEach((item, index) => {
      if (keys.indexOf(item) > -1) {
        itemValue[item] = one[index];
      }
    })
    itemValue['time'] = Date.now();
    return itemValue;
  })
}


function insertElasticSearchDoc ( url, data) {
  data.time = Date.now()
  return axios.post(url, data)
}

function start (url, data) {
  Promise.all(data.map(item => {
    return insertElasticSearchDoc(url, item);
  }))
  .then(result => {
    console.log('insert done!');
  })
}

const parseExcelKey = ['question', 'answing'];
const mockData = parseExcel('testData.xlsx', parseExcelKey);

start(url, mockData);