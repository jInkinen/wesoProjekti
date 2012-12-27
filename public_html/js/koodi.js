//Asetetaan sivujen käsittelyä varten eri sivuja kuvaavat muuttujat
var etu = $("#etusivu");
var tut = $("#tutkimus");
var opi = $("#opiskelu");

var etusivuPaauutiset = {};
var etusivuAjankohtaistaFeed = {items: [], luokka: "#ajankohtaista"};
var etusivuPaatapahtumatFeed = {items: [], luokka: "#paatapahtumat"};

$(document).ready(function() {
    tut.hide();
    opi.hide();

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