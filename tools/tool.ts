var convertojson = require('../parse_tbl_into_.conf/parse.ts')
var fs = require('fs')
var panel5path = './panel5.json'
const patterns =[0,16,32,48,64,80,96,112,128,144,160,176,192,224,240,255]


var raw_data = JSON.parse(fs.readFileSync(panel5path,'utf8'))
console.log(raw_data)