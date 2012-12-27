//Asetetaan sivujen käsittelyä varten eri sivuja kuvaavat muuttujat
var etu = $("#etusivu");
var tut = $("#tutkimus");
var opi = $("#opiskelu");

var data = {};

$(document).ready(function() {
    tut.hide();
    opi.hide();
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