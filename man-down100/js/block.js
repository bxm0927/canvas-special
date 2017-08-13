/**
 * 各种障碍物块的定义
 */
var BlockBase = function(x,y,img,cxt,panelInfo){//基础障碍物
	
	this.x = x;
	this.y = y;
	this.img = img;
	this.cxt = cxt;
	this.pinfo = panelInfo;
	
	this.yspeed = -4;
	
	this.sprite = null;

	this.dismiss = false;//障碍物消失
}
BlockBase.prototype = {
		
		init : function(){//初始化
			
			this.initSprite();
		},
		initSprite : function(){},//初始化精灵
		draw : function() {//绘制障碍物
			
			this.sprite.draw();
		},
		update : function(){//更新
			
			this.sprite.update();

			this.childUpdate();
		},
		childUpdate : function(){},//子更新
		checkMap : function(){//检查障碍物是否超出地图
			
			var size = this.sprite.size();
			
			if(size.y <= 0)return true;
			
			return false;
		},
		ManOn : function(man){},//人物在障碍物上
		size : function(){//障碍物大小

			return this.sprite.size();
		}
	}

var NormalBlock = function(x,y,img,cxt,panelInfo){//普通障碍物

	/**
	 * var a={name:"haha"};
		function b(){alert(this.name);}
		var test = function() { 
		     return b.apply(a,arguments); 
		   }; 
		test();
		
		this.name 打印结果为：haha
	 */
	BlockBase.apply(this,arguments);
}
NormalBlock.prototype = new BlockBase();

NormalBlock.prototype.initSprite = function(){//初始化普通障碍物

	var sprite = new WF.sprite.Sprite(this.img,this.cxt,1,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({sw:200,sh:32,width:100,height:16,dir:"down"}));
	
	this.sprite = sprite;
};
NormalBlock.prototype.ManOn = function(man){//人物在普通障碍物上

	man.changeSpeed(0,this.yspeed);
}


var MissBlock = function(x,y,img,cxt,panelInfo){//消失障碍物
	BlockBase.apply(this,arguments);

	this.restTime = 30;

	this.isStand = false;
}
MissBlock.prototype = new BlockBase();

MissBlock.prototype.initSprite = function(){//初始化 消失障碍物

	var sprite = new WF.sprite.Sprite(this.img,this.cxt,1,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({startY:32,sw:200,sh:32,width:100,height:16,dir:"down"}));
	
	this.sprite = sprite;
}
MissBlock.prototype.ManOn  = function(man){//人物在消失障碍物上

	man.changeSpeed(0,this.yspeed);

	this.isStand =  true;
}
MissBlock.prototype.childUpdate = function(){//消失障碍物 子更新(状态)

	//isStand 是否可以站立
	if(!this.isStand)return false;

	this.restTime--;//休息时间

	if(this.restTime <= 0){
		//障碍物销毁
		this.dismiss = true;
	}
}


var LeftBlock = function(x,y,img,cxt,panelInfo){//左滑障碍物
	BlockBase.apply(this,arguments);

	this.xforce = -4;
}
LeftBlock.prototype = new BlockBase();

LeftBlock.prototype.initSprite = function(){//初始化左滑障碍物
	var sprite = new WF.sprite.Sprite(this.img,this.cxt,5,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({sw:200,sh:32,width:100,height:16,dir:"down",fs:2,loop:true}));

	this.sprite = sprite;
}
LeftBlock.prototype.ManOn = function(man){//人物在左滑障碍物上

	man.changeSpeed(0,this.yspeed);

	man.setXForce(this.xforce);
}


var RightBlock = function(x,y,img,cxt,panelInfo){//右滑障碍物

	BlockBase.apply(this,arguments);

	this.xforce = 4;
}
RightBlock.prototype = new BlockBase();

RightBlock.prototype.initSprite = function(){//初始化 右滑障碍物
	var sprite = new WF.sprite.Sprite(this.img,this.cxt,5,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({startY:64,sw:200,sh:32,width:100,height:16,dir:"down",fs:2,loop:true}));

	this.sprite = sprite;
}
RightBlock.prototype.ManOn = function(man){//人物在右滑障碍物上

	man.changeSpeed(0,this.yspeed);

	man.setXForce(this.xforce);
}


var ThornBlock = function(x,y,img,cxt,panelInfo){//荆棘(针刺)障碍物

	BlockBase.apply(this,arguments);

	this.cut = 70;
}
ThornBlock.prototype = new BlockBase();

ThornBlock.prototype.initSprite = function(){//初始化荆棘(针刺)障碍物

	var sprite = new WF.sprite.Sprite(this.img,this.cxt,1,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({sw:200,sh:32,width:100,height:16,dir:"down"}));

	this.sprite = sprite;
}
ThornBlock.prototype.ManOn = function(man){//人物在荆棘(针刺)障碍物上

	man.cutLift(this.cut);

	man.changeSpeed(0,this.yspeed);
}


var FlipBlock = function(x,y,img,cxt,panelInfo){//弹跳障碍物

	BlockBase.apply(this,arguments);

	this.flipcount = 5;

	this.isStand = false;
}
FlipBlock.prototype = new BlockBase();

FlipBlock.prototype.initSprite = function(){//初始化弹跳障碍物

	var sprite = new WF.sprite.Sprite(this.img,this.cxt,1,{x:this.x,y:this.y,yspeed:this.yspeed});

	sprite.add("normal",new WF.sprite.Animation({sw:200,sh:32,width:100,height:16,dir:"down"}));
	sprite.add("down",new WF.sprite.Animation({startY:32,sw:200,sh:24,width:100,height:12,dir:"down"}));
	sprite.add("up",new WF.sprite.Animation({startY:56,sw:200,sh:43,width:100,height:22,dir:"down"}));

	this.sprite = sprite;
}
FlipBlock.prototype.changeDir = function(dir){//弹跳障碍物 改变方向

	var o_size = this.sprite.size();

	this.sprite.change(dir);

	var n_size = this.sprite.size();

	var y = (o_size.h - n_size.h) + o_size.y;

	this.sprite.move(o_size.x,y);
}
FlipBlock.prototype.ManOn = function(man){//人物在弹跳障碍物上 

	this.changeDir("down");

	man.changeSpeed(0,this.yspeed);

	this.isStand = true;

	man.goUp();
}
FlipBlock.prototype.childUpdate = function(){//弹跳障碍物 子更新(状态)
	
	//isStand 是否可以站立
	if(!this.isStand)return false;

	this.flipcount--;//弹跳次数减少

	if(this.flipcount <= 0){

		this.isStand = false;
		this.flipcount = 5;

		this.changeDir("up");
	}
}


var BlockFactory = {//障碍物制造工厂
	imgs : {
		"block":null,
		"move":null,
		"flip":null,
		"thorn":null
	},
	gameinfo : null,
	cxt : null,
	init : function(param){//初始化

		this.imgs.block = param.block;
		this.imgs.move = param.move;
		this.imgs.flip = param.flip;
		this.imgs.thorn = param.thorn;

		this.gameinfo = param.gameinfo;
		this.cxt = param.cxt;
	},
	create : function(){//创建
		//Math.random()是令系统随机选取0-13之间的14位的随机数
		var rnd = Math.floor(Math.random()*14);

		var rnd_x = Math.floor(Math.random()*224);

		var x = rnd_x;
		var y = 460;

		var block;

		switch(rnd){
			case 0:
			case 1:
			case 2:
				block = new NormalBlock(x,y,this.imgs.block,this.cxt,this.gameinfo);
				break;
			case 3:
			case 4:
				block = new MissBlock(x,y,this.imgs.block,this.cxt,this.gameinfo);
				break;
			case 5:
			case 6:
			case 7:
				block = new LeftBlock(x,y,this.imgs.move,this.cxt,this.gameinfo);
				break;
			case 8:
			case 9:
			case 10:
				block = new RightBlock(x,y,this.imgs.move,this.cxt,this.gameinfo);
				break;
			case 11:
			case 12:
				block = new FlipBlock(x,y,this.imgs.flip,this.cxt,this.gameinfo);
				break;
			case 13:
				block = new ThornBlock(x,y,this.imgs.thorn,this.cxt,this.gameinfo);
				break;
		}

		block.init();

		return block;
	}
}






