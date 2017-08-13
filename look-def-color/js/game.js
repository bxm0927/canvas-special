var _lang = {
        zh: {title: "看你有多色",help_txt: "找出所有色块里颜色不同的一个",score: "得分:",btn_pause: "暂停",btn_normal: "普通场",btn_double: "双飞场",btn_normal_mode: "普通模式",btn_double_mode: "双飞模式",btn_reTry: "重来",btn_more_game: "更多游戏",game_pause: "游戏暂停",btn_resume: "继续",loading: "加载中...",lv_txt: ["瞎子", "色盲", "色郎", "色狼", "色鬼", "色魔", "超级色魔", "变态色魔", "孤独求色"],lv_txt2: ["色不起来", "有色心没色胆", "好色之徒", "色胆包天", "色不知耻", "英雄本色", "色射具全", "裸色舔香", "衣冠禽色"],tips: '再得<em id="_score"></em>分，就可再打败<em id="_num"></em>万人',share_txt_d: "[双飞]",share_txt1: "我怒砍",share_txt2: "分,击败",share_txt3: "%的人,我是[",share_txt4: "],不服来战！",coyright: "版权归博雅所有.侵权必究 v1.2.1",desc: "找出所有色块中颜色不同的一块。分享朋友圈，找到身边的色魔"},
        en: {title: "How strong is your eyesight",help_txt: "Find the box with the different colour",score: "Score:",btn_normal: "normal",btn_double: "double",btn_normal_mode: "normal",btn_double_mode: "double",btn_pause: "Pause",btn_start: "Start",btn_reTry: "Again",btn_more_game: "More games",game_pause: "Pause",btn_resume: "Continues",loading: "loading...",lv_txt: ["Blind", "Very weak", "Weak", "Just so so", "Not bad", "Nice one", "Great", "Amazing", "Insane"],lv_txt2: ["色不起来", "有色心没色胆", "好色之徒", "色胆包天", "色不知耻", "英雄本色", "色射具全", "裸色舔香", "衣冠禽色"],share_txt1: "I passed ",share_txt2: "stages and defeated ",share_txt3: "% people. I am ",share_txt4: ", come to challenge me if you dare！",coyright: "copyright by boyaa. v1.2.0",tips: '再得<em id="_score"></em>分，就可再打败<em id="_num"></em>万人',desc: "Find the box with the different colour, share it to your friends!"}
    }
    , _config = {
        lang: "zh",
        color: {
            allTime: 60,
            addTime: 0,
            lvMap: [2, 3, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8, 8, 9]
        },
        color2: {allTime: 60,addTime: 0,lvMap: [4, 4, 6, 6, 6, 6, 6, 6, 8]},
        pic: {isOpen: false,allTime: 5,addTime: 0,lvMap: [2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8]}
    }
    , shareData = {
        imgUrl: "http://wbpkh5001.17c.cn/html5/assets/img/find.logo.png?ver=1.1.62",
        timeLineLink: "http://url.cn/RN8G9E",
        tTitle: _lang[_config.lang].title,
        tContent: _lang[_config.lang].desc
    };


!function() { 
    var box = $("#box"), 
        b = {
            lv: $("#room .lv em"),
            time: $("#room .time"),
            start: $("#dialog .btn-restart"),
            pause: $("#room .btn-pause"),
            resume: $("#dialog .btn-resume"),
            mode: $("#mode"),
            dialog: $("#dialog"),
            d_content: $("#dialog .content"),
            d_pause: $("#dialog .pause"),
            d_gameover: $("#dialog .gameover")
        }, 
        c = {
            target: 1,
            finded: 0,
            score: 0,
            init: function(type, el, parent) {
                this.type = type;
                this.target = "color2" == type ? 2 : 1; 
                this.api = API[type]; 
                this.config = _config[type]; 
                this.lang = _lang[_config.lang]; 
                b.mode.data("type", "color" == type ? "color2" : "color").html("color" == type ? this.lang.btn_double : this.lang.btn_normal); 
                this.reset(); 
                this.parent = parent; 
                this.el = el; 
                this.renderUI(); 
                this.inited || this.initEvent(); 
                this.inited = true; 
                this.start();
            },
            renderUI: function() {
                var isLandscape = 90 == window.orientation || -90 == window.orientation;
                var width = isLandscape ? window.innerHeight : window.innerWidth;
                width -= 20, width = Math.min(width, 500);
                box.width(width).height(width);
                this.el.show()
            },
            initEvent: function() {
                var eventName = "ontouchstart" in document.documentElement ? "touchend" : "click", myGame = this;
                $(window).resize(function() {
                    myGame.renderUI()
                });
                box.on(eventName, "span", function() {
                    var type = $(this).data("type");
                    if("a" == type){
                        $(this).css("background-color", "#f00").data("type", "").html("<em></em>");
                        myGame.finded++
                        if(myGame.finded == myGame.target){
                            myGame.nextLv.call(myGame);
                        }
                    } 
                });
                b.pause.on(eventName, _.bind(this.pause, this));
                b.resume.on(eventName, _.bind(this.resume, this));
                b.start.on(eventName, function() {
                    myGame.score = 0;
                    b.time.html(0);
                    myGame.reset();
                    myGame.start()
                });
            },
            start: function() {
                this.time > 5 && b.time.removeClass("danger");
                this.finded = 0; 
                b.dialog.hide(); 
                this._pause = false; 
                this.lv = "undefined" != typeof this.lv ? this.lv + 1 : 0;
                this.lvMap = this.config.lvMap[this.lv] || _.last(this.config.lvMap);
                this.renderMap();
                this.renderInfo();
                this.timer || 
                    (this.timer = setInterval(_.bind(this.tick, this), 1000));
            },
            share: function() {
            },
            resume: function() {
                b.dialog.hide();
                this._pause = false
            },
            pause: function() {
                this._pause = true; 
                b.d_content.hide();
                b.d_pause.show();
                b.dialog.show()
            },
            tick: function() {
                if (this._pause) {
                    return
                }
                else{
                    this.time--; 
                    this.time < 6 && b.time.addClass("danger"); 
                    if(this.time < 0){
                        this.gameOver()
                    }
                    else{
                        b.time.text(parseInt(this.time));
                    }
                }
            },
            renderMap: function() {
                if (!this._pause) {
                    var n = this.lvMap * this.lvMap, 
                        c = "", d = "lv" + this.lvMap;
                    _(n).times(function() {
                        c += "<span></span>"
                    });
                    box.attr("class", d).html(c); 
                    this.api.render(this.lvMap, this.lv);
                }
            },
            renderInfo: function() {
                this.score += "color2" == this.type ? this.lvMap / 2 : 1;
                b.lv.text(this.score)
            },
            gameOver: function() {
                var d = this.api.getGameOverText(this.score);
                this.lastScore = this.score; 
                this.lastGameTxt = d.txt;
                b.d_content.hide(); 
                b.d_gameover.show().find("h3").html(this.lastGameTxt);

                box.find("span").fadeOut(1500, function() {
                    b.dialog.show()
                });
                if ( "color2" == this.type) {
                    var e = [2, 3, 4][parseInt(2 * Math.random())];
                    $("#_score").html(e);
                    var f;
                    f = this.socre < 70 ? (20 + 10 * Math.random()).toFixed(1) : this.socre < 80 ? (30 + 20 * Math.random()).toFixed(1) : this.socre < 90 ? (70 + 10 * Math.random()).toFixed(1) : this.socre < 100 ? (100 + 100 * Math.random()).toFixed(1) : this.socre < 110 ? (60 + 10 * Math.random()).toFixed(1) : this.socre < 120 ? (30 + 20 * Math.random()).toFixed(1) : this.socre < 130 ? (10 + 10 * Math.random()).toFixed(1) : (5 + 10 * Math.random()).toFixed(1); 
                    $("#_num").html(f), $("#tips").show()
                } else
                    $("#tips").hide();
                this._pause = true;
                var g = "color2" == this.type ? "d_" : "";
            },
            reset: function() {
                this.time = this.config.allTime;
                this.lv = -1
            },
            nextLv: function() {
                this.time += this.config.addTime; 
                b.time.text(parseInt(this.time)); 
                if(!this._pause)
                    this.start();
            }
        };
    window.Game = c;
}();