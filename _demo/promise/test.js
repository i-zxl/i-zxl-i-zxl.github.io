const Promise = require('./promise')

new Promise((resolve, reject) => {
  console.log('starting-----------');
  setTimeout(() => {
    resolve(1)
  })
})
.then((value) => {
  return `tow${value}`
}, (reason) => {
  console.log(reason);
})
.then((value) => {
  console.log(value);
}, (reason) => {
  console.log(reason);
})
console.log(2)