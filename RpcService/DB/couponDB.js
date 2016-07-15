let error = require("../error");
let promise = require("bluebird");
let db = require("../db/db");
let md5 = require("../thirdparty/md5");

function create(openid)
{
	return db.kv.plus("code", "max", 1).then((code)=>
	{
		code = code.toString();
		let len = code.length;
		if (len > 6)
			code = "000000";
		while (len < 6)
		{
			code = "0"+code;
			++len;
		}

		let result = md5("moou" + code);
		result = parseInt(result.substring(result.length - 6), 16) % 1000000;
		result = result.toString();
		while (result.length < 6)
		{
			result = "0" + result;
		}
		let s = "";
		for (let i = 0; i < 6; ++i)
		{
			s = s + result[i] + code[i];
		}

		return s;
	}).then((code) =>
	{
		let getcode = code;
		return promise.all([
			db.kv.write("code", code, 0),
			db.table.write("user", openid, "code", code)
		]).then((code)=>
		{
			return getcode;
		}).catch((err)=>{
			error("[Error]" + err);
			return -1;
		});
	});
}

function get(openid)
{
	// 1. 数据库中是否存在
	return db.table.read("user", openid, "code").then((code)=>
	{
		let getcode;
		if (code === null || typeof code === "undefined")
		{
			// 2.如果没有，创建，然后返回
			getcode = create(openid);
		}
		else
		{
			// 2.如果有，返回
			getcode = promise.resolve(code);
			// getcode = code;
		}

		console.log("getcode " + getcode);
		return getcode;
	}).catch ((err)=>	
	{
		error ("[Error]" + err);
		return -1;
	});
}

function check (code)
{
	return db.kv.read("code", code).then((lottery) => {
		if (lottery == null)
			return -1;	// 不存在
		if (parseInt(lottery) > 0)
			return 0;	// 该优惠卷已使用

		return db.kv.plus("code", code, 15).then(() =>{
			return 1;
		});
	});
}

module.exports = {
	Get : function (openid)
	{
		if (openid == null)
		{
			error ("[Error] Coupon Get Fail, openid is empty");
			return promise.resolve(-1);
		}
		else
			return get(openid);
	},

	Check : function (code)
	{
		if (code == null)
		{
			error ("[Error] Coupon Check Fail, code is empty");
			return promise.resolve(-1);
		}
		else
		{
			return check (code).then((ret)=>{
				console.log("logic: code " + code + "| ret:" + ret);
				switch (ret)
				{
					case 1:
						return 1;
					case 0:
						return 0;
					case -1:
						return -2;
				};
			});
		}
	}
};
