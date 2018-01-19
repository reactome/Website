/**
 * Created by gsviteri on 22/05/2017.
 */
jQuery(document).ready(function() {
    // Getting the icons-library url directly form the menu and assign to "Library Home" button.
    jQuery('.icons-lib-home').click(function (e) {
        e.preventDefault();
        window.location.href = jQuery('.icons-library-mi').attr('href');
    });

    jQuery('.modal-dialog').click(function (e) {
        e.preventDefault();
        jQuery('.modal-dialog').fadeOut(400, function () {
            window.location.hash = "";
        });
    });
});