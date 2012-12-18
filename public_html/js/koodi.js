var data = {};

$(document).ready(function() {
    haeJSON();
});

var haeJSON = function() {
    $.getJSON("data/newsfeed.json",
            "",
            function(dta) {
                data = dta;
                console.log(data);
                render();
            });
};

var render = function() {
    var html = Mustache.render($("#etusivu-keski-temp").html(), data);
    this.$("#keski").html(html);
};