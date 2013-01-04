"use strict";

var site = {
    view: {},
    model: {}
};

site.view.Etusivu = Backbone.View.extend({
    el: $("#0"),
    initialize: function() {
        this.collection = new site.model.Uutiset();
        this.collection.bind("reset", this.render, this);
        this.collection.bind("change", this.render, this);
        this.collection.fetch();
    },
    render: function() {
        var html = Mustache.render($("#etusivu-keski-temp").html(), this.collection.models[0].attributes);
        $("#keski").html(html);
    },
    show: function() {
        $("#etusivu").show();
        $("#tutkimus").hide();
        $("#opiskelu").hide();
    },
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.RSS1 = Backbone.View.extend({
    initialize: function() {
        this.model = new site.model.RSS1();
        this.model.bind("reset", this.render, this);
        this.model.bind("change", this.render, this);
    },
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.collection.models[0].attributes);
        $("#ajankohtaista").html(html);
    }
});

site.model.RSS1 = Backbone.Model.extend({
    initialize: function() {
        this.set({"items": []});
        this.lataaSyote();
    },
    lataaSyote: function() {
        var rssData = {};
        
        $.get("http://www.cs.helsinki.fi/news/92/feed", function(data) {
            var $xml = $(data);
            var rss = $xml.find("item");
            for (var ind = 0; ind < 3; ind++) {
                rssData = {
                    title: rss.find("title")[ind].textContent,
                    link: rss.find("link")[ind].textContent
                };
                
            }
        });
    }
});

site.model.Artikkeli = Backbone.Model.extend();

site.model.Uutiset = Backbone.Collection.extend({
    model: site.model.Artikkeli,
    url: "data/newsfeed.json"
});

$(document).ready(function() {
    new site.view.RSS1();
    var etu = new site.view.Etusivu();
    etu.show();
});


/*
 
 
 haeJSON("data/newsfeed.json", etusivuPaauutiset, "#keski", "#etusivu-keski-temp");
 haeJSON("data/tutkimus.json", tutkimusRyhmat, "#tutkimus-sisus", "#tutkimus-sisus-temp");
 
 haeRSS("http://www.cs.helsinki.fi/news/92/feed", etusivuAjankohtaistaFeed, 5);
 haeRSS("http://www.cs.helsinki.fi/tapahtumat/179/feed", etusivuPaatapahtumatFeed, 2);
 haeRSS("http://www.cs.helsinki.fi/news/94/feed", opiskeluUutisetFeed, 5);
 
 
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