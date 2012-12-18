"use strict";

var site = {
    view: {},
    model: {}
};

site.view.Etusivu = Backbone.View.extend({
    el: $("#etusivu"),
    initialize: function() {
        this.model.bind("change", this.render, this);
        this.render();
    },
    render: function() {
        var html = Mustache.render($("#etusivu-keski-temp").html(), this.model.attributes);
        this.$el.html(html);
    }
});

site.model.Uutiset = Backbone.Model.extend({
    initialize: function() {
        this.set("data", seconds);
    }
});

$(document).ready(function() {
    
    
    
    var uutiset = new site.model.Uutiset(data);
    new site.view.ClockView({
        model: clock
    });
});