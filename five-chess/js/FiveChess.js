/*
	思路：(1-4：UI，5-：AI)
	1.画15*15棋盘
		DrawChessBoard()
	2.置所有位置未落子二维函数
		hasChess()
	3.走了一步棋
		oneStep(i, j, me)
	4.落子事件
		onclick

	5.赢法三维数组CountallWins()
		三维数组初始化
		置所有赢法为true
		mythiswin[i]的个数（5个赢）
		pcthiswin[i]的个数（5个赢）
	6.AI();二维权重数组myScore/pcScore
	8.用max、u、v记录最大值权重信息
 */

var FiveChesscanvas = document.getElementById('FiveChesscanvas');
var ctx = FiveChesscanvas.getContext('2d');
var has = [];
var me = true;
var allwins = [];
var count = 0;
var mythiswin = [];
var pcthiswin = [];
var over = false;


onload = function() {
	DrawChessBoard();
	hasChess();
	CountallWins();
}

function DrawChessBoard() {
	ctx.beginPath();
	for(var i=0; i<15; i++) {
		ctx.moveTo(15, 15+30*i);
		ctx.lineTo(435, 15+30*i);

		ctx.moveTo(15+30*i, 15);
		ctx.lineTo(15+30*i, 435);
	}
	ctx.strokeStyle = "#666";
	ctx.stroke();
	ctx.closePath();

	// sign
	ctx.beginPath();
	ctx.moveTo(215, 225);
	ctx.lineTo(235, 225);
	ctx.moveTo(225, 215);
	ctx.lineTo(225, 235);
	ctx.lineWidth = 2; 
	ctx.strokeStyle = "#000";
	ctx.stroke();
	ctx.closePath();
}

function hasChess() {
	for(var i=0; i<15; i++) {
		has[i] = [];
		for(var j=0; j<15; j++) {
			has[i][j] = 0;
		}
	}
}

function CountallWins() {
	for(var i=0; i<15; i++) {
		allwins[i] = [];
		for(var j=0; j<15; j++) {
			allwins[i][j] = [];
		}
	}

	// 横
	for(var i=0; i<15; i++) {
		for(var j=0; j<11; j++) {
			for(var k=0; k<5; k++) {
				allwins[i][j+k][count] = true;
			}
			count++;
		}
	}

	// 竖
	for(var i=0; i<15; i++) {
		for(var j=0; j<11; j++) {
			for(var k=0; k<5; k++) {
				allwins[j+k][i][count] = true;
			}
			count++;
		}
	}

	// 斜
	for(var i=0; i<11; i++) {
		for(var j=0; j<11; j++) {
			for(var k=0; k<5; k++) {
				allwins[i+k][j+k][count] = true;
			}
			count++;
		}
	}

	// 反斜
	for(var i=14; i>3; i--) {
		for(var j=0; j<11; j++) {
			for(var k=0; k<5; k++) {
				allwins[i-k][j+k][count] = true;
			}
			count++;
		}
	}

	// 一共572种赢法
	console.log(count);

	for(var i=0; i<=count; i++) {
		// 在每种赢法上的初始值为0
		mythiswin[i] = 0;
		pcthiswin[i] = 0;
	}
}

function oneStep(i, j, me) {
	ctx.beginPath();
	ctx.arc(30*i+15, 30*j+15, 13, 0, Math.PI*2);
	var gradient = ctx.createRadialGradient(30*i+15, 30*j+15, 13, 30*i+15, 30*j+15, 0);
	if(me) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636766");
	}
	else {
		gradient.addColorStop(0, "#b1b1b1");
		gradient.addColorStop(1, "#f9f9f9");
	}
	ctx.fillStyle = gradient;
	ctx.fill();
	ctx.closePath();
}

FiveChesscanvas.onclick = function(e) {
	if(over) {
		return;
	}
	if(!me) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if(has[i][j] == 0) {
		oneStep(i, j, true);
		has[i][j] = 1;
		console.log("落子坐标  " + i + "," + j);

		for(var k=0; k<=count; k++) {
			if(allwins[i][j][k]) {
				mythiswin[k]++;
				pcthiswin[k] = 50;
				if(mythiswin[k] == 5) {
					alert("恭喜你，你赢了！");
					over = true;
				}
			}
		}
		if(!over) {
			me = !me;
			AI();
		}
	}
}

function AI() {
	// 在每个位置落子的价值
	var myScore = [];
	var pcScore = [];
	var max = 0;
	var u = 0;
	var v = 0;
	for(var i=0; i<15; i++) {
		myScore[i] = [];
		pcScore[i] = [];
		for(var j=0; j<15; j++) {
			// 初始为0
			myScore[i][j] = 0;
			pcScore[i][j] = 0;
		}
	}

	for(var i=0; i<15; i++) {
		for(var j=0;j<15; j++) {
			if(has[i][j] == 0) {
				for(var k=0; k<=count; k++) {
					if(allwins[i][j][k]) {
						if(mythiswin[k] == 1) {
							myScore[i][j] += 200;
						}else if(mythiswin[k] == 2) {
							myScore[i][j] += 400;
						}else if(mythiswin[k] == 3) {
							myScore[i][j] += 1000;
						}else if(mythiswin[k] == 4) {
							myScore[i][j] += 10000;
						}

						if(pcthiswin[k] == 1) {
							pcScore[i][j] += 220;
						}else if(pcthiswin[k] == 2) {
							pcScore[i][j] += 420;
						}else if(pcthiswin[k] == 3) {
							pcScore[i][j] += 1100;
						}else if(pcthiswin[k] == 4) {
							pcScore[i][j] += 20000;
						}
					}
				}

				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max) {
					if(pcScore[i][j] > pcScore[u][v]) {
						u = i;
						v = j;
					}
				}

				if(pcScore[i][j] > max) {
					max = pcScore[i][j];
					u = i;
					v = j;
				}else if(pcScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	
	oneStep(u, v ,false);
	has[u][v] = 2;
	console.log("机器落子坐标  " + u + "," + v);
	for(var k=0; k<=count; k++) {
		if(allwins[u][v][k]) {
			pcthiswin[k]++;
			mythiswin[k] = 60;
			if(pcthiswin[k] == 5) {
				alert("很遗憾，电脑赢！");
				over = true;
			}
		}
	}

	if(!over) {
		me = !me;
	}
}