
const fs = require('fs')

function binaryToHex(s) { 
//func fork from https://stackoverflow.com/questions/17204912/javascript-need-functions-to-convert-a-string-containing-binary-to-hex-then-co
    var i, k, part, accum, ret = '';
    for (i = s.length-1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i+1-4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
            if (part[k] !== '0' && part[k] !== '1') {
                // invalid character
                return { valid: false };
            }
            // compute the length 4 substring
            accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
            // 'A' to 'F'
            ret = String.fromCharCode(accum - 10 + 'a'.charCodeAt(0)) + ret;
        } else {
            // '0' to '9'
            ret = +String(accum) + ret;
        }
    }
    // remaining characters, i = 0, 1, or 2
    if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
            if (s[k] !== '0' && s[k] !== '1') {
                return { valid: false };
            }
            accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = +String(accum) + ret;
        
    }
    return { valid: true, result: '0x'+ret };
}

function hexToBinary(s) {
    var i, k, part, ret = '';
    // lookup table for easier conversion. '0' characters are padded for '1' to '7'
    var lookupTable = {
        '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100',
        '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001',
        'a': '1010', 'b': '1011', 'c': '1100', 'd': '1101',
        'e': '1110', 'f': '1111',
        'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101',
        'E': '1110', 'F': '1111'
    };
    s=s.substr(2,s.length) // so as to delete '0x'
    for (i = 0; i < s.length; i += 1) {
        if (lookupTable.hasOwnProperty(s[i])) {
            ret += lookupTable[s[i]];
        } else {
            return { valid: false };
        }
    }
    return { valid: true, result: ret };
}

function converttojson(filepath){
    var file_buffer = fs.readFileSync(filepath,'utf8')
    //console.log(file_buffer)
    var cutpoint = file_buffer.indexOf('/*')
    file_buffer = file_buffer.substr(0,cutpoint)

    file_buffer = file_buffer.replace(/\{/g,"[")
    file_buffer = file_buffer.replace(/\}/g,"]") // repalce all quote
    //https://coder.tw/?p=7258

    file_buffer = file_buffer.replace(/(?<!")(\b\d+\b)(?!")/g,`"$1"` ) //replace number to "number"
    //https://stackoverflow.com/questions/40110706/regex-wrap-all-integers-in-double-quotes
    //file_buffer = file_buffer.replace('[512][R]','red :')
    //file_buffer = file_buffer.replace('////[512][G]','green :')
    //console.log(file_buffer.indexOf('[B]') )
    file_buffer = file_buffer.replace('//["512"][R]','"red":')
    file_buffer = file_buffer.replace('//["512"][G]','"green":')
    file_buffer = file_buffer.replace('//["512"][B]','"blue":')

    file_buffer = file_buffer.replace(/,+\s+\]/g,']')


    file_buffer = '{' +file_buffer +'}'
    console.log(file_buffer)
    return file_buffer
}
const filepath = './gamma_table.tbl'
const ptr = 0x14015700
converttojson(filepath)
