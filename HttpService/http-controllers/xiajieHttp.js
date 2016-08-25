/**
 * Created by niupark on 16/1/6.
 *
 *霞姐饺子私厨相关接口
 *
 *
 */
'use strict';

const eCode = require('../models/errorCode');
const http = require('./httpBase').http;
const rpc = require('./rpc-server');
const logger = process.logger;

/*
 *接口名 首页商品列表,
 * /api-xiajie/homeProductList
 *描述
 * 入参数{}
 * 出参数:{
 "code": 0,
 "msg": "操作成功",
 "data": [
 {
 "id": 1,
 "name": "手工速冻饺子",
 "detail": "霞姐速冻饺子坚持选用绿色,新鲜的果蔬和肉类,地道、天然的调料和辅料,致力把产品做到原汁原味,坚决抵制和添加防腐剂、香精等添加剂。",
 "price": 0,
 "logoImage": "3ac79f3df8dcd100472c0d0e748b4710b9122f69.jpg"
 }
 }
 * }
 * */
exports.homeProductList = function(req, res, next){
    // if (!req.body.location || !req.body.IMEI){
    //     http.sendData(res, eCode.ParamerError, '参数错误', null);
    //     return
    // }
    //
    rpc.callXiaJServer(function(remote) {
        remote.homeProductList(function(err, data){
            if (err) {
                http.sendData(res, eCode.UnkownError, '操作失败', null);
            }else{
                http.sendData(res, 0,'操作成功',data);
            }
        });
    });
}
/*
 *接口名 商品分类,
 * /api-xiajie/getProductClassify
 *描述
 * 入参数{
 * parentId:-1 分类存在多级,第一级分类等于-1。如果查询全部分类可以不传参数,查询第一级分类,parenId传-1
 * }
 * 出参数:{
 "code": 0,
 "msg": "操作成功",
 "data": [
 {
 "id": 100,
 "level": 0,
 "parent_id": -1,
 "name": "饺子类",
 "price": 0,
 "unit": "两"
 },
 {
 "id": 200,
 "level": 0,
 "parent_id": -1,
 "name": "面食类",
 "price": 0,
 "unit": "--"
 }
 ]
 }
 * */
exports.getProductClassify = function(req, res, next){
    // if (!req.body.parentId){
    //     http.sendData(res, eCode.ParamerError, '参数错误', null);
    //     return
    // }
    rpc.callXiaJServer(function(remote) {
        if (!req.body.parentId){
            remote.getProductClassify(function(err, data){
                if (err) {
                    http.sendData(res, eCode.UnkownError, '操作失败', null);
                }else{
                    http.sendData(res, 0,'操作成功',data);
                }
            });
        }else{
            remote.getProductClassify(req.body.parentId,function(err, data){
                if (err) {
                    http.sendData(res, eCode.UnkownError, '操作失败', null);
                }else{
                    http.sendData(res, 0,'操作成功',data);
                }
            });
        }


    });
}