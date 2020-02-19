var tool = require('./tool.ts')
var fs = require('fs')
var thepoint = 255

tool.modifypoint('red',thepoint,55)
tool.modifypoint('green',thepoint,1023)
tool.modifypoint('blue',thepoint,1023)



//roundall(showslope(raw_data))
tool.roundall(tool.raw_data)
fs.writeFileSync('./testresult.json',JSON.stringify(tool.raw_data))

//console.log(parse.binaryToHex(255))

tool.writeconf()
tool.execshell()
