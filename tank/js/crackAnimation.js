
var CrackAnimation = function(type,context,crackObj){
	this.times = 0;
	this.ctx = context;
	this.frame = 0;
	this.x = 0;
	this.y = 0;
	this.posName = "";
	this.size = 0;
	this.isOver = false;
	this.tempDir = 1;
	this.owner = crackObj;
	
	if(type == CRACK_TYPE_TANK){
		this.posName = "tankBomb";
		this.size = 66;
		this.frame = 4;
	}else{
		this.posName = "bulletBomb";
		this.size = 32;
		this.frame = 3;
	}
	this.x = crackObj.x + (parseInt(crackObj.size - this.size)/2);
	this.y = crackObj.y + (parseInt(crackObj.size - this.size)/2);
	
	this.draw = function(){
		var gaptime = 3;
		var temp = parseInt(this.times/gaptime);
		this.ctx.drawImage(RESOURCE_IMAGE,POS[this.posName][0]+temp*this.size,POS[this.posName][1],this.size,this.size,this.x,this.y,this.size,this.size);
		this.times += this.tempDir;
		if(this.times > this.frame * gaptime - parseInt(gaptime/2)){
			this.tempDir = -1;
		}
		if(this.times <= 0){
			this.isOver = true;
		}
	};
};