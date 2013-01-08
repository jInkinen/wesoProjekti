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

site.view.Tutkimus = Backbone.View.extend({
    el: $("#1"),
    initialize: function() {
        this.collection = new site.model.Tutkijat();
        this.collection.bind("reset", this.render, this);
        this.collection.bind("change", this.render, this);
        this.collection.fetch();
    },
    render: function() {
        var html = Mustache.render($("#tutkimus-sisus-temp").html(), this.collection.models[0].attributes);
        $("#tutkimus-sisus").html(html);
    },
    show: function() {
        $("#etusivu").hide();
        $("#tutkimus").show();
        $("#opiskelu").hide();
    },
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.Opiskelu = Backbone.View.extend({
    el: $("#2"),
    show: function() {
        $("#etusivu").hide();
        $("#tutkimus").hide();
        $("#opiskelu").show();
    },
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.RSSajankohtaista = Backbone.View.extend({
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/news/92/feed", 3);
    },
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#ajankohtaista").html(html);
    }
});

site.view.RSSpaatapahtumat = Backbone.View.extend({
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/tapahtumat/179/feed", 2);
    },
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#paatapahtumat").html(html);
    }
});

site.view.RSSopiskelu = Backbone.View.extend({
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/news/94/feed", 4);
    },
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#opuutiset").html(html);
    }
});

site.model.RSS = Backbone.Model.extend({
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

site.model.Tutkijat = Backbone.Collection.extend({
    model: site.model.Artikkeli,
    url: "data/tutkimus.json"
});

//Dokumentin alustus
$(document).ready(function() {
    //Etusivun osat
    var etu = new site.view.Etusivu();
    new site.view.RSSajankohtaista();
    new site.view.RSSpaatapahtumat();
    //Tutkimus-sivun osat
    new site.view.Tutkimus();
    //Opiskeluosio
    new site.view.Opiskelu();
    new site.view.RSSopiskelu();
    //Asetetaan etusivu näkymään oletuksena, kun sivu avataan
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