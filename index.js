const express =require('express')
const app=express()
const wxPay=require('wx-payment')
const AppID='wx6dd03565bc518946'
const apiKey='nr5w8yED1JRNBnP9JxtHeHRb5CpLty4N'
const nodemailer = require('nodemailer');
const Monitor=require('./monitor')
//设置发件人信息
const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'daily_report@meimiao.net',
        pass: 'Honeytime@1905'
    }
});
let mailOptions = {
    from: '<daily_report@meimiao.net>', // sender address
    to: 'zhoujiapeng@meimiao.net;', // list of receivers
    subject: '微信支付结果',
};
wxPay.init({
    appid: AppID,
    mch_id: '1497607442',
    apiKey: apiKey,
    pfx: fs.readFileSync('./cert/apiclient_cert.p12')
});
app.all('/api/unifiedorder', function (req, res) {
    wxPay.createUnifiedOrder({
        body: '支付测试', // 商品或支付单简要描述
        out_trade_no: (Math.random()).toString(35).substr(2)+new Date().getTime(), // 商户系统内部的订单号,32个字符内、可包含字母
        total_fee: 1,
        spbill_create_ip: '114.246.65.215',
        notify_url: 'http://119.29.200.37/api/wxcallback',
        trade_type: 'APP',
    }, function(err, result){
       res.send(result)
    });
});
app.all('/api/wxcallback',wxPayment.wxCallback(function(msg, req, res, next){
    // 处理商户业务逻辑

    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
}));

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});



