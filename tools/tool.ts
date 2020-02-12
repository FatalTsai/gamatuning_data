
var parse = require('../parse_tbl_into_.conf/parse.ts')
var fs = require('fs')
var panel5path = './testresult.json'
var process = require('child_process');
const exec = require('child_process').exec;
const iconv = require('iconv-lite');
const patterns =[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,255]


var raw_data = JSON.parse(fs.readFileSync(panel5path,'utf8'))
//console.log(raw_data)

function padding(num) {
    var length =4
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;            
    }
    return num;
}//https://blog.csdn.net/chy555chy/article/details/62886715


function modifypoint(color,point,value) //e.g. 240, red
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

function roundall(data)
{
   
    data['red'].forEach(function(part, index) {
        this[index] = Math.round(this[index])
      }, data['red']);
    data['green'].forEach(function(part, index) {
    this[index] = Math.round(this[index])
    }, data['green']);    
    data['blue'].forEach(function(part, index) {
    this[index] = Math.round(this[index])
    }, data['blue']);

/*
      data['red'].forEach(element => {
        element = Math.round(element)
    });

    data['green'].forEach(element => {
        element = Math.round(element)
    });
    data['blue'].forEach(element => {
        element = Math.round(element)
    });
    */
     return data
}

function showcontrolpts(){
   // console.log(JSON.stringify(raw_data))
    console.log('pts   |  R  |  G  |  B ')
 

    /*console.log(`${padding(patterns[i])}   | ${padding(raw_data['red'][patterns[i*2]])} |`+
    ` ${padding(raw_data['green'][patterns[i*2]])} | ${(raw_data['blue'][patterns[i*2]])} `)*/
    for(var i=0;i<patterns.length;i++){
        console.log(`${padding(patterns[i])}   | ${padding(raw_data['red'][patterns[i]*2  ] )} |`+
        ` ${padding(raw_data['green'][patterns[i]*2 ])} | ${(raw_data['blue'][patterns[i]*2])} `)
    }
}
modifypoint('red',0,0)
modifypoint('green',0,0)
modifypoint('blue',0,0)

//console.log(roundall(raw_data))
//roundall(raw_data)
roundall(raw_data)
fs.writeFileSync('./testresult.json',JSON.stringify(raw_data))

//console.log(parse.binaryToHex(255))

fs.writeFileSync('testresult.conf','')
for(var i=0;i<512;i++)
{ 
    
    var pos,data  //data is Gamma_Lut_R,G,B's combining
  //pos is the reg's location

    //console.log( "red : "+raw_data['red'][i] )
    //console.log( "green : "+raw_data['green'][i] )
    //console.log( "blue : "+raw_data['blue'][i] )

    data = '00'+ parse.demcimaltobinary(raw_data['red'][i]) +parse.demcimaltobinary(raw_data['green'][i])+
    parse.demcimaltobinary(raw_data['blue'][i])

    data = parse.binaryToHex(data).result

    pos = parseInt(parse.hexToBinary(parse.ptr).result,2) + i*4
    pos = parse.binaryToHex(parse.demcimaltobinary(pos)).result
    //console.log(`red :reg${i} ${raw_data['red'][i]} \n`)
    //console.log(pos+'='+data+'\n')
    fs.appendFileSync('testresult.conf',pos+'='+data+'\n')
}
/*
function exec(shell) {
     process.exec(shell,function (error, stdout, stderr) {
         if (error !== null) {
          console.log('exec error: ' + error);
         }
     });
}*/
setTimeout(function(){
     exec(`adb push D:/cheney.tsai/Desktop/gamatuning_data/tools/testresult.conf /test`,{encoding:'binaryEncoding'}, function(error, stdout, stderr){
        if(error) {
            //console.error('error: ' + iconv.decode(error,'cp950'));
            console.error('error: '+error)
            return;
        }
        //console.log('stdout: ' + iconv.decode(stdout,'cp950'));
        //console.log('stderr: ' + typeof stderr);
    });

    jetgamma()
},500)
function jetgamma(){
    setTimeout(function(){
         exec(`adb shell jetgamma -i  /test/testresult.conf -s`,{encoding:'binaryEncoding'}, function(error, stdout, stderr){
            if(error) {
                //console.error('error: ' + iconv.decode(error,'cp950'));
                console.error('error: '+error)
                return;
            }
            //console.log('stdout: ' + iconv.decode(stdout,'cp950'));
            //console.log('stderr: ' + typeof stderr);
        });

        showcontrolpts()

    },500)
}