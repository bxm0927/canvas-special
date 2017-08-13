
var Stage = function(context,l){
	this.ctx = context;
	this.ctx.fillStyle = "#7f7f7f";
	this.drawHeigth = 15;
	this.level = l;
	this.temp = 0;
	this.dir = 1; //中间切换的方向，1：合上，2：展开
	this.isReady = false;//标识地图是否已经画好
	this.levelNum = new Num(context);
	
	this.init = function(level){
		this.dir = 1;
		this.isReady = false;
		this.level = level;
		this.temp = 0;
	};
	
	this.draw = function(){
		if(this.dir == 1){
			
			//temp = 15*15 灰色屏幕已经画完
			if(this.temp == 225){
				//78,14为STAGE字样在图片资源中的宽和高，194,208为canvas中的位置
				this.ctx.drawImage(RESOURCE_IMAGE, POS["stageLevel"][0], POS["stageLevel"][1], 78, 14, 194, 208, 78, 14);
				//14为数字的宽和高，308, 208为canvas中的位置
				this.levelNum.draw(this.level,308, 208);
				//this.ctx.drawImage(RESOURCE_IMAGE,POS["num"][0]+this.level*14,POS["num"][1],14, 14,308, 208,14, 14);
				//绘制地图,调用main里面的方法
				initMap();
				
			}else if(this.temp == 225 + 600){
				//600即调用了600/15次，主要用来停顿
				this.temp = 225;
				this.dir = -1;
				START_AUDIO.play(); 
			}else{
				this.ctx.fillRect(0, this.temp, 512, this.drawHeigth);
				this.ctx.fillRect(0, 448 - this.temp - this.drawHeigth , 512, this.drawHeigth);
			}
		}else{
			if(this.temp >= 0){
				this.ctx.clearRect(0, this.temp , 512, this.drawHeigth);
				this.ctx.clearRect(0, 448 - this.temp - this.drawHeigth, 512, this.drawHeigth);
			}else{
				this.isReady = true;
			}
		}
		this.temp += this.drawHeigth * this.dir;
	};
};