/* jce - 2.9.88 | 2025-06-19 | https://www.joomlacontenteditor.net | Source: https://github.com/widgetfactory/jce | Copyright (C) 2006 - 2025 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    var DOM = tinymce.DOM, each = tinymce.each, emoji = [ {
        "\ud83d\ude00": "grinning_face"
    }, {
        "\ud83d\ude01": "grinning_face_with_smiling_eyes"
    }, {
        "\ud83d\ude02": "face_with_tears_of_joy"
    }, {
        "\ud83d\ude03": "smiling_face_with_open_mouth"
    }, {
        "\ud83d\ude04": "smiling_face_with_open_mouth_and_smiling_eyes"
    }, {
        "\ud83d\ude05": "smiling_face_with_open_mouth_and_cold_sweat"
    }, {
        "\ud83d\ude06": "smiling_face_with_open_mouth_and_tightly_closed_eyes"
    }, {
        "\ud83d\ude07": "smiling_face_with_halo"
    }, {
        "\ud83d\ude08": "smiling_face_with_horns"
    }, {
        "\ud83d\ude09": "winking_face"
    }, {
        "\ud83d\ude0a": "smiling_face_with_smiling_eyes"
    }, {
        "\ud83d\ude0b": "face_savouring_delicious_food"
    }, {
        "\ud83d\ude0c": "relieved_face"
    }, {
        "\ud83d\ude0d": "smiling_face_with_heart_shaped_eyes"
    }, {
        "\ud83d\ude0e": "smiling_face_with_sunglasses"
    }, {
        "\ud83d\ude0f": "smirking_face"
    }, {
        "\ud83d\ude10": "neutral_face"
    }, {
        "\ud83d\ude11": "expressionless_face"
    }, {
        "\ud83d\ude12": "unamused_face"
    }, {
        "\ud83d\ude13": "face_with_cold_sweat"
    }, {
        "\ud83d\ude14": "pensive_face"
    }, {
        "\ud83d\ude15": "confused_face"
    }, {
        "\ud83d\ude16": "confounded_face"
    }, {
        "\ud83d\ude17": "kissing_face"
    }, {
        "\ud83d\ude18": "face_throwing_a_kiss"
    }, {
        "\ud83d\ude19": "kissing_face_with_smiling_eyes"
    }, {
        "\ud83d\ude1a": "kissing_face_with_closed_eyes"
    }, {
        "\ud83d\ude1b": "face_with_stuck_out_tongue"
    }, {
        "\ud83d\ude1c": "face_with_stuck_out_tongue_and_winking_eye"
    }, {
        "\ud83d\ude1d": "face_with_stuck_out_tongue_and_tightly_closed_eyes"
    }, {
        "\ud83d\ude1e": "disappointed_face"
    }, {
        "\ud83d\ude1f": "worried_face"
    }, {
        "\ud83d\ude20": "angry_face"
    }, {
        "\ud83d\ude21": "pouting_face"
    }, {
        "\ud83d\ude22": "crying_face"
    }, {
        "\ud83d\ude23": "persevering_face"
    }, {
        "\ud83d\ude24": "face_with_look_of_triumph"
    }, {
        "\ud83d\ude25": "disappointed_but_relieved_face"
    }, {
        "\ud83d\ude26": "frowning_face_with_open_mouth"
    }, {
        "\ud83d\ude27": "anguished_face"
    }, {
        "\ud83d\ude28": "fearful_face"
    }, {
        "\ud83d\ude29": "weary_face"
    }, {
        "\ud83d\ude2a": "sleepy_face"
    }, {
        "\ud83d\ude2b": "tired_face"
    }, {
        "\ud83d\ude2c": "grimacing_face"
    }, {
        "\ud83d\ude2d": "loudly_crying_face"
    }, {
        "\ud83d\ude2e": "face_with_open_mouth"
    }, {
        "\ud83d\ude2f": "hushed_face"
    }, {
        "\ud83d\ude30": "face_with_open_mouth_and_cold_sweat"
    }, {
        "\ud83d\ude31": "face_screaming_in_fear"
    }, {
        "\ud83d\ude32": "astonished_face"
    }, {
        "\ud83d\ude33": "flushed_face"
    }, {
        "\ud83d\ude34": "sleeping_face"
    }, {
        "\ud83d\ude35": "dizzy_face"
    }, {
        "\ud83d\ude36": "face_without_mouth"
    }, {
        "\ud83d\ude37": "face_with_medical_mask"
    }, {
        "\ud83d\ude38": "grinning_cat_face_with_smiling_eyes"
    }, {
        "\ud83d\ude39": "cat_face_with_tears_of_joy"
    }, {
        "\ud83d\ude3a": "smiling_cat_face_with_open_mouth"
    }, {
        "\ud83d\ude3b": "smiling_cat_face_with_heart_shaped_eyes"
    }, {
        "\ud83d\ude3c": "cat_face_with_wry_smile"
    }, {
        "\ud83d\ude3d": "kissing_cat_face_with_closed_eyes"
    }, {
        "\ud83d\ude3e": "pouting_cat_face"
    }, {
        "\ud83d\ude3f": "crying_cat_face"
    }, {
        "\ud83d\ude40": "weary_cat_face"
    }, {
        "\ud83d\ude41": "slightly_frowning_face"
    }, {
        "\ud83d\ude42": "slightly_smiling_face"
    }, {
        "\ud83d\ude43": "upside_down_face"
    }, {
        "\ud83d\ude44": "face_with_rolling_eyes"
    }, {
        "\ud83d\ude45": "face_with_no_good_gesture"
    }, {
        "\ud83d\ude46": "face_with_ok_gesture"
    }, {
        "\ud83d\ude47": "person_bowing_deeply"
    }, {
        "\ud83d\ude48": "see_no_evil_monkey"
    }, {
        "\ud83d\ude49": "hear_no_evil_monkey"
    }, {
        "\ud83d\ude4a": "speak_no_evil_monkey"
    }, {
        "\ud83d\ude4b": "happy_person_raising_one_hand"
    }, {
        "\ud83d\ude4c": "person_raising_both_hands_in_celebration"
    }, {
        "\ud83d\ude4d": "person_frowning"
    }, {
        "\ud83d\ude4e": "person_with_pouting_face"
    }, {
        "\ud83d\ude4f": "person_with_folded_hands"
    } ];
    tinymce.PluginManager.add("emotions", function(ed, url) {
        var self = this;
        function createEmojiContent(icons, path) {
            var content = document.createElement("div");
            return path && -1 === path.indexOf("://") && (path = ed.documentBaseURI.toAbsolute(path, !0)), 
            each(icons, function(data) {
                var label, src, item;
                "string" == typeof data && (label = "", src = data, item = {}, path && (src = path + "/" + data), 
                /\.(png|jpg|jpeg|gif)$/i.test(data) && (label = data.replace(/\.[^.]+$/i, ""), 
                data = '<img src="' + src + '" alt="' + ed.getLang("emotions." + label, label) + '" />'), 
                item[data] = label, data = item), each(data, function(label, key) {
                    var src;
                    /\.(png|jpg|jpeg|gif)$/i.test(key) && (src = key, path && (src = path + "/" + src), 
                    key = '<img src="' + (src = ed.documentBaseURI.toAbsolute(src, !0)) + '" alt="' + ed.getLang("emotions." + label, label) + '" />'), 
                    DOM.add(content, "button", {
                        class: "mce_emotions_icon",
                        title: ed.getLang("emotions." + label, label)
                    }, key);
                });
            }), content.innerHTML;
        }
        ed.addButton("emotions", {
            title: "emotions.desc",
            cmd: "mceEmotion"
        }), self.content = "";
        var path = ed.getParam("emotions_url", url + "/img"), icons = ed.getParam("emotions_smilies", emoji, "hash");
        this.content = createEmojiContent(icons, path), this.loaded = !1, path && /\.(json|txt)$/.test(path) && !this.loaded && (-1 === path.indexOf("://") && (path = ed.documentBaseURI.toAbsolute(path, !0)), 
        this.loaded = !0, tinymce.util.XHR.send({
            url: path,
            success: function(text) {
                try {
                    icons = JSON.parse(text);
                } catch (e) {}
                path = path.substring(0, path.lastIndexOf("/")), self.content = createEmojiContent(icons, path);
            }
        })), this.createControl = function(n, cm) {
            var ctrl, self = this;
            return "emotions" !== n ? null : ((ctrl = cm.createSplitButton("emotions", {
                title: "emotions.desc",
                onselect: function(elm) {
                    insertEmoticon(elm);
                }
            })).onRenderMenu.add(function(c, m) {
                var item = m.add({
                    onclick: function(e) {
                        e.preventDefault(), item.setSelected(!1), insertEmoticon(e.target), 
                        m.hideMenu();
                    },
                    html: '<div id="' + ed.id + '_emotions_panel" class="mceEmoticonsMenu"></div>'
                });
                m.onShowMenu.add(function() {
                    DOM.setHTML(ed.id + "_emotions_panel", self.content);
                });
            }), ed.onRemove.add(function() {
                ctrl.destroy();
            }), ctrl);
            function insertEmoticon(n) {
                var html, p = DOM.getParent(n, ".mce_emotions_icon");
                p && (html = p.innerText, "IMG" === n.nodeName && (n.setAttribute("src", ed.documentBaseURI.toRelative(n.src)), 
                html = p.innerHTML), ed.execCommand("mceInsertContent", !1, html));
            }
        };
    });
}();