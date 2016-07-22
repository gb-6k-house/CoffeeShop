/**
 * Created by niupark on 16/2/19.
 */
'use strict';

const DNode = require('dnode');
const confige = require('../configes/confige');
const logger = process.logger;

exports.call = function (f) {
    try {
        DNode.connect(confige.rpchost.ip,confige.rpchost.port, function (remote) {
            f(remote);
        });
    } catch (e) {
        logger.error(e);
    }

}

exports.callWX = function (f) {
    try {

        DNode.connect(confige.wxrpchost.ip,confige.wxrpchost.port, function (remote) {
            f(remote);
        });
    } catch (e) {
        logger.error(e);
    }
}
exports.callCoffeShop = function (f) {
    try {

        DNode.connect(confige.coffeeShopchost.ip,confige.coffeeShopchost.port, function (remote) {
            f(remote);
        });
    } catch (e) {
        logger.error(e);
    }
}
