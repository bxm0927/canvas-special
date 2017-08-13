function onNavigation(a) {
    2 == a.progress && player.pause()
}

 function trim(str){ //删除左右两端的空格
     return str.replace(/(^\s*)|(\s*$)/g, "");
 }

function getUrlParam(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) 
		return trim(decodeURIComponent(r[2])); 
	return false;
}

$(function(){
	var y = getUrlParam("y"),m = getUrlParam("m"),love = getUrlParam("love"),bgmMusic = getUrlParam("bgmMusic");
	for (var a = {}, b = 1; 79 > b; b++){
		var value = getUrlParam("text-" + b);
		if(value){
			$("#text-" + b).text(value);
		}
		if(y){
			$("#text-" + b).text($("#text-" + b).text().replace(/小明/g,y));
		}
		if(m){
			$("#text-" + b).text($("#text-" + b).text().replace(/小红/g,m));
		}
		if(love){
			$("title").text(y + "❤" + m + love);
		}
		if(bgmMusic){
			$("#bgmMusic").attr("src",bgmMusic);
			$("#text-music").text(bgmMusic);
		}
	}
	$("title").text($("title").text() + " | 永远幸福 (codejie.net)");
});

function getUrl(){
	var url = "http://aijava.cn/demo/love/2014/?y=" + $("#text-75").text() + "&m=" + $("#text-76").text() + "&love=" + $("#text-77").text() + "&bgmMusic" + $("#text-music").text();
	for (var a = {}, b = 1; 10 > b; b++){//url长度限制、取前10个
		var value = $("#text-" + b).text();
		if(value){
			url += "&text-" + b + "=" + encodeURIComponent($("#text-" + b).text());
		}		
	}
	return url;
}

Flowtime.showProgress(!0), Flowtime.addEventListener("flowtimenavigation", onNavigation, !1), Flowtime.start(), $(function () {
    $(".nojavascript").remove(), setInterval(function () {
        $(".showtip").removeClass("showtip").hide().siblings("span").addClass("showtip").fadeIn()
    }, 5e3), $("#write-submit").click(function () {
        $(".write-ok").fadeIn(), $("#text-href").focus(), $("#back").click(function () {
            $(".write-ok").fadeOut()
        }), $("#write-post").click(function () {
			
			var y = $("#text-75").text(),m = $("#text-76").text(),love = $("#text-77").text(),bgmMusic = $("#text-music").text();
			for (var a = {}, b = 1; 79 > b; b++){
				var value = getUrlParam("text-" + b);
				if(value){
					$("#text-" + b).text(value);
				}
				if(y){
					$("#text-" + b).text($("#text-" + b).text().replace(/小明/g,y));
				}
				if(m){
					$("#text-" + b).text($("#text-" + b).text().replace(/小红/g,m));
				}
				if(love){
					$("title").text(y + "❤" + m + love);
				}
				if(bgmMusic){
					$("#bgmMusic").attr("src",bgmMusic);
					$("#text-music").text(bgmMusic);
				}
			}
			$("title").text($("title").text() + " | 永远幸福 (codejie.net)");
		
			bd_share();
		
            var b = $("#text-href").text(),
                c = $("#text-music").text();
				
			$("#back").hide();
			$(".write-ok p").hide();
			$(".write-ok div button").hide();
			$(".write-ok div h2").hide().text("\u6210\u529f\u751f\u6210\u8868\u2764\u767d\u9875\u9762").fadeIn();
			$("#write-url").html('\u60a8\u7684\u8868\u767d\u94fe\u63a5\u662f\uff1a<a href="' + getUrl() + '" target="_blank">' 
				+ 
					"http://aijava.cn/demo/love/2014/?y=" + $("#text-75").text() + "&m=" + $("#text-76").text() + "&love=" + $("#text-77").text()
				+ "</a>").fadeIn();
			$(".write-share").css("display", "inline-block").children("p").show()
        })
    });
    var bgmMusic = document.getElementById("bgmMusic");
    $("#on").click(function () {
        bgmMusic.pause(), $("#on").hide(200), $("#off").css({
            display: "inline-block"
        }, 300)
    }), $("#off").click(function () {
        bgmMusic.play(), $("#off").hide(200), $("#on").css({
            display: "inline-block"
        }, 300)
    });    
});

function bd_share(){
	var sharetext = $("#text-75").text() + "love" + $("#text-76").text() + $("#text-77").text();
    with(sharedesc = $("#text-1").text() + $("#text-2").text() + $("#text-3").text() + $("#text-4").text() + $("#text-5").text() + $("#text-6").text() + $("#text-7").text() + $("#text-8").text() + "......", window._bd_share_config = {
        common: {
            bdSnsKey: {},
            bdText: sharetext,
            bdDesc: sharedesc,
            bdUrl: getUrl(),
            bdMini: "2",
            bdMiniList: ["mshare", "qzone", "tsina", "bdysc", "weixin", "renren", "tqq", "bdxc", "kaixin001", "tqf", "tieba", "douban", "tsohu", "bdhome", "sqq", "thx", "qq", "ibaidu", "taobao", "hi", "baidu", "sohu", "t163", "qy", "meilishuo", "mogujie", "diandian", "huaban", "leho", "share189", "duitang", "hx", "tfh", "fx", "youdao", "sdo", "qingbiji", "ifeng", "people", "xinhua", "ff", "mail", "kanshou", "isohu", "yaolan", "wealink", "xg", "ty", "iguba", "fbook", "twi", "deli", "s139"],
            bdPic: "http://kingzs70.oss.aliyuncs.com/iali/img/319280.jpg",
            bdStyle: "1",
            bdSize: "32"
        },
        share: {}
    }, document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "http://bdimg.share.baidu.com/static/api/js/share.js?v=86326610.js?cdnversion=" + ~ (-new Date / 36e5)]
}