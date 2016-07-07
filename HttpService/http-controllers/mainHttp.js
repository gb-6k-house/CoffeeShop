/**
 * Created by niupark on 16/1/6.
 */
'use strict';

const eCode = require('../models/errorCode');
const http = require('./httpBase').http;
const rpc = require('./rpc-server');
const logger = process.logger;
/*
 *接口名 hello
 *描述
 * 入参数{}
 * 出参数{
 * }
 * */
exports.hello = function(req, res, next){
    // if (!req.body.location || !req.body.IMEI){
    //     http.sendData(res, eCode.ParamerError, '参数错误', null);
    //     return
    // }
    rpc.call(function(remote) {
        remote.rpcMain(function(err, data){
            if (err) {
                http.sendData(res, eCode.UnkownError, '操作失败', null);
            }else{
                http.sendData(res, 0,'操作成功',data);
            }
        });
    });
}







