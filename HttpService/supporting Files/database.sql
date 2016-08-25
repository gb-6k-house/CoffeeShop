/*
创建用户
CREATE USER 'liukai'@'localhost' IDENTIFIED BY '123456';
CREATE USER 'liukai'@'%' IDENTIFIED BY '123456';
授权
 GRANT CREATE,SELECT,INSERT,UPDATE ON mysqlsample1.* TO 'liukai'@'%';
 GRANT CREATE,SELECT,INSERT,UPDATE ON mysqlsample1.* TO 'liukai'@'localhost';
*/


/*
 创建数据库 CREATE DATABASE `mysqlsample1` CHARACTER SET 'utf8' COLLATE 'utf8_general_ci'
*/

/*
  匿名信息表
*/
create table if not EXISTS t_anonymous(type INT not NULL,
name VARCHAR(255) not null);

/*
insert INTO t_anonymous(type,name) VALUES(1, '唐僧');
insert INTO t_anonymous(type,name) VALUES(1, '孙悟空');
insert INTO t_anonymous(type,name) VALUES(1, '猪八戒');
insert INTO t_anonymous(type,name) VALUES(1, '沙和尚');
insert INTO t_anonymous(type,name) VALUES(1, '如来佛');
insert INTO t_anonymous(type,name) VALUES(1, '观世音');
insert INTO t_anonymous(type,name) VALUES(1, '玉皇大帝');
*/
/*
用户登录信息表
*/
create table if not EXISTS t_user(longitude double not NULL,
latitude double not null,
IMEI VARCHAR(255) not null,
loginDate VARCHAR(80) not null
);

/*
用户消息列表
*/

create table if not EXISTS t_localation_msg(
	IMEI VARCHAR(255) not null,
        msg VARCHAR(255) ,
       date VARCHAR(80) not null, 
       longitude double not NULL,
       latitude double not null
);

/*
创建计算距离的函数
*/

drop function GetDistance;
delimiter $$ 
CREATE  FUNCTION GetDistance(lat1 DOUBLE,lng1 DOUBLE,lat2 DOUBLE,lng2 DOUBLE) 
RETURNS DOUBLE 
  /*earth_padius double := 6378.137;地球半径*/
BEGIN

 return  round(6378.137*2*asin(sqrt(pow(sin(
(lat1*pi()/180-lat2*pi()/180)/2),2)+cos(lat1*pi()/180)*cos(lat2*pi()/180)*
pow(sin( (lng1*pi()/180-lng2*pi()/180)/2),2)))*1000);
END$$

delimiter;

/*
*用户表增加登录平台，android, ios ,web 不区分大小写
*/
alter table t_user add platform varchar(88) default 'android';


/*
*霞姐饺子私厨，商品信息表

*/

create table if not EXISTS t_xj_product(
	id int  primary key  not null auto_increment,
    name VARCHAR(80),
    detail VARCHAR(255),
    price int,
    logoImage VARCHAR(255)
);
/*
*插入商品数据http://7xs6h1.com1.z0.glb.clouddn.com/3ac79f3df8dcd100472c0d0e748b4710b9122f69.jpg
*/
insert into t_xj_product(name,detail,price,logoImage) values('手工速冻饺子',
  '霞姐速冻饺子坚持选用绿色,新鲜的果蔬和肉类,地道、天然的调料和辅料,致力把产品做到原汁原味,坚决抵制和添加防腐剂、香精等添加剂。',
  0.0,
  '3ac79f3df8dcd100472c0d0e748b4710b9122f69.jpg');

/*
商品分类信息表
t_xj_productClassify
*/
create table if not EXISTS t_xj_productClassify(
    id  int not null, /*id*/
    level int,
	parent_id int  not null default -1,
    name VARCHAR(80),
    price int,
    unit VARCHAR(2)
);
/*饺子类*/
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(100,0,-1,'饺子类',0,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(101,1,100,'韭菜肉馅饺',400,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(102,1,100,'白菜肉馅饺',400,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(103,1,100,'芹菜肉馅饺',400,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(104,1,100,'香菜肉馅饺',400,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(105,1,100,'韭菜鸡蛋饺',400,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(106,1,100,'香菇肉馅饺',500,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(107,1,100,'大葱肉馅饺',500,'两');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(108,1,100,'牛肉馅饺',600,'两');
/*面食类*/

insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(200,0,-1,'面食类',0,'--');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(201,1,200,'葱油饼',500,'个');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(202,1,200,'甜饼',500,'个');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(203,1,200,'韭菜盒子',800,'个');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(204,1,200,'肉馅饼',1000,'个');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(205,1,200,'牛肉馅饼',1500,'个');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(206,1,200,'炸酱面',800,'碗');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(207,1,200,'青椒鸡蛋面',1200,'碗');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(208,1,200,'西红柿鸡蛋面',1200,'碗');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(209,1,200,'青椒牛肉面',1500,'碗');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(210,1,200,'青椒肉炒面',1500,'碗');
insert into t_xj_productClassify(id,level,parent_id,name,price,unit) values(211,1,200,'牛肉炒面',2000,'碗');

/*
插入饺子分类
*/


commit;


