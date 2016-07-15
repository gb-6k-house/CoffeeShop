/**
 * Created by niupark on 16/7/8.
 */
var _settings = require('node-weixin-settings');
var auth = require('node-weixin-auth');

var settingsConf = {
};


function get(id, key, next) {
    if (!next instanceof Function) {
        throw new Error();
    }

    if (settingsConf[id] && settingsConf[id][key]) {
        return next(settingsConf[id][key]);
    }

    return next(null);
}

function set(id, key, value, next) {
    if (!next instanceof Function) {
        throw new Error();
    }
    if (!settingsConf[id]) {
        settingsConf[id] = {};
    }
    settingsConf[id][key] = value;
    next();
}

function all(id, next) {
    if (!next instanceof Function) {
        throw new Error();
    }
    if (!settingsConf[id]) {
        settingsConf[id] = {};
    }
    next(settingsConf[id]);
}

_settings.registerSet(set);
_settings.registerGet(get);
_settings.registerAll(all);
console.log("weixin setting regiset finish");


module.exports = _settings;