/* Lightweight javascript to be loaded in all the pages outside data-content project. */
/* This is meant for the autocomplete to work across Reactome */
jQuery(document).ready(function () {
    jQuery('#local-searchbox').autocomplete({
        serviceUrl: '/content/getTags',
        minChars: 2,
        deferRequestBy: 250,
        paramName: "tagName",
        delimiter: ",",
        transformResult: function (response) {
            return {
                suggestions: jQuery.map(jQuery.parseJSON(response), function (item) {
                    return {value: item};
                })
            };
        },
        onSelect: function (value, data) {
            jQuery("#search_form").submit()
        }
    });
});

jQuery(document).ready(function () {
    jQuery('#search_form').submit(function (e) {
        if (!jQuery('#local-searchbox').val()) {
            e.preventDefault();
        } else if (jQuery('#local-searchbox').val().match(/^\s*jQuery/)) {
            e.preventDefault();
        }
    });
});