
jQuery(document).ready(function() {

    favgeneratesets('#attrib-content');

    favgenerateonclicks();

});

function favgenerateonclicks() {

    jQuery('.favcollapseh').click(function() {

        var cnumber = jQuery(this).attr('favcollapse-order');

        if (jQuery(this).hasClass('favcollapsehactive')) {

            jQuery(this).removeClass('favcollapsehactive');

            jQuery('.favcollapsec'+cnumber).slideUp( "slow", function() {});

        } else {

            jQuery('.favcollapseh').removeClass('favcollapsehactive');

            jQuery(this).addClass('favcollapsehactive');

            jQuery('.favcollapsec:not(.favcollapsec0)').css('display','none');

            jQuery('.favcollapsec'+cnumber).each(function() {

                jQuery(this).slideDown( "slow", function() {});

            });

            var cscrollto = Number(jQuery('.favcollapsehactive').offset().top) - Number(jQuery(this).height());

            jQuery('html, body').animate({ scrollTop: cscrollto }, 700, function() {});

        }

    });

}

function favgeneratesets(setel) {

    var nel = jQuery(setel+' .control-group').length;
    var lastel = 0;

    jQuery(setel+' .control-group').each(function(k,v) {

        var cprev = '';
        var ck = k+1;

        var chtml = jQuery(this)[0].outerHTML;
        var ch4 = jQuery(this).find('h4')[0];
        var clabel = jQuery(this).find('label')[0];

        if (typeof(ch4) !== "undefined") {

            var cnumber = Number(jQuery(ch4).text().replace(/[^\d]/g, ''));

            if (cnumber > lastel) {

                jQuery(this).addClass('favcollapseh');
                jQuery(this).attr('favcollapse-order',cnumber);

                if (lastel == 0) {

                    jQuery(this).addClass('favcollapsehactive');

                }

            } else {

                jQuery(this).addClass('favcollapsec'+cnumber);
                jQuery(this).addClass('favcollapsec');

                if (cnumber > 1) {

                    jQuery(this).css('display','none');

                }

            }

            lastel = cnumber;

        } else if (typeof(clabel) !== "undefined") {

            var cnumber = Number(jQuery(clabel).text().replace(/[^\d]/g, ''));

            jQuery(this).addClass('favcollapsec'+cnumber);
            jQuery(this).addClass('favcollapsec');

            if (cnumber > 1) {

                jQuery(this).css('display','none');

            }

        }

        if (ck == nel) {

            // TODO

        }

    });

}

