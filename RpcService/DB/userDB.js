var promise = require("bluebird");
var db = require("./db");

function getPersonalInfo (openid)
{
	return db.table.read("user", openid, "personal_info").then ((info)=>
	{
		console.log ("personal info is " + info + "|" + typeof info);
		if (info === null || typeof info === "undefined")
		{
			console.log("======== personal info is null");
			return null;
		}
		else
		{
			console.log("==========Personal info is not null: " + info);
			return JSON.parse(info);
		}
	}).catch ((err)=>{
		error("[Error] User getPersonalInfo Fail, error is "+ err);
		return -1;
	});
}

function addPersonalInfo (openid, personalInfo)
{
	return db.table.read("user", openid, "personal_info").then ((info)=>{
		if (info === null || typeof info === "undefined")
		{
			return db.table.write ("user", openid, "personal_info", JSON.stringify(personalInfo)).then(()=>{
				return 1;
			});
		}
		else
		{
			error ("[Error] User addPersonalInfo Fail, user already have data");
			return 0;
		}
	});
}

function changePersonalInfo (openid, personalInfo)
{
	return db.table.read("user", openid, "personal_info").then ((info)=>{
		if (info != null || typeof info === "undefined")
		{
			return db.table.write ("user", openid, "personal_info", JSON.stringify(personalInfo)).then(()=>{
				return 1;
			});
		}
		else
		{
			error ("[Error] User changePersonalInfo Fail, user don't have data");
			return 0;
		}
	});
}

module.exports = {
	GetPersonalInfo : function (openid)
	{
		if (openid == null)
		{
			error ("[Error] User GetPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		return getPersonalInfo(openid);
	},

	AddPersonalInfo : function (openid, personalInfo)
	{
		if (openid == null)
		{
			error ("[Error] User AddPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (personalInfo == null)
		{
			error ("[Error] User AddPersonalInfo Fail, PersonalInfo is Empty");
			return promise.resolve(-2);
		}

		return addPersonalInfo (openid, personalInfo).then((result) =>
		{
			switch (result)
			{
				case 1:
					return 1;
				case 0:
					{
						error ("[Error] User AddPersonalInfo Fail, addPersonalInfo Error");
						return 0;
					}
			}
		});
	},

	ChangePersonalInfo : function (openid, personalInfo)
	{
		if (openid == null)
		{
			error ("[Error] User AddPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (personalInfo == null)
		{
			error ("[Error] User AddPersonalInfo Fail, PersonalInfo is Empty");
			return promise.resolve(-2);
		}

		return changePersonalInfo (openid, personalInfo);
	},
};
