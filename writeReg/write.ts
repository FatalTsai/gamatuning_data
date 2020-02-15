var process = require('child_process');
var exec = require('child_process').exec;
var iconv = require('iconv-lite');


 exec(`adb push ./testresult.conf /data`,{encoding:'binaryEncoding'}, function(error, stdout, stderr){
    if(error) {
        //console.error('error: ' + iconv.decode(error,'cp950'));
        console.error('error: '+error)
        return;
    }
    console.log('stdout: ' + iconv.decode(stdout,'cp950'));
    console.log('stderr: ' +  stderr);
});

exejetgamma()


function exejetgamma(){
    setTimeout(function(){
         exec(`adb shell  ./data/jetgamma -i  /data/testresult.conf -s`,{encoding:'binaryEncoding'}, function(error, stdout, stderr){
            if(error) {
                //console.error('error: ' + iconv.decode(error,'cp950'));
                console.error('error: '+error)
                return;
            }
            console.log('stdout: ' + iconv.decode(stdout,'cp950'));
            console.log('stderr: ' +  stderr);
        });

    
    },500)
}