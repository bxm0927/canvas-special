/**
 * 游戏主逻辑入口文件，处理主要逻辑
 */
var Main = {
	gameInfo : {w:0,h:0},//游戏画面大小
	cxt : null,//context  绘制图形的上下文对象
	person : null,
	timeQuene : null,//时间队列
	time : 0,
	leveltime : 0,//等级时间
	level : 0,//等级
	imgs : [],//图片
	blocks : [],//障碍物
	init : function(){//初始化

		Main.initStart();
	},
	initStart : function(){//初始化开始

		Main.initData();
	},
	initData : function(){//初始化数据
		
		WF.file.imgs(["img/man.png","img/block.png","img/move.png","img/thorn.png","img/flip.png","img/thorn_bg.png"],function(imgs){

			Main.imgs = imgs;
			
			var canvas = WF.getId("canvas");
		
			Main.gameInfo.w = canvas.offsetWidth;// 偏移宽度
			Main.gameInfo.h = canvas.offsetHeight;// 偏移高度
		
			Main.cxt = canvas.getContext("2d");//可以在页面绘制图形的对象

			/**
			 * 一般都是用display:none和display:block来控制层的显示
			 * 简单点说，block 显示DIV，none 隐藏DIV。
			 */
			WF.getId("js_start_loading").style.display="none";
			WF.getId("js_start_btn").style.display = "block";
		});
	},
	start : function(){//开始

		WF.getId("js_start_flush").style.display = "none";
		//初始化人物
		Main.person = new Person(150,0,Main.imgs[0],Main.cxt,Main.gameInfo);
		//初始化障碍物
		Main.initBlock(Main.imgs);
		//初始化事件
		Main.initEvent();
		//启动游戏，运行
		Main.process();
	},
	initBlock : function(imgs){//初始化障碍物

		BlockFactory.init({
			block : imgs[1],
			move : imgs[2],
			flip : imgs[4],
			thorn : imgs[3],
			cxt : Main.cxt,
			gameinfo : Main.gameInfo
		});

		var block = new NormalBlock(120,460,imgs[1],Main.cxt,Main.gameInfo);

		block.init();

		Main.blocks.push(block);
	},
	initEvent : function(){//初始化事件
		
		WF.getId("js_main").onkeydown = function(e){Main.keyDown(e);};
		WF.getId("js_main").onkeyup = function(e){Main.keyUp(e);};

	},
	keyDown : function(e){//按键按下

		if(e.keyCode == 37){
			
			this.person.changeDir("left");
		}
		if(e.keyCode == 39){
			
			this.person.changeDir("right");
		}
		
		e.preventDefault();//阻止按键
	},
	keyUp : function(e){//按键松开
		
		if(e.keyCode == 37 || e.keyCode == 39){
			
			this.person.changeDir("normal");
		}
		
		e.preventDefault();
	},
	process : function(){//游戏运行
		
		
		var tq = new WF.time.TimeProcess();

		tq.add(Main.draw,null,Main);
		tq.add(Main.update,null,Main);
		
		this.timeQuene = tq;//游戏时间进程
		this.timeQuene.start();
	},
	draw : function(){
		
		Main.cxt.clearRect(0,0,Main.gameInfo.w,Main.gameInfo.h);//清除图像

		Main.drawThornBg();//绘制荆棘（针刺）背景

		Main.person.draw();//绘制小人

		//绘制障碍物
		for(var i=0,l=Main.blocks.length;i<l;i++){

			if(!Main.blocks[i])continue;

			Main.blocks[i].draw();
		}
		
		//设置血量为小人的生命值
		WF.getId("js_life").style.width = Main.person.life + "px";
		//设置楼层
		WF.getId("js_level").innerHTML = Main.level;
	},
	drawThornBg : function(){//绘制荆棘（针刺）背景

		for(var i=0;i<=35;i++){
			//测试下  cxt.drawImage(image,8个参数)的方法 看下效果
			Main.cxt.drawImage(Main.imgs[5],0,0,18,21,i*9,0,9,11);
		}
	},
	update : function(){//更新
		
		
		//时间累加
		Main.time++;
		
		//更新级别
		if(Main.time >= 40){
			
			Main.blocks.push(BlockFactory.create());
			
			Main.time = 0;//时间
			Main.leveltime += 2;//级别时间

			//floor()是取小于一个数的最大整数，如Math.floor(4.6)为4。
			Main.level = Math.floor(Main.leveltime / 10);//级别
		}
		
		
		//小人更新
		Main.person.update();
		
		
		if(Main.person.isDead){

			Main.over();//游戏结束

			WF.getId("js_life").style.width = "0px";

			return false;
		}
		

		//障碍物更新
		for(var i=0,l=Main.blocks.length;i<l;i++){

			var block = Main.blocks[i];

			if(!block)continue;

			block.update();

			//检查障碍物是否超出地图 或者  障碍物销毁
			if(block.checkMap() || block.dismiss){
				//删除障碍物
				Main.removeBlock(block);

				i--;
				//障碍物销毁 同时 小人站在的障碍物不为空  
				if(block.dismiss && Main.person.block)Main.person.goDown();
				//障碍物为空
				block = null;

				continue;
			}
			//检查小人 是否在障碍物上
			if(Main.person.checkBlockOn(block)){}
		}

	},
	over : function(){
		
		//游戏时间进程停止
		this.timeQuene.stop();

		//显示游戏结束提示
		WF.getId("js_end_flush").style.display = "block";
		if(this.level >= 3){

			WF.getId("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你牛B呀,下了<label>"+this.level+"</label>层,男人中的男人呀！";
			WF.getId("js_end_flush").getElementsByTagName("a")[0].innerHTML = "想更男人一点";
			WF.getId("js_end_flush").getElementsByTagName("span")[0].className = "icon happy";
		}
		else{
			WF.getId("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你太菜了,才玩了<label>"+this.level+"</label>层,还不算真男人呀！";
			WF.getId("js_end_flush").getElementsByTagName("a")[0].innerHTML = "再来一次";
			WF.getId("js_end_flush").getElementsByTagName("span")[0].className = "icon";
		}

	},
	removeBlock : function(block){
		/**
		 * splice方法是怎样的？arr.splice(0,1);其中arr是个数组。不明白括号里的0和1代表什么意思？
		 * 替换0开始的长度为1的范围内的内容吧。
		 * 后面还需要第3个参数，如果没有第3个参数那就表示把 0,1 的内容替换成没有，自然也就是相当于删除了第0个元素。
		 */
		Main.blocks.splice(Main.blocks.indexOf(block),1);
	},
	replay : function(){

		Main.blocks = [];
		Main.time = 0;
		Main.leveltime = 0;
		Main.level = 0;
		Main.person.life = 100;

		Main.start();

		WF.getId("js_end_flush").style.display = "none";
	}

	
}
Main.init();

