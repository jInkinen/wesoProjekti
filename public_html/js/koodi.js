"use strict";

var site = {
    view: {},
    model: {}
};

site.view.Sivu = Backbone.View.extend({
    initialize: function(kohde, temp) {
        this.render(kohde, temp);
    },
    render: function(kohde, temp) {       
        var html = Mustache.render($(temp).html(), this.model);
        $(kohde).html(html);
    }
});

site.model.Feed = Backbone.Model.extend({
    initialize: function(url) {
       console.log(url);
    }
});

site.model.Data = Backbone.Model.extend({
    initialize: function(url) {
        this.url = url;
        console.log(url);
    }
});


$(document).ready(function() {
    var etuSivu = new site.view.Sivu({
        $el: "#0",
        model: new site.model.Data("asd")
    });
console.log(etuSivu);
});


/*
//Asetetaan sivujen käsittelyä varten eri sivuja kuvaavat muuttujat
var sivut = [];
var etu = $("#etusivu");
sivut.push(etu);
var tut = $("#tutkimus");
sivut.push(tut);
var opi = $("#opiskelu");
sivut.push(opi);

var etusivuPaauutiset = {};
var tutkimusRyhmat = {};

var etusivuAjankohtaistaFeed = {items: [], luokka: "#ajankohtaista"};
var etusivuPaatapahtumatFeed = {items: [], luokka: "#paatapahtumat"};
var opiskeluUutisetFeed = {items: [], luokka: "#opuutiset"};

var Sivu = Backbone.Model.extend();




$(document).ready(function() {
    addListeners();
    show(0);

    haeJSON("data/newsfeed.json", etusivuPaauutiset, "#keski", "#etusivu-keski-temp");
    haeJSON("data/tutkimus.json", tutkimusRyhmat, "#tutkimus-sisus", "#tutkimus-sisus-temp");
    
    haeRSS("http://www.cs.helsinki.fi/news/92/feed", etusivuAjankohtaistaFeed, 5);
    haeRSS("http://www.cs.helsinki.fi/tapahtumat/179/feed", etusivuPaatapahtumatFeed, 2);
    haeRSS("http://www.cs.helsinki.fi/news/94/feed", opiskeluUutisetFeed, 5);
});

var haeJSON = function(kohde, olio, renderKohde, renderTemp) {
    $.getJSON(kohde,
            "",
            function(dta) {
                olio = dta;
                render(renderKohde, renderTemp, olio);
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
};*/