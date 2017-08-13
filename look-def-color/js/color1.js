!function() {
    var box = $("#box"), span = "span", 
    e = {
        lvT: _lang[_config.lang].lv_txt,
        render: function(e, f) {
            var g = _config.color.lvMap[f] || _.last(_config.color.lvMap);
            this.d = 15 * Math.max(9 - g, 1); 
            this.d = f > 20 ? 10 : this.d; 
            this.d = f > 40 ? 8 : this.d; 
            this.d = f > 50 ? 5 : this.d;
            var h = Math.floor(Math.random() * e * e),
                i = this.getColor(255 - this.d),  //干扰色
                j = this.getLvColor(i[0]);        //目标颜色

            box.find(span).css("background-color", i[1]);
            box.find(span).eq(h).css("background-color", j[1]).data("type", "a");


        },getColor: function(a) {
            var b = [   
                        Math.round(Math.random() * a), 
                        Math.round(Math.random() * a), 
                        Math.round(Math.random() * a)
                    ], 
                c = "rgb(" + b.join(",") + ")";
            return [b, c]
        },getLvColor: function(a) {
            var b = this.d, c = _.map(a, function(a) {
                return a + b + 10
            }), 
            d = "rgb(" + c.join(",") + ")";
            return [c, d]
        },
        getGameOverText: function(lv) {
            var b = 20 > lv ? 0 : Math.ceil((lv - 20) / 10);
            var c = this.lvT[b] || _.last(this.lvT); 
            var d = c+"lv"+lv;
            return {txt: d}
        }};
    API.color = e
}(); 