/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var languageValues = {
        Afrikaans: "af",
        Albanian: "sq",
        "Arabic (Algeria)": "ar-DZ",
        "Arabic (Bahrain)": "ar-BH",
        "Arabic (Egypt)": "ar-EG",
        "Arabic (Iraq)": "ar-IQ",
        "Arabic (Jordan)": "ar-JO",
        "Arabic (Kuwait)": "ar-KW",
        "Arabic (Lebanon)": "ar-LB",
        "Arabic (Libya)": "ar-LY",
        "Arabic (Morocco)": "ar-MA",
        "Arabic (Oman)": "ar-OM",
        "Arabic (Qatar)": "ar-QA",
        "Arabic (Saudi Arabia)": "ar-SA",
        "Arabic (Syria)": "ar-SY",
        "Arabic (Tunisia)": "ar-TN",
        "Arabic (U.A.E.)": "ar-AE",
        "Arabic (Yemen)": "ar-YE",
        Basque: "eu",
        Belarusian: "be",
        Bulgarian: "bg",
        Catalan: "ca",
        "Chinese (Hong Kong)": "zh-HK",
        "Chinese (PRC)": "zh-CN",
        "Chinese (Singapore)": "zh-SG",
        "Chinese (Taiwan)": "zh-TW",
        Croatian: "hr",
        Czech: "cs",
        Danish: "da",
        "Dutch (Belgium)": "nl-BE",
        "Dutch (Standard)": "nl",
        English: "en",
        "English (Australia)": "en-AU",
        "English (Belize)": "en-BZ",
        "English (Canada)": "en-CA",
        "English (Ireland)": "en-IE",
        "English (Jamaica)": "en-JM",
        "English (New Zealand)": "en-NZ",
        "English (South Africa)": "en-ZA",
        "English (Trinidad)": "en-TT",
        "English (United Kingdom)": "en-GB",
        "English (United States)": "en-US",
        Estonian: "et",
        Faeroese: "fo",
        Farsi: "fa",
        Finnish: "fi",
        "French (Belgium)": "fr-BE",
        "French (Canada)": "fr-CA",
        "French (Luxembourg)": "fr-LU",
        "French (Standard)": "fr",
        "French (Switzerland)": "fr-CH",
        "Gaelic (Scotland)": "gd",
        "German (Austria)": "de-AT",
        "German (Liechtenstein)": "de-LI",
        "German (Luxembourg)": "de-LU",
        "German (Standard)": "de",
        "German (Switzerland)": "de-CH",
        Greek: "el",
        Hebrew: "he",
        Hindi: "hi",
        Hungarian: "hu",
        Icelandic: "is",
        Indonesian: "id",
        Irish: "ga",
        "Italian (Standard)": "it",
        "Italian (Switzerland)": "it-CH",
        Japanese: "ja",
        Korean: "ko",
        "Korean (Johab)": "ko",
        Kurdish: "ku",
        Latvian: "lv",
        Lithuanian: "lt",
        "Macedonian (FYROM)": "mk",
        Malayalam: "ml",
        Malaysian: "ms",
        Maltese: "mt",
        Norwegian: "no",
        "Norwegian (Bokm\xe5l)": "nb",
        "Norwegian (Nynorsk)": "nn",
        Polish: "pl",
        "Portuguese (Brazil)": "pt-BR",
        "Portuguese (Portugal)": "pt",
        Punjabi: "pa",
        "Rhaeto-Romanic": "rm",
        Romanian: "ro",
        "Romanian (Republic of Moldova)": "ro-MD",
        Russian: "ru",
        "Russian (Republic of Moldova)": "ru-MD",
        Serbian: "sr",
        Slovak: "sk",
        Slovenian: "sl",
        Sorbian: "sb",
        "Spanish (Argentina)": "es-AR",
        "Spanish (Bolivia)": "es-BO",
        "Spanish (Chile)": "es-CL",
        "Spanish (Colombia)": "es-CO",
        "Spanish (Costa Rica)": "es-CR",
        "Spanish (Dominican Republic)": "es-DO",
        "Spanish (Ecuador)": "es-EC",
        "Spanish (El Salvador)": "es-SV",
        "Spanish (Guatemala)": "es-GT",
        "Spanish (Honduras)": "es-HN",
        "Spanish (Mexico)": "es-MX",
        "Spanish (Nicaragua)": "es-NI",
        "Spanish (Panama)": "es-PA",
        "Spanish (Paraguay)": "es-PY",
        "Spanish (Peru)": "es-PE",
        "Spanish (Puerto Rico)": "es-PR",
        "Spanish (Spain)": "es",
        "Spanish (Uruguay)": "es-UY",
        "Spanish (Venezuela)": "es-VE",
        Swedish: "sv",
        "Swedish (Finland)": "sv-FI",
        Thai: "th",
        Tsonga: "ts",
        Tswana: "tn",
        Turkish: "tr",
        Ukrainian: "ua",
        Urdu: "ur",
        Venda: "ve",
        Vietnamese: "vi",
        Welsh: "cy",
        Xhosa: "xh",
        Yiddish: "ji",
        Zulu: "zu"
    }, DOM = tinymce.DOM;
    tinymce.PluginManager.add("langcode", function(ed, url) {
        ed.onPreInit.add(function() {
            ed.formatter.register({
                langcode: {
                    inline: "span",
                    remove: "all",
                    attributes: {
                        lang: "%value"
                    }
                }
            });
        }), ed.addButton("langcode", {
            title: "langcode.desc",
            onclick: function() {
                var cm = ed.controlManager, form = cm.createForm("language_form"), langList = cm.createListBox("language_lang", {
                    label: ed.getLang("langcode.label", "Language"),
                    onselect: function(v) {},
                    name: "language",
                    filter: !0
                });
                langList.add("--", ""), tinymce.each(languageValues, function(value, name) {
                    langList.add(name, value);
                }), form.add(langList), ed.windowManager.open({
                    title: ed.getLang("langcode.title", "Language Code"),
                    items: [ form ],
                    size: "mce-modal-landscape-small",
                    open: function() {
                        var node = ed.selection.getNode(), value = ed.settings.language;
                        node.hasAttribute("lang") && (value = node.getAttribute("lang"), 
                        DOM.setHTML(this.id + "_insert", ed.getLang("update", "Update"))), 
                        langList.value(value);
                    },
                    buttons: [ {
                        title: ed.getLang("common.cancel", "Cancel"),
                        id: "cancel"
                    }, {
                        title: ed.getLang("common.insert", "Insert"),
                        id: "insert",
                        onsubmit: function(e) {
                            var node = ed.selection.getNode(), selection = ed.selection, data = form.submit();
                            !selection.isCollapsed() && selection.getContent() == selection.getContent({
                                format: "text"
                            }) ? 1 < (selection = selection.getSelectedBlocks()).length ? tinymce.each(selection, function(elm) {
                                ed.dom.setAttrib(elm, "lang", data.language);
                            }) : data.language ? ed.formatter.apply("langcode", {
                                value: data.language
                            }) : ed.formatter.remove("langcode") : node && !function(node) {
                                return node == ed.dom.getRoot();
                            }(node) && ed.dom.setAttrib(node, "lang", data.language), 
                            tinymce.dom.Event.cancel(e);
                        },
                        classes: "primary",
                        autofocus: !0
                    } ]
                });
            }
        });
    });
}();