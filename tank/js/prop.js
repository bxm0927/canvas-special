
var Prop = function(context){
	this.x = 0;
	this.y = 0;
	this.duration = 600;
	this.type = 0;
	this.hit = false;
	this.width = 30;
	this.height = 28;
	this.ctx = context;
	this.isDestroyed = false;
	this.size = 28;
	
	this.init = function(){
		this.ctx.clearRect(this.x,this.y,this.width,this.height);
		this.duration = 600;
		this.type = parseInt(Math.random() * 6);
		this.x = parseInt(Math.random() * 384)+map.offsetX;
		this.y = parseInt(Math.random() * 384)+map.offsetY;
		this.isDestroyed = false;
	};
	
	this.draw = function(){
		if(this.duration > 0 && !this.isDestroyed){
			this.ctx.drawImage(RESOURCE_IMAGE,POS["prop"][0]+this.type*this.width,POS["prop"][1],this.width,this.height,this.x,this.y,this.width,this.height);
			this.duration -- ;
			this.isHit();
		}else{
			this.ctx.clearRect(this.x,this.y,this.width,this.height);
			this.isDestroyed = true;
		}
	};
	
	this.isHit = function(){
		var player = null;
		if(player1.lives > 0 && CheckIntersect(this,player1,0)){
			this.hit = true;
			player = player1;
		}else if(player2.lives > 0 && CheckIntersect(this,player2,0)){
			this.hit = true;
			player = player2;
		}
		if(this.hit){
			PROP_AUDIO.play();
			this.isDestroyed = true;
			this.ctx.clearRect(this.x,this.y,this.width,this.height);
			switch(this.type){
			case 0:
				player.lives ++;
				break;
			case 1:
				emenyStopTime = 500;
				break;
			case 2:
				var mapChangeIndex = [[23,11],[23,12],[23,13],[23,14],[24,11],[24,14],[25,11],[25,14]];
				map.updateMap(mapChangeIndex,GRID);
				homeProtectedTime = 500;
				break;
			case 3:
				if(enemyArray != null || enemyArray.length > 0){
					for(var i=0;i<enemyArray.length;i++){
						var enemyObj = enemyArray[i];
						enemyObj.distroy();
					}
				}
				break;
			case 4:
				break;
			case 5:
				player.isProtected = true;
				player.protectedTime = 500;
				break;
				
			}
		}
		
		
	};
	
	
	
};