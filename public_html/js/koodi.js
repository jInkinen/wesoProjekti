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
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/news/92/feed", 3);
    },
    render: function() {
        console.log(this.model);
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#ajankohtaista").html(html);
    }
});

site.view.RSS2 = Backbone.View.extend({
    initialize: function() {
        this.model = new site.model.RSS1();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/tapahtumat/179/feed", 2);
    },
    render: function() {
        console.log(this.model);
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#paatapahtumat").html(html);
    }
});

site.model.RSS1 = Backbone.Model.extend({
    initialize: function() {
        this.set({"items": []});
    },
    lataaSyote: function(osoite, maara) {
        var rssData = {};
        var isanta = this;
        $.get(osoite, function(data) {
            var $xml = $(data);
            var rss = $xml.find("item");
            for (var ind = 0; ind < maara; ind++) {
                rssData = {
                    title: rss.find("title")[ind].textContent,
                    link: rss.find("link")[ind].textContent
                };
                //this tässä kontekstissa viittaa jQuery.get-kyselyyn
                isanta.tallenna(rssData);
            }
        });
    },
    tallenna: function(uusiData) {
        var data = this.get("items");
        data.push(uusiData);
        this.set({"items": data});
        //Laukaistaan change, jotta view päivittää renderöidyn sivun
        this.trigger('change',this);
    }
});

site.model.Artikkeli = Backbone.Model.extend();

site.model.Uutiset = Backbone.Collection.extend({
    model: site.model.Artikkeli,
    url: "data/newsfeed.json"
});

$(document).ready(function() {
    var etu = new site.view.Etusivu();
    new site.view.RSS1();
    new site.view.RSS2();
    etu.show();
});


/*
 
 
 haeJSON("data/newsfeed.json", etusivuPaauutiset, "#keski", "#etusivu-keski-temp");
 haeJSON("data/tutkimus.json", tutkimusRyhmat, "#tutkimus-sisus", "#tutkimus-sisus-temp");
 
 haeRSS("http://www.cs.helsinki.fi/news/92/feed", etusivuAjankohtaistaFeed, 5);
 haeRSS("http://www.cs.helsinki.fi/tapahtumat/179/feed", etusivuPaatapahtumatFeed, 2);
 haeRSS("http://www.cs.helsinki.fi/news/94/feed", opiskeluUutisetFeed, 5);
 
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