const express =require('express')
const app=express()
const wxPay=require('wx-payment')
const AppID='wx6dd03565bc518946'
const apiKey='7hWedecKi9NN7jw8FMsheSw4NqfufkIv'
const nodemailer = require('nodemailer');
const fs=require('fs')
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
});
app.all('/api/unifiedorder', function (req, res) {
    if(!req.query.body){
        res.status(400).send('param body is required')
        return
    }
    if(!req.query.spbill_create_ip){
        res.status(400).send('param spbill_create_ip is required')
        return
    }
    if(!req.query.total_fee){
        res.status(400).send('param total_fee is required')
        return
    }
    wxPay.createUnifiedOrder({
        body: req.query.body, // 商品或支付单简要描述
        out_trade_no:(new Date().getTime()+ Math.random().toString(30).substr(2)).substr(0,30), // 商户系统内部的订单号,32个字符内、可包含字母
        total_fee: req.query.total_fee,
        spbill_create_ip: req.query.spbill_create_ip,
        notify_url: 'http://119.29.200.37/api/wxcallback',
        trade_type: 'APP',
        sign_type:'MD5'
    }, function(err, result){
       res.send(result)
    });
});
app.all('/api/wxcallback',wxPay.wxCallback(function(msg, req, res, next){
    // 处理商户业务逻辑
    mailOptions.text=msg
    //发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(info);
    });
    // res.success() 向微信返回处理成功信息，res.fail()返回失败信息。
    res.success();
}));

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('wx test listening at http://%s:%s', host, port);
});



