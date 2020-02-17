var patterns =[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,255]
var fs = require('fs')




var controlpoints =  JSON.parse(fs.readFileSync('bronze_ratio.json'))
var modifypoint = function (color,point,value) //e.g. 240, red
{
    var index = patterns.indexOf(point)
    if( index === undefined)
    {
        console.log("not control points :'(")
        return ;
    }


    console.log(`point ${point} ${color} is  ${raw_data[color][point*2]}`)
    raw_data[color][point*2] = String(value)
    console.log(`point ${point} ${color} change to ${value}`)

    var front_point = patterns[index-1]
    var back_point = patterns[index+1]
    var front_gap_point_num = (point - front_point) 
    var back_gap_point_num = (back_point - point)
    //console.log(raw_data[color][point*2])
    //console.log(raw_data[color][front_point*2])
    var front_gap = (parseInt(raw_data[color][point*2]) -parseInt(raw_data[color][front_point*2]))/ (front_gap_point_num*2)
    var back_gap =  (parseInt(raw_data[color][back_point*2]) - parseInt(raw_data[color][point*2]))/(back_gap_point_num*2)

    console.log('front_gap = '+front_gap)
    console.log('back_gap = '+back_gap)
    for(var i=1;i<front_gap_point_num*2;i++)
    {
        raw_data[color][front_point*2 +i] = parseInt(raw_data[color][front_point*2])+i*front_gap
    }
    for(var i=1;i<back_gap_point_num*2;i++)
    {
        raw_data[color][point*2 +i] = parseInt(raw_data[color][point*2])+i*back_gap
    }
}

patterns.forEach(element => {
    modifypoint('red',element,controlpoints['red'][ind])

});