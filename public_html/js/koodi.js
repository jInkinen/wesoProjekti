//Asetetaan sivujen käsittelyä varten eri sivuja kuvaavat muuttujat
var sivut = [];
var etu = $("#etusivu");
sivut.push(etu);
var tut = $("#tutkimus");
sivut.push(tut);
var opi = $("#opiskelu");
sivut.push(opi);

var etusivuPaauutiset = {};
var etusivuAjankohtaistaFeed = {items: [], luokka: "#ajankohtaista"};
var etusivuPaatapahtumatFeed = {items: [], luokka: "#paatapahtumat"};

$(document).ready(function() {
    addListeners();
    show(0);

    haeJSON();
    haeRSS("http://www.cs.helsinki.fi/news/92/feed", etusivuAjankohtaistaFeed, 5);
    haeRSS("http://www.cs.helsinki.fi/tapahtumat/179/feed", etusivuPaatapahtumatFeed, 2);
});

var haeJSON = function() {
    $.getJSON("data/newsfeed.json",
            "",
            function(dta) {
                etusivuPaauutiset = dta;
                //console.log(data);
                render("#keski", "#etusivu-keski-temp", etusivuPaauutiset);
            });
};

var haeRSS = function(osoite, olio, maara) {
    $.get(osoite, function(data) {
        var $xml = $(data);

        var rss = $xml.find("item");
        
        for (var ind = 0; ind < maara; ind++) {
            rssData = {
                title: rss.find("title")[ind].textContent,
                link: rss.find("link")[ind].textContent
            };
            
            olio["items"].push(rssData);
        }
        //console.log(olio);
        render(olio["luokka"], "#etusivu-rss-temp", olio);
    });
};

var render = function(kohde, temp, data) {
    var html = Mustache.render($(temp).html(), data);
    $(kohde).html(html);
};

var show = function(numero) {
    etu.hide();
    tut.hide();
    opi.hide();
    
    sivut[numero].show();
};

var addListeners = function() {
    $("#navi a").click(function() {
        show(this.id);
    });
};