/*
*   name           FavMobile Menu
*   version        1.1
*   author         FavThemes
*   author URL     http://www.favthemes.com
*   copyright      Copyright (C) 2012-2016 FavThemes.com. All Rights Reserved.
*   license        Licensed under GNU/GPLv3 (http://www.gnu.org/licenses/gpl-3.0.html)
*/

document.addEventListener("DOMContentLoaded", function() {

    favprocess_mobile_menu();
    favprocess_mobile_menu_onclick();

});

function favprocess_mobile_menu_onclick() {

    var cnavbar = document.getElementsByClassName("navbar")[0];

    for (var i = 0; i < cnavbar.getElementsByClassName("deeper parent").length; i++) {

        cnavbar.getElementsByClassName("deeper parent")[i].onclick = function(event) {

            var achild = this.childNodes[0].tagName;
            var hrefchild = this.getAttribute('href');

            if (achild != "A" || (hrefchild &&  hrefchild == '#')) {

                var cclasses = this.className;

                if (cclasses.search('favmenuopen') == -1) {

                    this.setAttribute("class", cclasses + " favmenuopen");
                    var cstyle = 'block';

                } else {

                    this.setAttribute("class", cclasses.replace(" favmenuopen",""));
                    var cstyle = 'none';

                }

                var navchilds = this.getElementsByClassName("nav-child");

                if (typeof navchilds[0] !== "undefined") {

                    navchilds[0].setAttribute("style", "display: "+cstyle+";");

                }

            }

            event.stopPropagation();

        };

    }

}

function favprocess_mobile_menu() {

    var cnavbar = document.getElementsByClassName("navbar")[0];

    var cactiveel = 'none';

    if (typeof cnavbar !== "undefined") {

        if (typeof cnavbar.getElementsByClassName("current active")[0] !== "undefined") {

            cactiveel = cnavbar.getElementsByClassName("current active")[0];

        }

    }

    for (var i = 0; i < cnavbar.getElementsByClassName("nav-child").length; i++) {

        cnavbar.getElementsByClassName("nav-child")[i].setAttribute("style", "display: none;");

    }

    if (cactiveel != 'none') {

        var element = cactiveel;
        var navchilds = element.getElementsByClassName("nav-child");

        element.setAttribute("style", "display: block;");
        element.setAttribute("class", element.className + " favmenuopen");

        for (var i = 0; i < navchilds.length; i++) {

            if (navchilds[i].parentNode.className.search('deeper parent') != -1 && navchilds[i].parentNode.className.search('current active') != -1) {

                navchilds[i].setAttribute("style", "display: block;");
                navchilds[i].setAttribute("class", navchilds[i].className + " favmenuopen");

            }

        }

        while (element.parentNode) {

            if (typeof element.parentNode.className !== "undefined") {

                if (element.parentNode.className.search('moduletable') != -1) {
                    break;
                } else {
                    element = element.parentNode;
                    element.setAttribute("style", "display: block;");
                    element.setAttribute("class", element.className + " favmenuopen");
                }

            }

        }

    }

}
