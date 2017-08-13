/**
 * 人物的定义
 */
var Person = function(x,y,img,cxt,panelInfo) {
	
	this.x = x;
	this.y = y;
	this.img = img;
	this.cxt = cxt;
	this.pinfo = panelInfo;//游戏窗口面板
	
	this.xspeed = 7;//x轴加速度
	this.yspeed = 5;//y轴加速度

	this.yaspeed = 0.2;//y轴 加速度 增量

	this.life = 10;//血量

	this.lifeAdd = 0.5;//血量增加幅度
	
	this.dir = "down";//方向

	this.lastKey = "";//最后按键
	
	this.sprite = null;//精灵

	this.isJump = true;//是否跳起

	this.isFilp = false;//是否在弹簧障碍物 上 弹起

	this.block = null;//障碍物

	this.isDead = false;//是否死亡
	
	this.init();//初始化
}
Person.prototype = {
		init : function(){//初始化
			
			this.initSprite();

			this.sprite.setYSpeed(this.yspeed,this.yaspeed);
		},
		initSprite : function(){//初始化精灵
			
			var sprite = new WF.sprite.Sprite(this.img,this.cxt,10,{x:this.x,y:this.y});
			
			sprite.add("down",new WF.sprite.Animation({startX:64,sw:64,sh:64,width:32,height:32}));
			sprite.add("normal",new WF.sprite.Animation({sw:64,sh:64,width:32,height:32}));
			sprite.add("up",new WF.sprite.Animation({startX:128,sw:64,sh:64,width:32,height:32}));
			sprite.add("right",new WF.sprite.Animation({startX:320,fs:2,sw:64,sh:64,width:32,height:32,loop:true}));
			sprite.add("left",new WF.sprite.Animation({startX:192,fs:2,sw:64,sh:64,width:32,height:32,loop:true}));
			
			this.sprite = sprite;
		},
		changeDir : function(dir,flag){//改变方向

			this.lastKey = dir;
				
			if(this.isDead)return false;

			if(dir == this.dir && (dir=="left" || dir=="right"))return false;

			if(this.isJump == false || dir == "down" || dir == "up"){

				this.dir = dir;
			
				this.sprite.change(this.dir);
			}

			var xforce = this.block?this.block.xforce||0:0;//x轴 障碍物 推动力
			
			//根据方向 设置x轴 加速度
			if(dir == "left")this.sprite.setXSpeed(this.xspeed*-1 + xforce);
			else if(dir == "right")this.sprite.setXSpeed(this.xspeed + xforce);
			else if(dir == "normal" && !flag) this.sprite.setXSpeed(xforce);
		},
		draw : function(){//绘制 精灵
			
			this.sprite.draw();
		},
		update : function(){//更新
			//改变加速度
			this.sprite.update();
			
			
			//更新血量
			this.life += this.lifeAdd;
			if(this.life >= 100)this.life = 100;
			
//			alert("1");
			
			//判断边界值(小人 x轴位置 0px - 320px)
			var f_size = this.size();
			
//			alert("2");
			
			var x = f_size.x;
			var y = f_size.y;
			
			//小人 超出左边界
			if(x <= 0)x = 0;
			//小人 超出右边界
			if(f_size.r >= this.pinfo.w)x = this.pinfo.w - f_size.w;

			
			
			//小人 超出下边界 同时处于跳跃状态
			if(f_size.b >= this.pinfo.h && this.isJump==true){
				//小人 y轴位置
				y = this.pinfo.h - f_size.h;
				
				//死亡
				this.dead();
			}

			//小人 超出上边界
			if(f_size.y <= 0)this.dead();

			//判断是否离开方块
			if(this.block){

				var b_size = this.block.size();
				//离开障碍物
				if(f_size.r <= b_size.x || f_size.x >= b_size.r){

					this.goDown();
				}
			}
			
			//离开弹簧障碍物 同时 y轴加速度>0
			if(this.isFilp && this.sprite.yspeed >= 0){

				this.goDown();
			}
			//小人移动
			this.move(x,y);
		},
		dead : function(){//死亡

			this.sprite.setXSpeed(0);
			this.sprite.setYSpeed(0);

			this.changeDir("normal");

			this.isDead = true;
		},
		goDown : function(){//正在向下
			//方向正常、x轴加速度为0
			if(this.dir == "normal")this.sprite.setXSpeed(0);
			//y轴加速度 随着y轴增量 -> 增加
			this.sprite.setYSpeed(this.yspeed,this.yaspeed);
			this.changeDir("down");
			this.isJump = true;
			this.isFilp = false;

			this.block = null;//无障碍物
		},
		goUp : function(){//正在向上

			this.changeDir("up");

			this.isJump = true;//处于跳跃

			this.isFilp = true;//在弹簧障碍物上 跳起

			this.block = null;//无障碍物
			
			//y轴加速度, y轴加速度增量
			this.sprite.setYSpeed(this.yspeed*-2,0.4);
		},
		move : function(x,y){//移动

			this.sprite.move(x,y);
		},
		checkBlockOn : function(block){//检查是否在障碍物上

			if(!this.isJump)return false;

			var m_size = this.size();
			var b_size = block.sprite.size();

			if(m_size.r > b_size.x && m_size.x < b_size.r){

				if(m_size.b >= b_size.y && m_size.b <= b_size.b +4){

					this.standBlock(m_size.x,b_size.y-m_size.h);

					this.block = block;

					block.ManOn(this);

					return true;
				}
			}

			return false;
		},
		standBlock : function(x,y){//位于障碍物上

			this.move(x,y);

			this.isJump = false;

			if(this.lastKey == "left" || this.lastKey == "right"){
				this.changeDir(this.lastKey);
			}else{
				this.changeDir("normal",true);
			}
		},
		changeSpeed : function(xspeed,yspeed){//改变加速度

			if(xspeed)this.sprite.setXSpeed(xspeed);
			if(yspeed)this.sprite.setYSpeed(yspeed);
		},
		setXForce : function(xforce){//设置x轴 推动力

			if(this.dir == "left"){
				this.sprite.setXSpeed(this.xspeed * -1 + xforce);
			}
			else if(this.dir == "right"){
				this.sprite.setXSpeed(this.xspeed + xforce);
			}
			else if(this.dir == "normal"){
				this.sprite.setXSpeed(xforce);
			}
		},
		cutLift : function(cut){//缩减生命值

			this.life -= cut;

			if(this.life <= 0)this.dead();
		},
		size : function(){//小人大小
			
			return this.sprite.size();
		}
	}



