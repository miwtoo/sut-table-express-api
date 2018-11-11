const express = require('express');
const request = require('request');
const iconv = require('iconv-lite');
const cors = require('cors')

const app = express();


var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// เรียกดูทั้งหมด
// coursecode = รหัสวิชา
// year = ปีการศึกษา
// semester = เทอม
app.get('/api/:coursecode/:year/:semester', cors(corsOptions), function (req, res) {
    var url = 'http://reg6.sut.ac.th/registrar/class_info_1.asp?coursestatus=O00&facultyid=all&maxrow=1000&acadyear='+req.params.year+'&semester='+req.params.semester+'&coursecode='+req.params.coursecode
    var data ="hello";
    request({
        url: url,
        encoding: null
    }, function (error, response, body) {
        body = iconv.decode(body, 'win874')

        var allgroup = body.match(/(<TR VALIGN=TOP>)(.*?)(<.TR>)/gi)
        var group = []
        for (let i = 0; i < allgroup.length; i++) {
            group.push({
                number: allgroup[i].match(/(?<=<.u><.TD><TD ALIGN=RIGHT BGCOLOR=#......><FONT SIZE=1>)[0-9]{1,2}/g)[0], // กลุ่ม
                id: allgroup[i].match(/[0-9][0-9][0-9][0-9][0-9][0-9] - [0-9]/gi)[0],   //รหัสวิชา - เวอชั่น
                credit: allgroup[i].match(/[0-9] .[0-9]-[0-9].[0-9]./gi)[0], // หน่วยกิต
                name: allgroup[i].match(/(?<=<FONT SIZE=2>)[^&nbsp;](.*?)(?=<br>|<FONT SIZE=1)/g)[0], // ช่อวิชา
                times: []
            })
            var len = allgroup[i].match(/[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9]/g).length

            for (let j = 0; j < len; j++) {
                group[i].times.push({
                    time: allgroup[i].match(/[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9]/g)[j],     // เวลา
                    day: allgroup[i].match(/(?<=<font color=#5080E0>)[A-Z][a-z](?=<.font>)/g)[j],   // วัน
                    room: allgroup[i].match(/(?<=[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9] <U>)(.*?)(?=<.u>)/g)[j]    //ห้อง
                })
                
            }
                
            
        }
        
        res.json(group)
    });
})

// เรียกดูเฉพาะกลุ่ม
// coursecode = รหัสวิชา
// year = ปีการศึกษา
// semester = เทอม
// num = กลุ่มที่ต้องการ
app.get('/api/:coursecode/:year/:semester/:num',cors(corsOptions), function (req, res) {
    var url = 'http://reg6.sut.ac.th/registrar/class_info_1.asp?coursestatus=O00&facultyid=all&maxrow=1000&acadyear='+req.params.year+'&semester='+req.params.semester+'&coursecode='+req.params.coursecode
    var data ="hello";
    request({
        url: url,
        encoding: null
    }, function (error, response, body) {
        body = iconv.decode(body, 'win874')

        var allgroup = body.match(/(<TR VALIGN=TOP>)(.*?)(<.TR>)/gi)
        var group = []
        for (let i = 0; i < allgroup.length; i++) {
            group.push({
                number: allgroup[i].match(/(?<=<.u><.TD><TD ALIGN=RIGHT BGCOLOR=#......><FONT SIZE=1>)[0-9]{1,2}/g)[0],
                id: allgroup[i].match(/[0-9][0-9][0-9][0-9][0-9][0-9] - [0-9]/gi)[0],
                credit: allgroup[i].match(/[0-9] .[0-9]-[0-9].[0-9]./gi)[0],
                name: allgroup[i].match(/(?<=<FONT SIZE=2>)[^&nbsp;](.*?)(?=<br>|<FONT SIZE=1)/g)[0],
                times: []
            })
            var len = allgroup[i].match(/[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9]/g).length

            for (let j = 0; j < len; j++) {
                group[i].times.push({
                    time: allgroup[i].match(/[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9]/g)[j],
                    day: allgroup[i].match(/(?<=<font color=#5080E0>)[A-Z][a-z](?=<.font>)/g)[j],
                    room: allgroup[i].match(/(?<=[0-9][0-9]:[0-9][0-9]-[0-9][0-9]:[0-9][0-9] <U>)(.*?)(?=<.u>)/g)[j]
                })
                
            }
                
            
        }

        if(req.params.num > group.length)
            res.send("index out of range");
        else 
            res.json(group[req.params.num-1])
    });
})

const server = app.listen(8080, function () {
    const port = server.address().port;
    console.log('Server is running on port %s.', port);

})