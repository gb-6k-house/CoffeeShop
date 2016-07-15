/**
 * Created by libla on 2015/12/28.
 */

'use strict';

let promise = require("bluebird");
let ssdb = require("ssdb");

let prefix = ['@0', '@1', '@2', '@3', '@4', '@5', '@6', '@7', '@8', '@9', '@A', '@B', '@C', '@D', '@E', '@F'];

function packIndex(index)
{
	let type = typeof index;
	if (type === "string")
		return '#' + index;
	if (type === "number")
	{
		index = index.toString(16);
		return prefix[index.length] + index;
	}
	let list = new Array(index.length);
	for (let i = 0; i < index.length; ++i)
	{
		list.push(packIndex(index[i]));
	}
	return list.join(",");
}

function unpackIndex(index)
{
	if (index.indexOf(",") === -1)
	{
		if (index.charAt(0) === "@")
			return parseInt(index.substring(2), 16);
		return index.substring(1);
	}
	let list = index.split(",");
	for (let i = 0; i < list.length; ++i)
	{
		list[i] = unpackIndex(list[i]);
	}
	return list;
}

let pool = null;

let kv = {
	write: function(name, index, value)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().getset([name, index].join("|"), value, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	plus: function(name, index, value)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().incr([name, index].join("|"), value, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	remove: function(name, index)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().del([name, index].join("|"), (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	read: function(name, index)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().get([name, index].join("|"), (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	scan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().scan(start, name + "||", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length - 1; i += 2)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i].substring(name.length + 1)), data[i + 1], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count * 2)
						return resolve();
					return once(data[data.length - 2], limit > 0 ? limit - count : limit);
				});
			};
			once(name + "|", limit);
		});
	},
	rscan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().rscan(start, name + "|", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length - 1; i += 2)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i].substring(name.length + 1)), data[i + 1], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count * 2)
						return resolve();
					return once(data[data.length - 2], limit > 0 ? limit - count : limit);
				});
			};
			once(name + "||", limit);
		});
	}
};

let table = {
	write: function(name, index, field, value)
	{
		index = packIndex(index);
		if (value != null)
		{
			return new promise((resolve, reject)=>
			{
				pool.acquire().hset([name, index].join("|"), field, value, (err)=>
				{
					if (err)
						return reject(err);
					return resolve();
				});
			});
		}
		value = field;
		return new promise((resolve, reject)=>
		{
			let list = [];
			list.push([name, index].join("|"));
			for (let k in value)
			{
				if (value.hasOwnProperty(k))
				{
					let type = typeof value[k];
					if (type === "string" || type === "number")
					{
						list.push(k);
						list.push(value[k]);
					}
				}
			}
			list.push((err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
			pool.acquire().multi_hset.apply(pool, list);
		});
	},
	plus: function(name, index, field, value)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().hincr([name, index].join("|"), field, value, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	remove: function(name, index)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().hclear([name, index].join("|"), (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	read: function(name, index, field)
	{
		index = packIndex(index);
		if (field != null)
		{
			let type = typeof field;
			if (type === "string" || type === "number")
			{
				return new promise((resolve, reject)=>
				{
					pool.acquire().hget([name, index].join("|"), field, (err, data)=>
					{
						if (err)
							return reject(err);
						return resolve(data);
					});
				});
			}
			return new promise((resolve, reject)=>
			{
				let list = [];
				list.push([name, index].join("|"));
				for (let i = 0; i < field.length; ++i)
				{
					list.push(field[i]);
				}
				list.push((err, data)=>
				{
					if (err)
						return reject(err);
					let value = {};
					if (data)
					{
						for (let i = 0; i < data.length; i += 2)
						{
							value[data[i]] = data[i + 1];
						}
					}
					return resolve(value);
				});
				pool.acquire().multi_hget.apply(pool, list);
			});
		}
		return new promise((resolve, reject)=>
		{
			pool.acquire().hscan([name, index].join("|"), "", "", -1, (err, data)=>
			{
				if (err)
					return reject(err);
				let value = {};
				if (data)
				{
					for (let i = 0; i < data.length; i += 2)
						value[data[i]] = data[i + 1];
				}
				return resolve(value);
			});
		});
	},
	scan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().hlist(start, name + "||", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length; ++i)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i].substring(name.length + 1)), skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count)
						return resolve();
					return once(data[data.length - 1], limit > 0 ? limit - count : limit);
				});
			};
			once(name + "|", limit);
		});
	},
	rscan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().hrlist(start, name + "|", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length; ++i)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i].substring(name.length + 1)), skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count)
						return resolve();
					return once(data[data.length - 1], limit > 0 ? limit - count : limit);
				});
			};
			once(name + "||", limit);
		});
	}
};

let list = {
	insert: function(name, index, value)
	{
		if (value == null)
			value = index;
		else
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().hset(name, value, 0, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	remove: function(name, index, value)
	{
		if (value == null)
			value = index;
		else
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().hdel(name, value, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	clear: function(name, index)
	{
		if (index != null)
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().hclear(name, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	exist: function(name, index, value)
	{
		if (value == null)
			value = index;
		else
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().hget(name, value, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data != null);
			});
		});
	},
	scan: function(name, index, action)
	{
		if (action == null)
			action = index;
		else
			name = [name, packIndex(index)].join("|");
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start)=>
			{
				let count = 100;
				pool.acquire().hkeys(name, start, "", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length; ++i)
					{
						if (skiped)
							break;
						try
						{
							action(data[i], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count)
						return resolve();
					return once(data[data.length - 1]);
				});
			};
			once("");
		});
	},
	rscan: function(name, index, action)
	{
		if (action == null)
			action = index;
		else
			name = [name, packIndex(index)].join("|");
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (start)=>
			{
				let count = 100;
				pool.acquire().hrscan(name, start, "", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length - 1; i += 2)
					{
						if (skiped)
							break;
						try
						{
							action(data[i], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count * 2)
						return resolve();
					return once(data[data.length - 2]);
				});
			};
			once("");
		});
	}
};

let sortlist = {
	write: function(name, index, value)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().zset(name, index, value, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	plus: function(name, index, value)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().zincr(name, index, value, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	remove: function(name, index)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().zdel(name, index, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	read: function(name, index)
	{
		index = packIndex(index);
		return new promise((resolve, reject)=>
		{
			pool.acquire().zget(name, index, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	first: function(name, limit)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().zrange(name, 0, limit, (err, data)=>
			{
				if (err)
					return reject(err);
				let value = [];
				for (let i = 0; i < data.length - 1; i += 2)
				{
					value.push([unpackIndex(data[i]), data[i + 1]]);
				}
				return resolve(value);
			});
		});
	},
	last: function(name, limit)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().zrrange(name, 0, limit, (err, data)=>
			{
				if (err)
					return reject(err);
				let value = [];
				for (let i = 0; i < data.length - 1; i += 2)
				{
					value.push([unpackIndex(data[i]), data[i + 1]]);
				}
				return resolve(value);
			});
		});
	},
	scan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (key, start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().zscan(name, key, start, "", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length - 1; i += 2)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i]), data[i + 1], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count * 2)
						return resolve();
					return once(data[data.length - 2], data[data.length - 1], limit > 0 ? limit - count : limit);
				});
			};
			once("", "", limit);
		});
	},
	rscan: function(name, limit, action)
	{
		if (action == null)
		{
			action = limit;
			limit = -1;
		}
		let skiped = false;
		let skip = ()=>
		{
			skiped = true;
		};
		return new promise((resolve, reject)=>
		{
			let once = (key, start, limit)=>
			{
				if (limit === 0)
					return resolve();
				let count = 100;
				if (limit > 0 && count > limit)
					count = limit;
				pool.acquire().zrscan(name, key, start, "", count, (err, data)=>
				{
					if (err)
						return reject(err);
					for (let i = 0; i < data.length - 1; i += 2)
					{
						if (skiped)
							break;
						try
						{
							action(unpackIndex(data[i]), data[i + 1], skip);
						}
						catch (e)
						{
							return reject(e);
						}
					}
					if (skiped || data.length !== count * 2)
						return resolve();
					return once(data[data.length - 2], data[data.length - 1], limit > 0 ? limit - count : limit);
				});
			};
			once("", "", limit);
		});
	}
};

let queue = {
	push: function(name, ...args)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().qpush_back(name, ...args, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	pop: function(name, size)
	{
		if (size == null)
			size = 1;
		return new promise((resolve, reject)=>
		{
			pool.acquire().qpop_front(name, size, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	remove: function(name, size)
	{
		if (size == null)
			size = 1;
		return new promise((resolve, reject)=>
		{
			pool.acquire().qtrim_front(name, size, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	top: function(name)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().qfront(name, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	size: function(name)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().qsize(name, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	clear: function(name)
	{
		return new promise((resolve, reject)=>
		{
			pool.acquire().qclear(name, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	}
};

module.exports = {
	kv: kv,
	table: table,
	list: list,
	sortlist: sortlist,
	queue: queue,
	raw: function(cmd, ...args)
	{
		return new promise((resolve, reject)=>
		{
			pool[cmd](...args, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data);
			});
		});
	},
	lock: function(name, index)
	{
		if (index != null)
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().setnx(name, 1, (err, data)=>
			{
				if (err)
					return reject(err);
				return resolve(data !== 0);
			});
		});
	},
	unlock: function(name, index)
	{
		if (index != null)
			name = [name, packIndex(index)].join("|");
		return new promise((resolve, reject)=>
		{
			pool.acquire().del(name, (err)=>
			{
				if (err)
					return reject(err);
				return resolve();
			});
		});
	},
	init: function(option) {
		if (pool)
			pool.destroy();
		option = option || {};
		pool = ssdb.createPool({
			host: option.host,
			port: option.port,
			auth: option.auth,
			size: 16
		});

	}
	
		
	
};
