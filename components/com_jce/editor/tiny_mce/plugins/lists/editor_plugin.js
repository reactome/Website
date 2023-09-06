/* jce - 2.9.41 | 2023-08-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function() {
    function isListNode(node) {
        return node && /^(OL|UL|DL)$/.test(node.nodeName);
    }
    function isFirstChild(node) {
        return node.parentNode.firstChild == node;
    }
    function isLastChild(node) {
        return node.parentNode.lastChild == node;
    }
    tinymce.create("tinymce.plugins.Lists", {
        init: function(editor) {
            var self = this;
            function isTextBlock(node) {
                return node && editor.schema.getTextBlockElements()[node.nodeName];
            }
            function isEmpty(elm, keepBookmarks) {
                elm = editor.dom.isEmpty(elm);
                return !(keepBookmarks && 0 < editor.dom.select("span[data-mce-type=bookmark]").length) && elm;
            }
            function createBookmark(rng) {
                var bookmark = {};
                function setupEndPoint(start) {
                    var offsetNode, container = rng[start ? "startContainer" : "endContainer"], offset = rng[start ? "startOffset" : "endOffset"];
                    1 == container.nodeType && (offsetNode = editor.dom.create("span", {
                        "data-mce-type": "bookmark"
                    }), container.hasChildNodes() ? (offset = Math.min(offset, container.childNodes.length - 1), 
                    start ? container.insertBefore(offsetNode, container.childNodes[offset]) : editor.dom.insertAfter(offsetNode, container.childNodes[offset])) : container.appendChild(offsetNode), 
                    container = offsetNode, offset = 0), bookmark[start ? "startContainer" : "endContainer"] = container, 
                    bookmark[start ? "startOffset" : "endOffset"] = offset;
                }
                return setupEndPoint(!0), rng.collapsed || setupEndPoint(), bookmark;
            }
            function moveToBookmark(bookmark) {
                function restoreEndPoint(start) {
                    var container, offset, node;
                    container = node = bookmark[start ? "startContainer" : "endContainer"], 
                    offset = bookmark[start ? "startOffset" : "endOffset"], container && (1 == container.nodeType && (offset = function(container) {
                        for (var node = container.parentNode.firstChild, idx = 0; node; ) {
                            if (node == container) return idx;
                            1 == node.nodeType && "bookmark" == node.getAttribute("data-mce-type") || idx++, 
                            node = node.nextSibling;
                        }
                        return -1;
                    }(container), container = container.parentNode, editor.dom.remove(node)), 
                    bookmark[start ? "startContainer" : "endContainer"] = container, 
                    bookmark[start ? "startOffset" : "endOffset"] = offset);
                }
                restoreEndPoint(!0), restoreEndPoint();
                var rng = editor.dom.createRng();
                rng.setStart(bookmark.startContainer, bookmark.startOffset), bookmark.endContainer && rng.setEnd(bookmark.endContainer, bookmark.endOffset), 
                editor.selection.setRng(rng);
            }
            function createNewTextBlock(contentNode, blockName) {
                var node, textBlock, hasContentNode, fragment = editor.dom.createFragment(), blockElements = editor.schema.getBlockElements();
                if ((blockName = editor.settings.forced_root_block ? blockName || editor.settings.forced_root_block : blockName) && ((textBlock = editor.dom.create(blockName)).tagName === editor.settings.forced_root_block && editor.dom.setAttribs(textBlock, editor.settings.forced_root_block_attrs), 
                fragment.appendChild(textBlock)), contentNode) for (;node = contentNode.firstChild; ) {
                    var nodeName = node.nodeName;
                    hasContentNode || "SPAN" == nodeName && "bookmark" == node.getAttribute("data-mce-type") || (hasContentNode = !0), 
                    blockElements[nodeName] ? (fragment.appendChild(node), textBlock = null) : (blockName ? (textBlock || (textBlock = editor.dom.create(blockName), 
                    fragment.appendChild(textBlock)), textBlock) : fragment).appendChild(node);
                }
                return editor.settings.forced_root_block ? hasContentNode || textBlock.appendChild(editor.dom.create("br", {
                    "data-mce-bogus": "1"
                })) : fragment.appendChild(editor.dom.create("br")), fragment;
            }
            function getSelectedListItems() {
                return tinymce.grep(editor.selection.getSelectedBlocks(), function(block) {
                    return /^(LI|DT|DD)$/.test(block.nodeName);
                });
            }
            function splitList(ul, li, newBlock) {
                var tmpRng, bookmarks, node, targetNode;
                for (bookmarks = editor.dom.select('span[data-mce-type="bookmark"]', ul), 
                newBlock = newBlock || createNewTextBlock(li), (tmpRng = editor.dom.createRng()).setStartAfter(li), 
                tmpRng.setEndAfter(ul), node = (tmpRng = tmpRng.extractContents()).firstChild; node; node = node.firstChild) if ("LI" == node.nodeName && editor.dom.isEmpty(node)) {
                    editor.dom.remove(node);
                    break;
                }
                editor.dom.isEmpty(tmpRng) || editor.dom.insertAfter(tmpRng, ul), 
                editor.dom.insertAfter(newBlock, ul), isEmpty(li.parentNode) && (targetNode = li.parentNode, 
                tinymce.each(bookmarks, function(node) {
                    targetNode.parentNode.insertBefore(node, li.parentNode);
                }), editor.dom.remove(targetNode)), editor.dom.remove(li), isEmpty(ul) && editor.dom.remove(ul);
            }
            function mergeWithAdjacentLists(listBlock) {
                var node, sibling = listBlock.nextSibling;
                if (sibling && isListNode(sibling) && sibling.nodeName == listBlock.nodeName) {
                    for (;node = sibling.firstChild; ) listBlock.appendChild(node);
                    editor.dom.remove(sibling);
                }
                if ((sibling = listBlock.previousSibling) && isListNode(sibling) && sibling.nodeName == listBlock.nodeName) {
                    for (;node = sibling.firstChild; ) listBlock.insertBefore(node, listBlock.firstChild);
                    editor.dom.remove(sibling);
                }
            }
            function outdent(li) {
                var ul = li.parentNode, ulParent = ul.parentNode;
                function removeEmptyLi(li) {
                    isEmpty(li) && editor.dom.remove(li);
                }
                return "DD" == li.nodeName ? editor.dom.rename(li, "DT") : isFirstChild(li) && isLastChild(li) ? "LI" == ulParent.nodeName ? (editor.dom.insertAfter(li, ulParent), 
                removeEmptyLi(ulParent), editor.dom.remove(ul)) : isListNode(ulParent) ? editor.dom.remove(ul, !0) : (ulParent.insertBefore(createNewTextBlock(li), ul), 
                editor.dom.remove(ul)) : isFirstChild(li) ? "LI" == ulParent.nodeName ? (editor.dom.insertAfter(li, ulParent), 
                li.appendChild(ul), removeEmptyLi(ulParent)) : isListNode(ulParent) ? ulParent.insertBefore(li, ul) : (ulParent.insertBefore(createNewTextBlock(li), ul), 
                editor.dom.remove(li)) : isLastChild(li) ? "LI" == ulParent.nodeName ? editor.dom.insertAfter(li, ulParent) : isListNode(ulParent) ? editor.dom.insertAfter(li, ul) : (editor.dom.insertAfter(createNewTextBlock(li), ul), 
                editor.dom.remove(li)) : (ulParent = "LI" == ulParent.nodeName ? (ul = ulParent, 
                createNewTextBlock(li, "LI")) : isListNode(ulParent) ? createNewTextBlock(li, "LI") : createNewTextBlock(li), 
                splitList(ul, li, ulParent), li = ul.parentNode, tinymce.each(tinymce.grep(editor.dom.select("ol,ul", li)), function(ul) {
                    var sibling, parentNode = ul.parentNode;
                    "LI" == parentNode.nodeName && parentNode.firstChild == ul && (sibling = parentNode.previousSibling) && "LI" == sibling.nodeName && (sibling.appendChild(ul), 
                    isEmpty(parentNode)) && editor.dom.remove(parentNode), isListNode(parentNode) && (sibling = parentNode.previousSibling) && "LI" == sibling.nodeName && sibling.appendChild(ul);
                })), 1;
            }
            function indent(li) {
                var sibling, newList;
                if ("DT" == li.nodeName) return editor.dom.rename(li, "DD"), 1;
                if ((sibling = li.previousSibling) && isListNode(sibling)) return sibling.appendChild(li), 
                1;
                if (sibling && "LI" == sibling.nodeName && isListNode(sibling.lastChild)) {
                    sibling.lastChild.appendChild(li);
                    var node, from = li.lastChild, to = sibling.lastChild;
                    if (isListNode(from)) {
                        for (;node = li.lastChild.firstChild; ) to.appendChild(node);
                        editor.dom.remove(from);
                    }
                    return 1;
                }
                return (sibling = li.nextSibling) && isListNode(sibling) ? (sibling.insertBefore(li, sibling.firstChild), 
                1) : (sibling = li.previousSibling || li.nextSibling) && "LI" == sibling.nodeName ? (newList = editor.dom.create(li.parentNode.nodeName), 
                li.previousSibling ? sibling.appendChild(newList) : appendToNewList(li, newList), 
                newList.appendChild(li), 1) : !sibling && isListNode(li.parentNode) && (newList = editor.dom.create(li.parentNode.nodeName), 
                appendToNewList(li, newList), newList.appendChild(li), 1);
                function appendToNewList(li, newList) {
                    var listItem = editor.dom.create("li", {
                        style: "list-style-type: none;"
                    });
                    li.parentNode.insertBefore(listItem, li), listItem.appendChild(newList);
                }
            }
            function indentSelection() {
                var listElements = getSelectedListItems();
                if (listElements.length) {
                    for (var bookmark = createBookmark(editor.selection.getRng(!0)), i = 0; i < listElements.length && (indent(listElements[i]) || 0 !== i); i++);
                    return moveToBookmark(bookmark), editor.nodeChanged(), 1;
                }
            }
            function outdentSelection() {
                var listElements = getSelectedListItems();
                if (listElements.length) {
                    for (var y, bookmark = createBookmark(editor.selection.getRng(!0)), root = editor.getBody(), i = listElements.length; i--; ) for (var node = listElements[i].parentNode; node && node != root; ) {
                        for (y = listElements.length; y--; ) if (listElements[y] === node) {
                            listElements.splice(i, 1);
                            break;
                        }
                        node = node.parentNode;
                    }
                    for (i = 0; i < listElements.length && (outdent(listElements[i]) || 0 !== i); i++);
                    return moveToBookmark(bookmark), editor.nodeChanged(), 1;
                }
            }
            function applyList(listName) {
                var rng = editor.selection.getRng(!0), bookmark = createBookmark(rng), listItemName = "LI";
                "DL" == (listName = listName.toUpperCase()) && (listItemName = "DT"), 
                tinymce.each(function() {
                    var textBlocks = [], root = editor.dom.get(editor.settings.editable_root) || editor.getBody();
                    function getEndPointNode(start) {
                        var container = rng[start ? "startContainer" : "endContainer"], start = rng[start ? "startOffset" : "endOffset"];
                        for (1 == container.nodeType && (container = container.childNodes[Math.min(start, container.childNodes.length - 1)] || container); container.parentNode != root; ) {
                            if (isTextBlock(container)) return container;
                            if (/^(TD|TH)$/.test(container.parentNode.nodeName)) return container;
                            container = container.parentNode;
                        }
                        return container;
                    }
                    for (var block, startNode = getEndPointNode(!0), endNode = getEndPointNode(), siblings = [], node = startNode; node && (siblings.push(node), 
                    node != endNode); node = node.nextSibling);
                    return tinymce.each(siblings, function(node) {
                        var nextSibling;
                        isTextBlock(node) ? (textBlocks.push(node), block = null) : editor.dom.isBlock(node) || "BR" == node.nodeName ? ("BR" == node.nodeName && editor.dom.remove(node), 
                        block = null) : (nextSibling = node.nextSibling, !function(node) {
                            return node && "SPAN" === node.tagName && "bookmark" === node.getAttribute("data-mce-type");
                        }(node) || !isTextBlock(nextSibling) && (nextSibling || node.parentNode != root) ? (block || (block = editor.dom.create("p"), 
                        node.parentNode.insertBefore(block, node), textBlocks.push(block)), 
                        block.appendChild(node)) : block = null);
                    }), textBlocks;
                }(), function(block) {
                    var listBlock, sibling = block.previousSibling;
                    sibling && isListNode(sibling) && sibling.nodeName == listName ? (listBlock = sibling, 
                    block = editor.dom.rename(block, listItemName), sibling.appendChild(block)) : (listBlock = editor.dom.create(listName), 
                    block.parentNode.insertBefore(listBlock, block), listBlock.appendChild(block), 
                    block = editor.dom.rename(block, listItemName)), mergeWithAdjacentLists(listBlock);
                }), moveToBookmark(bookmark);
            }
            function removeList() {
                var bookmark = createBookmark(editor.selection.getRng(!0)), root = editor.dom.get(editor.settings.editable_root) || editor.getBody();
                tinymce.each(getSelectedListItems(), function(li) {
                    var node, rootList;
                    if (isEmpty(li)) outdent(li); else {
                        for (node = li; node && node != root; node = node.parentNode) isListNode(node) && (rootList = node);
                        splitList(rootList, li);
                    }
                }), moveToBookmark(bookmark);
            }
            function toggleList(listName) {
                var bookmark, parentList = editor.dom.getParent(editor.selection.getStart(), "OL,UL,DL");
                parentList ? parentList.nodeName == listName ? removeList() : (bookmark = createBookmark(editor.selection.getRng(!0)), 
                mergeWithAdjacentLists(editor.dom.rename(parentList, listName)), 
                moveToBookmark(bookmark)) : applyList(listName);
            }
            function queryListCommandState(listName) {
                return function() {
                    var parentList = editor.dom.getParent(editor.selection.getStart(), "UL,OL,DL");
                    return parentList && parentList.nodeName == listName;
                };
            }
            self.backspaceDelete = function(isForward) {
                function mergeLiElements(fromElm, toElm) {
                    var node, listNode, ul = fromElm.parentNode;
                    if (isListNode(toElm.lastChild) && (listNode = toElm.lastChild), 
                    (node = toElm.lastChild) && "BR" == node.nodeName && fromElm.hasChildNodes() && editor.dom.remove(node), 
                    isEmpty(toElm, !0) && editor.dom.empty(editor.dom.select(toElm)), 
                    !isEmpty(fromElm, !0)) for (;node = fromElm.firstChild; ) toElm.appendChild(node);
                    listNode && toElm.appendChild(listNode), editor.dom.remove(fromElm), 
                    isEmpty(ul) && editor.dom.remove(ul);
                }
                if (editor.selection.isCollapsed()) {
                    var li = editor.dom.getParent(editor.selection.getStart(), "LI");
                    if (li) {
                        var rng = editor.selection.getRng(!0), otherLi = editor.dom.getParent(function(rng, isForward) {
                            var nonEmptyBlocks, walker, node = rng.startContainer, offset = rng.startOffset;
                            if (3 == node.nodeType && (isForward ? offset < node.data.length : 0 < offset)) return node;
                            for (nonEmptyBlocks = editor.schema.getNonEmptyElements(), 
                            1 == node.nodeType && (node = tinymce.dom.RangeUtils.getNode(node, offset)), 
                            walker = new tinymce.dom.TreeWalker(rng.startContainer), 
                            !isForward || !function(node) {
                                return "BR" == node.nodeName && node.getAttribute("data-mce-bogus");
                            }(node) || walker.next(); node = walker[isForward ? "next" : "prev"](); ) {
                                if ("LI" == node.nodeName && !node.hasChildNodes()) return node;
                                if (nonEmptyBlocks[node.nodeName]) return node;
                                if (3 == node.nodeType && 0 < node.data.length) return node;
                            }
                        }(rng, isForward), "LI");
                        if (otherLi && otherLi != li) return rng = createBookmark(rng), 
                        isForward ? mergeLiElements(otherLi, li) : mergeLiElements(li, otherLi), 
                        moveToBookmark(rng), !0;
                        otherLi || isForward || removeList(li.parentNode.nodeName);
                    }
                }
            }, editor.onBeforeExecCommand.add(function(ed, cmd, ui, v, o) {
                if ("indent" == cmd.toLowerCase()) {
                    if (indentSelection()) return o.terminate = !0;
                } else if ("outdent" == cmd.toLowerCase() && outdentSelection()) return o.terminate = !0;
            }), editor.addCommand("InsertUnorderedList", function() {
                toggleList("UL");
            }), editor.addCommand("InsertOrderedList", function() {
                toggleList("OL");
            }), editor.addCommand("InsertDefinitionList", function() {
                toggleList("DL");
            }), editor.addQueryStateHandler("InsertUnorderedList", queryListCommandState("UL")), 
            editor.addQueryStateHandler("InsertOrderedList", queryListCommandState("OL")), 
            editor.addQueryStateHandler("InsertDefinitionList", queryListCommandState("DL")), 
            editor.onKeyDown.add(function(ed, e) {
                9 != e.keyCode || tinymce.VK.metaKeyPressed(e) || (editor.dom.getParent(editor.selection.getStart(), "LI,DT,DD") && (e.preventDefault(), 
                (e.shiftKey ? outdentSelection : indentSelection)()), e.keyCode == tinymce.VK.BACKSPACE ? self.backspaceDelete() && e.preventDefault() : e.keyCode == tinymce.VK.DELETE && self.backspaceDelete(!0) && e.preventDefault());
            });
        },
        backspaceDelete: function(isForward) {
            return this.backspaceDelete(isForward);
        }
    }), tinymce.PluginManager.add("lists", tinymce.plugins.Lists);
}();