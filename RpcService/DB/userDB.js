var promise = require("bluebird");
var db = require("./db");
const logger = process.logger;

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
		logger.error("[Error] User getPersonalInfo Fail, logger.error is "+ err);
		return -1;
	});
}

function addPersonalInfo (openid, personalInfo)
{

	return db.table.write ("user", openid, "personal_info", JSON.stringify(personalInfo)).then(()=>{
		return 1;
	});
	
	// return db.table.read("user", openid, "personal_info").then ((info)=>{
    //
	// 	if (info === null || typeof info === "undefined")
	// 	{
	// 		return db.table.write ("user", openid, "personal_info", JSON.stringify(personalInfo)).then(()=>{
	// 			return 1;
	// 		});
	// 	}
	// 	else
	// 	{
	// 		logger.info (" User addPersonalInfo Fail, user already have data");
	// 		return 1;
	// 	}
	// });
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
			logger.error ("[Error] User changePersonalInfo Fail, user don't have data");
			return 0;
		}
	});
}

module.exports = {
	GetPersonalInfo : function (openid)
	{
		if (openid == null)
		{
			logger.error ("[Error] User GetPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		return getPersonalInfo(openid);
	},

	AddPersonalInfo : function (openid, personalInfo)
	{
		if (openid == null)
		{
			logger.error ("[Error] User AddPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (personalInfo == null)
		{
			logger.error ("[Error] User AddPersonalInfo Fail, PersonalInfo is Empty");
			return promise.resolve(-2);
		}

		return addPersonalInfo (openid, personalInfo).then((result) =>
		{
			switch (result)
			{
				case 0,1:
					return 1;
				default :
					{
						logger.error ("[Error] User AddPersonalInfo Fail, addPersonalInfo Error");
						return 0;
					}
			}
		});
	},

	ChangePersonalInfo : function (openid, personalInfo)
	{
		if (openid == null)
		{
			logger.error ("[Error] User AddPersonalInfo Fail, openid is empty");
			return promise.resolve(-1);
		}

		if (personalInfo == null)
		{
			logger.error ("[Error] User AddPersonalInfo Fail, PersonalInfo is Empty");
			return promise.resolve(-2);
		}

		return changePersonalInfo (openid, personalInfo);
	},
};
