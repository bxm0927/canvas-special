
var Map = function(wCtx,gCtx){
	this.level = 1;
	this.mapLevel = null; 
	this.wallCtx = wCtx;
	this.grassCtx = gCtx;
	
	this.offsetX = 32; //主游戏区的X偏移量
	this.offsetY = 16;//主游戏区的Y偏移量
	this.wTileCount = 26; //主游戏区的宽度地图块数
	this.HTileCount = 26;//主游戏区的高度地图块数
	this.tileSize = 16;	//地图块的大小
	this.homeSize = 32; //家图标的大小
	this.num = new Num(this.wallCtx);
	this.mapWidth = 416;
	this.mapHeight = 416;
	
	this.setMapLevel = function(level){
		this.level = level;
		var tempMap = eval("map"+this.level);
		this.mapLevel = new Array();
		for(var i=0;i<tempMap.length;i++){
			this.mapLevel[i] = new Array();
			for(var j=0;j<tempMap[i].length;j++){
				this.mapLevel[i][j] = tempMap[i][j];
			}
			
		}
	};
	
	/**
	 * 绘制地图
	 */
	this.draw = function(){
		this.wallCtx.fillStyle = "#7f7f7f";
		this.wallCtx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		this.wallCtx.fillStyle = "#000";
		this.wallCtx.fillRect(this.offsetX,this.offsetY,this.mapWidth,this.mapHeight);//主游戏区

		this.grassCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
		
		for(var i=0;i<this.HTileCount;i++){
			for(var j=0;j<this.wTileCount;j++){
				if(this.mapLevel[i][j] == WALL || this.mapLevel[i][j] == GRID || this.mapLevel[i][j] == WATER || this.mapLevel[i][j] == ICE){
					this.wallCtx.drawImage(RESOURCE_IMAGE,this.tileSize*(this.mapLevel[i][j]-1) + POS["map"][0], POS["map"][1],this.tileSize,this.tileSize,j*this.tileSize + this.offsetX, i*this.tileSize + this.offsetY,this.tileSize,this.tileSize) ;
				}else if(this.mapLevel[i][j] == GRASS){
					this.grassCtx.drawImage(RESOURCE_IMAGE,this.tileSize*(this.mapLevel[i][j]-1) + POS["map"][0], POS["map"][1],this.tileSize,this.tileSize,j*this.tileSize + this.offsetX, i*this.tileSize + this.offsetY,this.tileSize,this.tileSize);
				}else if(this.mapLevel[i][j] == HOME){
					this.wallCtx.drawImage(RESOURCE_IMAGE,POS["home"][0], POS["home"][1], this.homeSize, this.homeSize, j*this.tileSize + this.offsetX, i*this.tileSize + this.offsetY, this.homeSize, this.homeSize) ;
				}
			}
		}
		this.drawNoChange();
		this.drawEnemyNum(maxEnemy);
		this.drawLevel();
		this.drawLives(0,1);
		this.drawLives(0,2);
	};
	
	/**
	 * 画固定不变的部分
	 */
	this.drawNoChange = function(){
		this.wallCtx.drawImage(RESOURCE_IMAGE, POS["score"][0], POS["score"][1], 30, 32, 464, 256, 30, 32);//player1
		
		this.wallCtx.drawImage(RESOURCE_IMAGE, 30 + POS["score"][0], POS["score"][1], 30, 32, 464, 304, 30, 32);//player2
		//30,32旗帜的size, 464, 352旗帜在canvas中位置
		this.wallCtx.drawImage(RESOURCE_IMAGE, 60 + POS["score"][0], POS["score"][1], 30, 32, 464, 352, 32, 30);//画旗帜
	};
	
	/**
	 * 画关卡数
	 */
	this.drawLevel = function(){
		this.num.draw(this.level,468, 384);
	};
	
	/**
	 * 画右侧敌方坦克数
	 * @param enemyNum 地方坦克总数
	 */
	this.drawEnemyNum = function(enemyNum){
		var x = 466;
		var y = 34;
		var enemySize = 16;
		for(var i=1;i<=enemyNum;i++){
			var tempX = x;
			var tempY = y + parseInt((i+1)/2)*enemySize;
			if(i%2 == 0){
				tempX = x  + enemySize;
			}
			this.wallCtx.drawImage(RESOURCE_IMAGE,92 + POS["score"][0],POS["score"][1],14, 14,tempX, tempY,14, 14);
		}
	};
	
	/**
	 * 清除右侧敌方坦克数，从最下面开始清楚
	 * @param totolEnemyNum 敌方坦克的总数
	 * @param enemyNum 已出现的敌方坦克数
	 */
	this.clearEnemyNum = function(totolEnemyNum,enemyNum){
		var x = 466;
		var y = 34 + this.offsetY;
		if(enemyNum <= 0){
			return ;
		}
		var enemySize = 16;
		this.wallCtx.fillStyle = "#7f7f7f";
		var tempX = x + (enemyNum % 2)*enemySize;
		var tempY = y + (Math.ceil(totolEnemyNum/2)-1)*enemySize - (parseInt((enemyNum-1)/2))*enemySize;
		this.wallCtx.fillRect(tempX,tempY,14,14);
	};
	
	/**
	 * 画坦克的生命数
	 * @param lives 生命数
	 * @param which 坦克索引，1、代表玩家1  2、代表玩家2
	 */
	this.drawLives = function(lives,which){
		var x = 482;
		var y = 272;
		if(which == 2){
			y = 320;
		}
		this.wallCtx.fillStyle = "#7f7f7f";
		this.wallCtx.fillRect(x,y,this.num.size,this.num.size);
		this.num.draw(lives,x,y);
		//this.wallCtx.drawImage(RESOURCE_IMAGE,POS["num"][0]+lives*14,POS["num"][1],14, 14,x, y,14, 14);
	};
	
	/**
	 * 更新地图
	 * @param indexArr 需要更新的地图索引数组，二维数组，如[[1,1],[2,2]]
	 * @param target 更新之后的数值
	 */
	this.updateMap = function(indexArr,target){
		if(indexArr != null && indexArr.length > 0){
			var indexSize = indexArr.length;
			for(var i=0;i<indexSize;i++){
				var index = indexArr[i];
				this.mapLevel[index[0]][index[1]] = target;
				if(target > 0){
					this.wallCtx.drawImage(RESOURCE_IMAGE,this.tileSize*(target-1) + POS["map"][0], POS["map"][1],this.tileSize,this.tileSize,index[1]*this.tileSize + this.offsetX, index[0]*this.tileSize + this.offsetY,this.tileSize,this.tileSize) ;
				}else{
					this.wallCtx.fillStyle = "#000";
					this.wallCtx.fillRect(index[1]*this.tileSize + this.offsetX, index[0]*this.tileSize + this.offsetY,this.tileSize,this.tileSize);
				}
			}
		}
	};
	
	this.homeHit = function(){
		this.wallCtx.drawImage(RESOURCE_IMAGE,POS["home"][0]+this.homeSize, POS["home"][1], this.homeSize, this.homeSize, 12*this.tileSize + this.offsetX, 24*this.tileSize + this.offsetY, this.homeSize, this.homeSize) ;
	};
};