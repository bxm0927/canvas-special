
/**
 * 数组删除某个元素
 * @param arg 元素
 * @returns
 */
Array.prototype.remove = function(arg){
	var i=0,n=0;
	var arrSize = this.length;
	for(i=0;i<arrSize;i++){
		if(this[i] != arg){
			this[n++]=this[i];
		}
	}
	if(n<i){
		this.length = n;
	}
};

/**
 * 数组根据下标删除元素
 * @param index 元素下标
 * @returns
 */
Array.prototype.removeByIndex = function(index){
	var i=0,n=0;
	var arrSize = this.length;
	for(i=0;i<arrSize;i++){
		if(this[i] != this[index]){
			this[n++]=this[i];
		}
	}
	if(n<i){
		this.length = n;
	} 
};

/**
 * 数组是否包含某个元素
 * @param arg 元素
 * @returns
 */
Array.prototype.contain = function(arg){
	var i=0;
	var arrSize = this.length;
	for(i=0;i<arrSize;i++){
		if(this[i] == arg){
			return true;
		}
	}
	return false;
};










