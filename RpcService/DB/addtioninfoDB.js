let error = require ("../error");
let promise = require("bluebird");
let db = require("../db/db");

function getAddtionInfo (openid)
{
	return db.table.read("user", openid, "addtion_info").then ((info)=>
	{
		console.log ("addtion info is " + info + "|" + typeof info);
		if (info === null || typeof info === "undefined")
		{
			console.log("======== addtion info is null");
			return null;
		}
		else
		{
			console.log("==========Personal info is not null: " + info);
			return JSON.parse(info);
		}
	}).catch ((err)=>{
		error("[Error] User getAddtionInfo Fail, error is "+ err);
		return -1;
	});
}

function addAddtionInfo (openid, addtionInfo)
{
	return db.table.read("user", openid, "addtion_info").then ((info)=>{
		// if (info === null || typeof info === "undefined")
		{
			return db.table.write ("user", openid, "addtion_info", JSON.stringify(addtionInfo)).then(()=>{
				return 1;
			});
		}
		/*else
		{
			error ("[Error] User addAddtionInfo Fail, user already have data");
			return 0;
		}*/
	});
}

function changeAddtionInfo (openid, addtionInfo)
{
	return db.table.read("user", openid, "addtion_info").then ((info)=>{
		if (info != null || typeof info === "undefined")
		{
			return db.table.write ("user", openid, "addtion_info", JSON.stringify(addtionInfo)).then(()=>{
				return 1;
			});
		}
		else
		{
			error ("[Error] User changeAddtionInfo Fail, user don't have data");
			return 0;
		}
	});
}

module.exports = {
	GetAddtionInfo : function (openid)
	{
		if (openid == null)
		{
			error ("[Error] User GetAddtionInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		return getAddtionInfo(openid);
	},

	AddAddtionInfo : function (openid, addtionInfo)
	{
		if (openid == null)
		{
			error ("[Error] User AddAddtionInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (addtionInfo == null)
		{
			error ("[Error] User AddAddtionInfo Fail, AddtionInfo is Empty");
			return promise.resolve(-2);
		}

		return addAddtionInfo (openid, addtionInfo).then((result) =>
		{
			switch (result)
			{
				case 1:
					return 1;
				case 0:
					{
						error ("[Error] User AddAddtionInfo Fail, addAddtionInfo Error");
						return 0;
					}
			}
		});
	},

	ChangeAddtionInfo : function (openid, addtionInfo)
	{
		if (openid == null)
		{
			error ("[Error] User AddAddtionInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (addtionInfo == null)
		{
			error ("[Error] User AddAddtionInfo Fail, AddtionInfo is Empty");
			return promise.resolve(-2);
		}

		return changeAddtionInfo (openid, addtionInfo);
	},
};
