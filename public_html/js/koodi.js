// Sisältää sivuston toiminnallisuuden kannalta oleelliset javascript-tiedot
// 
// jQuery on käytössä tiettyjä asioita helpottamaan.
// Hyödyntää Backbone-kirjastoa (joka tarvitsee toimiakseen underscore.js-
// kirjaston). Lisäksi käytössä on Mustache.js sivujen renderöintiä varten.

"use strict";

var site = {
    view: {},
    model: {}
};

// VIEW-määrittelyt

site.view.Etusivu = Backbone.View.extend({
    // liitetään view linkkiin, josta se avataan
    el: $("#0"),
    // luodaan viewille kokoelma, johon näytettävät tiedot tallennetaan
    initialize: function() {
        this.collection = new site.model.Uutiset();
        this.collection.bind("reset", this.render, this);
        this.collection.bind("change", this.render, this);
        this.collection.fetch();
    },
    // Mustache.js:a hyödyntävä renderöinti
    render: function() {
        var html = Mustache.render($("#etusivu-keski-temp").html(), this.collection.models[0].attributes);
        $("#keski").html(html);
    },
    // Piilotetaan muut kuin haluttu sivuston osa ja vaihdetaan sivun title
    show: function() {
        $("#etusivu").show();
        $("#tutkimus").hide();
        $("#opiskelu").hide();
        document.title = "Etusivu | Tietojenkäsittelytieteen laitos";
    },
    // sidotaan linkin klikkaus näyttämään haluttu osio sivustosta
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.Tutkimus = Backbone.View.extend({
    // liitetään view linkkiin, josta se avataan
    el: $("#1"),
    // luodaan viewille kokoelma, johon näytettävät tiedot tallennetaan
    initialize: function() {
        this.collection = new site.model.Tutkijat();
        this.collection.bind("reset", this.render, this);
        this.collection.bind("change", this.render, this);
        this.collection.fetch();
    },
    // Mustache.js:a hyödyntävä renderöinti
    render: function() {
        var html = Mustache.render($("#tutkimus-sisus-temp").html(), this.collection.models[0].attributes);
        $("#tutkimus-sisus").html(html);
    },
    // Piilotetaan muut kuin haluttu sivuston osa ja vaihdetaan sivun title
    show: function() {
        $("#etusivu").hide();
        $("#tutkimus").show();
        $("#opiskelu").hide();
        document.title = "Tutkimus | Tietojenkäsittelytieteen laitos";
    },
    // sidotaan linkin klikkaus näyttämään haluttu osio sivustosta
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.Opiskelu = Backbone.View.extend({
    // liitetään view linkkiin, josta se avataan
    el: $("#2"),
    // Piilotetaan muut kuin haluttu sivuston osa ja vaihdetaan sivun title
    show: function() {
        $("#etusivu").hide();
        $("#tutkimus").hide();
        $("#opiskelu").show();
        document.title = "Opiskelu | Tietojenkäsittelytieteen laitos";
    },
    // sidotaan linkin klikkaus näyttämään haluttu osio sivustosta
    events: {
        "click": function() {
            this.show();
        }
    }
});

site.view.RSSajankohtaista = Backbone.View.extend({
    // luodaan viewille malli, johon näytettävät syötteet tallennetaan
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/news/92/feed", 3);
    },
    // Mustache.js:a hyödyntävä renderöinti
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#ajankohtaista").html(html);
    }
});

site.view.RSSpaatapahtumat = Backbone.View.extend({
    // luodaan viewille malli, johon näytettävät syötteet tallennetaan
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/tapahtumat/179/feed", 2);
    },
    // Mustache.js:a hyödyntävä renderöinti
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#paatapahtumat").html(html);
    }
});

site.view.RSSopiskelu = Backbone.View.extend({
    // luodaan viewille malli, johon näytettävät syötteet tallennetaan
    initialize: function() {
        this.model = new site.model.RSS();
        this.model.bind("change", this.render, this);
        this.model.lataaSyote("http://www.cs.helsinki.fi/news/94/feed", 4);
    },
    // Mustache.js:a hyödyntävä renderöinti
    render: function() {
        var html = Mustache.render($("#etusivu-rss-temp").html(), this.model.attributes);
        $("#opuutiset").html(html);
    }
});



// MODEL-määrittelyt

// RSS-feedien lukemiseen käytettävä model
site.model.RSS = Backbone.Model.extend({
    //asettaa oletusarvon muuttujalle items
    initialize: function() {
        this.set({"items": []});
    },
    //lataa syötteen halutusta osoitteesta halutulla määrällä uutisia
    lataaSyote: function(osoite, maara) {
        var rssData = {};
        var isanta = this;
        
        $.get(osoite, function(data) {
            var $xml = $(data);
            var rss = $xml.find("item");
            for (var ind = 0; ind < maara; ind++) {
                //tallennettava data muotoillaan sopivaksi olioksi
                rssData = {
                    title: rss.find("title")[ind].textContent,
                    link: rss.find("link")[ind].textContent
                };
                //this tässä kontekstissa viittaa jQuery.get-kyselyyn
                //joten käytetään isanta apumuuttujaa haetun datan tallentamiseen
                isanta.tallenna(rssData);
            }
        });
    },
    tallenna: function(uusiData) {
        //Lisätään modeliin uusi data, joka tulee parametrinä funktiolle
        var data = this.get("items");
        data.push(uusiData);
        this.set({"items": data});
        //Laukaistaan change, jotta view päivittää uuden datan sivulle
        this.trigger('change',this);
    }
});

//uutiset- ja tutkijat-kokoelmien käyttämä apuluokka
site.model.Artikkeli = Backbone.Model.extend();

//uutiset-kokoelman määritelmät
site.model.Uutiset = Backbone.Collection.extend({
    model: site.model.Artikkeli,
    url: "data/newsfeed.json"
});

//tutkijat-kokoelman määritelmät
site.model.Tutkijat = Backbone.Collection.extend({
    model: site.model.Artikkeli,
    url: "data/tutkimus.json"
});

// Dokumentin alustus
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
