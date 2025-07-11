/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
WFExtensions.add("LinkSearch", {
    options: {
        element: "#search-input",
        button: "#search-button",
        clear: "#search-clear",
        empty: "No Results",
        onClick: $.noop
    },
    init: function(options) {
        $.extend(this.options, options);
        var self = this, el = this.options.element, options = this.options.button;
        $(options).on("click", function(e) {
            self.search(), e.preventDefault();
        }).button({
            icons: {
                primary: "uk-icon-search"
            }
        }), $("#search-clear").on("click", function(e) {
            $(this).hasClass("uk-active") && ($(this).removeClass("uk-active"), 
            $(el).val(""), $("#search-result").empty().hide());
        }), $("#search-options-button").on("click", function(e) {
            e.preventDefault(), $(this).addClass("uk-active");
            e = $("#search-options").parent();
            $("#search-options").height(e.parent().height() - e.outerHeight() - 15).toggle();
        }).on("close", function() {
            $(this).removeClass("uk-active"), $("#search-options").hide();
        }), $(el).on("change keyup", function() {
            "" === this.value && ($("#search-result").empty().hide(), $("#search-clear").removeClass("uk-active"));
        });
    },
    search: function() {
        var self = this, s = this.options, el = s.element, $p = $("#search-result").parent(), query = $(el).val();
        query && !$(el).hasClass("placeholder") && ($("#search-clear").removeClass("uk-active"), 
        $("#search-browser").addClass("loading"), query = $.trim(query.replace(/[\///<>#]/g, "")), 
        Wf.JSON.request("doSearch", {
            json: [ query ]
        }, function(results) {
            if (results) {
                if (results.error) return void Wf.Dialog.alert(results.error, {
                    title: Wf.translate("link.search_error", "Search Error")
                });
                $("#search-result").empty(), results.length ? ($.each(results, function(i, values) {
                    $.each(values, function(name, items) {
                        $("<h3>" + name + "</h3>").appendTo("#search-result"), $.each(items, function(i, item) {
                            var $dl = $('<dl class="uk-margin-small" />').appendTo("#search-result");
                            $('<dt class="link uk-margin-small" />').text(item.title).on("click", function() {
                                $.isFunction(self.options.onClick) && self.options.onClick.call(this, Wf.String.decode(item.link));
                            }).prepend('<i class="uk-icon uk-icon-file-text-o uk-margin-small-right" />').appendTo($dl), 
                            $('<dd class="text">' + item.text + "</dd>").appendTo($dl), 
                            item.anchors && $.each(item.anchors, function(i, a) {
                                $('<dd class="anchor"><i role="presentation" class="uk-icon uk-icon-anchor uk-margin-small-right"></i>#' + a + "</dd>").on("click", function() {
                                    self.options.onClick.call(this, Wf.String.decode(item.link) + "#" + a);
                                }).appendTo($dl);
                            });
                        });
                    });
                }), $("dl:odd", "#search-result").addClass("odd")) : $("#search-result").append("<p>" + s.empty + "</p>"), 
                $("#search-options-button").trigger("close"), $("#search-result").height($p.parent().height() - $p.outerHeight() - 5).show();
            }
            $("#search-browser").removeClass("loading"), $("#search-clear").addClass("uk-active");
        }, self));
    }
});