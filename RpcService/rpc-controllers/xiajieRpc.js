/**
 * Created by Moqizhan on 16/8/25.
 */
const logger = process.logger;
var db = require('../../public/mysqlUtils')(require('../configes/dbConfige'));

/*
 商品列表接口
 */
exports.homeProductList = function(callback){
    /*判断用户是否存在,存在则更新登录时间*/
    logger.info("homeProductList 收到请求");
    db.query('select * from t_xj_product',function(qerr,vals,fields){
        if (qerr || !vals){
            callback(qerr, null);
        }else{
            callback(null,vals);
        }

    });
}

/**
 * 查询商品分类
 * @param parentid
 * @param callback
 */
exports.productClassify = function (parentid, callback) {
    var sql;
    if (typeof parentid === 'function') {
        sql =  "select * from  t_xj_productClassify";
        callback = parentid;
    }else{
        sql = ["select * from  t_xj_productClassify where parent_id = ",
            parentid
        ].join('');
    }
    db.query(sql,function(qerr,vals,fields){
        if (qerr || !vals){
            callback(qerr, null);
        }else{
            callback(null,vals);
        }

    });
}