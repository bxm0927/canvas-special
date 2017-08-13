!function() {
    var b = {
            index: $("#index"),
            room: $("#room"),
            loading: $("#loading"),
            dialog: $("#dialog"),
            play: $(".btn-play"),
        }, 
        ua = window.navigator.userAgent.toLowerCase(), 
        isAndroid = /android/i.test(ua), 
        isIOS = /iphone|ipad|ipod/i.test(ua), 
        app = {
            init: function() {
                this.initEvent();
                this.loading();
            },
            loading: function() {
                function a() {
                    d++, d == 10 && app.render()
                }
                if (_config.pic.isOpen)
                    for (var b = ["assets/img/1.png", "assets/img/2.png", "assets/img/3.png", "assets/img/4.png", "assets/img/5.png", "assets/img/6.png", "assets/img/7.png", "assets/img/8.png", "assets/img/9.png", "assets/img/10.png", "assets/img/11.png", "assets/img/12.png", "assets/img/13.png", "assets/img/14.png", "assets/img/15.png", "assets/img/16.png", "assets/img/17.png", "assets/img/18.png"], c = b.length, d = 0, e = 0; c > e; e++) {
                        var g = new Image;
                        g.onload = a, g.src = b[e]
                    }
                else
                    app.render();

            }, 
            render: function() {
                setTimeout(function() {
                    b.loading.hide(), b.index.show()
                }, 1000)
            },           
            initEvent: function() {
                var clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click", 
                myApp = this;
                b.play.on(clickEvent, function() {
                    var type = $(this).data("type") || "color";
                    b.index.hide(), Game.init(type, b.room, myApp)
                });
                this.weixinEvent();
            },weixinEvent: function(){
                var h = _lang[_config.lang];
                document.addEventListener("WeixinJSBridgeReady", 
                    function() {
                        if (WeixinJSBridge) {
                            WeixinJSBridge.on("menu:share:appmessage", function() {
                                var a = "color2" == Game.type ? h.share_txt_d : "", 
                                    b = Game.lastScore > 0 ? a + h.share_txt1 + Game.lastScore + h.share_txt2 + Game.lastGamePercent + h.share_txt3 + Game.lastGameTxt + h.share_txt4 : shareData.tTitle;
                                WeixinJSBridge.invoke(
                                    "sendAppMessage", 
                                    {
                                        img_url: shareData.imgUrl,
                                        link: shareData.timeLineLink,
                                        desc: shareData.tContent,
                                        title: b
                                    }, function() {});
                            });
                            WeixinJSBridge.on("menu:share:timeline", function() {
                                var a = "color2" == Game.type ? h.share_txt_d : "", 
                                    b = Game.lastScore > 0 ? a + h.share_txt1 + Game.lastScore + h.share_txt2 + Game.lastGamePercent + h.share_txt3 + Game.lastGameTxt + h.share_txt4 : shareData.tTitle;
                                WeixinJSBridge.invoke(
                                    "shareTimeline", 
                                    {
                                        img_url: shareData.imgUrl,
                                        link: shareData.timeLineLink,
                                        desc: shareData.tContent,
                                        title: b
                                    }, function() {});
                            });
                        }
                    }, 
                    false);                
            }};
    app.init();
    window.API = {}


}();


















