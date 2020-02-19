var tool = require('../tools/tool.ts')
var fs = require('fs')
var raw_data = JSON.parse( fs.readFileSync('./estimate.json') )
console.log(raw_data)
var pointratio =  JSON.parse(fs.readFileSync('bronze_ratio.json'))
//console.log(tool.patterns)

let well_turning255= {
    'red': 985 ,
    'green':850,
    'blue':1023
}


/*
patterns.forEach(element => {
    raw_data['red'][element*2] = controlpoints[]
});
*/

tool.patterns.forEach( function(element,index) {
    tool.modifypoint('red',element,Math.round(pointratio['red'][index]*well_turning255.red/1000))
    tool.modifypoint('green',element,Math.round(pointratio['green'][index]*well_turning255.green/1000))
    tool.modifypoint('blue',element,Math.round(pointratio['blue'][index]*well_turning255.blue/1000))

});

//console.log(JSON.stringify(raw_data))
tool.showcontrolpts()
fs.writeFileSync('./estimate.json',JSON.stringify(raw_data))
