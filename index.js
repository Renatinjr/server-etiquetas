const printer = require('node-printer')
const util = require('util')

console.log('teste', printer.getPrinters())

// console.log("installed printers:\n"+util.inspect(printer.getPrinters(), {colors:true, depth:10}));