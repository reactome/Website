/* jce - 2.9.41 | 2023-08-23 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2023 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, VK = tinymce.VK, TreeWalker = tinymce.dom.TreeWalker, Delay = tinymce.util.Delay;
    function getSpanVal(td, name) {
        return parseInt(td.getAttribute(name) || 1, 10);
    }
    function TableGrid(table, dom, selection, settings) {
        var grid, startPos, endPos, selectedCell, gridWidth, maxX, maxY;
        function cloneNode(node, children) {
            return (node = node.cloneNode(children)).removeAttribute("id"), node;
        }
        function buildGrid() {
            var startY = 0;
            grid = [], gridWidth = 0, each([ "thead", "tbody", "tfoot" ], function(part) {
                var rows = dom.select("> " + part + " tr", table);
                each(rows, function(tr, y) {
                    y += startY, each(dom.select("> td, > th", tr), function(td, x) {
                        var x2, y2, rowspan, colspan;
                        if (grid[y]) for (;grid[y][x]; ) x++;
                        for (rowspan = getSpanVal(td, "rowspan"), colspan = getSpanVal(td, "colspan"), 
                        y2 = y; y2 < y + rowspan; y2++) for (grid[y2] || (grid[y2] = []), 
                        x2 = x; x2 < x + colspan; x2++) grid[y2][x2] = {
                            part: part,
                            real: y2 == y && x2 == x,
                            elm: td,
                            rowspan: rowspan,
                            colspan: colspan
                        };
                        gridWidth = Math.max(gridWidth, x + 1);
                    });
                }), startY += rows.length;
            });
        }
        function getCell(x, y) {
            y = grid[y];
            if (y) return y[x];
        }
        function setSpanVal(td, name, val) {
            td && (1 === (val = parseInt(val, 10)) ? td.removeAttribute(name, 1) : td.setAttribute(name, val, 1));
        }
        function isCellSelected(cell) {
            return cell && (dom.hasClass(cell.elm, "mceSelected") || cell == selectedCell);
        }
        function getSelectedRows() {
            var rows = [];
            return each(table.rows, function(row) {
                each(row.cells, function(cell) {
                    if (dom.hasClass(cell, "mceSelected") || cell == selectedCell.elm) return rows.push(row), 
                    !1;
                });
            }), rows;
        }
        function cloneCell(cell) {
            var formatNode, cloneFormats = {};
            return settings.table_clone_elements && (cloneFormats = tinymce.makeMap((settings.table_clone_elements || "strong em b i span font h1 h2 h3 h4 h5 h6 p div").toUpperCase(), /[ ,]/)), 
            tinymce.walk(cell, function(node) {
                var curNode;
                if (3 == node.nodeType) return each(dom.getParents(node.parentNode, null, cell).reverse(), function(node) {
                    cloneFormats[node.nodeName] && (node = cloneNode(node, !1), 
                    formatNode ? curNode && curNode.appendChild(node) : formatNode = curNode = node, 
                    curNode = node);
                }), curNode && (curNode.innerHTML = '<br data-mce-bogus="1" />'), 
                !1;
            }, "childNodes"), setSpanVal(cell = cloneNode(cell, !1), "rowSpan", 1), 
            setSpanVal(cell, "colSpan", 1), formatNode ? cell.appendChild(formatNode) : tinymce.isIE && !tinymce.isIE11 || (cell.innerHTML = '<br data-mce-bogus="1" />'), 
            cell;
        }
        function cleanup() {
            var rng = dom.createRng();
            each(dom.select("tr", table), function(tr) {
                0 == tr.cells.length && dom.remove(tr);
            }), 0 == dom.select("tr", table).length ? (rng.setStartAfter(table), 
            rng.setEndAfter(table), selection.setRng(rng), dom.remove(table)) : (each(dom.select("thead,tbody,tfoot", table), function(part) {
                0 == part.rows.length && dom.remove(part);
            }), buildGrid(), (rng = grid[Math.min(grid.length - 1, startPos.y)]) && (selection.select(rng[Math.min(rng.length - 1, startPos.x)].elm, !0), 
            selection.collapse(!0)));
        }
        function fillLeftDown(x, y, rows, cols) {
            for (var x2, c, cell, tr = grid[y][x].elm.parentNode, r = 1; r <= rows; r++) if (tr = dom.getNext(tr, "tr")) {
                for (x2 = x; 0 <= x2; x2--) if ((cell = grid[y + r][x2].elm).parentNode == tr) {
                    for (c = 1; c <= cols; c++) dom.insertAfter(cloneCell(cell), cell);
                    break;
                }
                if (-1 == x2) for (c = 1; c <= cols; c++) tr.insertBefore(cloneCell(tr.cells[0]), tr.cells[0]);
            }
        }
        function split() {
            each(grid, function(row, y) {
                each(row, function(cell, x) {
                    var colSpan, rowSpan, i;
                    if (isCellSelected(cell) && (colSpan = getSpanVal(cell = cell.elm, "colspan"), 
                    rowSpan = getSpanVal(cell, "rowspan"), 1 < colSpan || 1 < rowSpan)) {
                        for (setSpanVal(cell, "rowSpan", 1), setSpanVal(cell, "colSpan", 1), 
                        i = 0; i < colSpan - 1; i++) dom.insertAfter(cloneCell(cell), cell);
                        fillLeftDown(x, y, rowSpan - 1, colSpan);
                    }
                });
            });
        }
        function getPos(target) {
            var pos;
            return each(grid, function(row, y) {
                return each(row, function(cell, x) {
                    if (cell.elm == target) return !(pos = {
                        x: x,
                        y: y
                    });
                }), !pos;
            }), pos;
        }
        buildGrid(), (selectedCell = dom.getParent(selection.getStart(), "th,td")) && (startPos = getPos(selectedCell), 
        maxX = maxY = 0, each(grid, function(row, y) {
            each(row, function(cell, x) {
                var colSpan;
                isCellSelected(cell) && (cell = grid[y][x], maxX < x && (maxX = x), 
                maxY < y && (maxY = y), cell.real) && (colSpan = cell.colspan - 1, 
                cell = cell.rowspan - 1, colSpan && maxX < x + colSpan && (maxX = x + colSpan), 
                cell) && maxY < y + cell && (maxY = y + cell);
            });
        }), endPos = {
            x: maxX,
            y: maxY
        }, selectedCell = getCell(startPos.x, startPos.y)), tinymce.extend(this, {
            deleteTable: function() {
                var rng = dom.createRng();
                rng.setStartAfter(table), rng.setEndAfter(table), selection.setRng(rng), 
                dom.remove(table);
            },
            split: split,
            merge: function(cell, cols, rows) {
                var startX, endX, x, y, children, count, pos, endY = cell ? (endX = (startX = (pos = getPos(cell)).x) + (cols - 1), 
                (pos = pos.y) + (rows - 1)) : (startPos = endPos = null, each(grid, function(row, y) {
                    each(row, function(cell, x) {
                        isCellSelected(cell) && (startPos = startPos || {
                            x: x,
                            y: y
                        }, endPos = {
                            x: x,
                            y: y
                        });
                    });
                }), startX = startPos.x, pos = startPos.y, endX = endPos.x, endPos.y), startCell = getCell(startX, pos), cols = getCell(endX, endY);
                if (startCell && cols && startCell.part == cols.part) {
                    for (split(), buildGrid(), setSpanVal(startCell = getCell(startX, pos).elm, "colSpan", endX - startX + 1), 
                    setSpanVal(startCell, "rowSpan", endY - pos + 1), y = pos; y <= endY; y++) for (x = startX; x <= endX; x++) grid[y] && grid[y][x] && (cell = grid[y][x].elm) != startCell && (children = tinymce.grep(cell.childNodes), 
                    each(children, function(node) {
                        startCell.appendChild(node);
                    }), children.length && (children = tinymce.grep(startCell.childNodes), 
                    count = 0, each(children, function(node) {
                        "BR" == node.nodeName && dom.getAttrib(node, "data-mce-bogus") && count++ < children.length - 1 && startCell.removeChild(node);
                    })), dom.remove(cell));
                    cleanup();
                }
            },
            insertRow: function(before) {
                var posY, cell, lastCell, x, rowElm, newRow, otherCell, rowSpan;
                for (each(grid, function(row, y) {
                    if (each(row, function(cell, x) {
                        if (isCellSelected(cell) && (cell = cell.elm, rowElm = cell.parentNode, 
                        newRow = cloneNode(rowElm, !1), posY = y, before)) return !1;
                    }), before) return !posY;
                }), x = 0; x < grid[0].length; x++) if (grid[posY][x] && (cell = grid[posY][x].elm) != lastCell) {
                    if (before) {
                        if (0 < posY && grid[posY - 1][x] && 1 < (rowSpan = getSpanVal(otherCell = grid[posY - 1][x].elm, "rowSpan"))) {
                            setSpanVal(otherCell, "rowSpan", rowSpan + 1);
                            continue;
                        }
                    } else if (1 < (rowSpan = getSpanVal(cell, "rowspan"))) {
                        setSpanVal(cell, "rowSpan", rowSpan + 1);
                        continue;
                    }
                    setSpanVal(otherCell = cloneCell(cell), "colSpan", cell.colSpan), 
                    newRow.appendChild(otherCell), lastCell = cell;
                }
                newRow.hasChildNodes() && (before ? rowElm.parentNode.insertBefore(newRow, rowElm) : dom.insertAfter(newRow, rowElm));
            },
            insertCol: function(before) {
                var posX, lastCell;
                each(grid, function(row, y) {
                    if (each(row, function(cell, x) {
                        if (isCellSelected(cell) && (posX = x, before)) return !1;
                    }), before) return !posX;
                }), each(grid, function(row, y) {
                    var rowSpan, colSpan;
                    row[posX] && (row = row[posX].elm) != lastCell && (colSpan = getSpanVal(row, "colspan"), 
                    rowSpan = getSpanVal(row, "rowspan"), 1 == colSpan ? (before ? row.parentNode.insertBefore(cloneCell(row), row) : dom.insertAfter(cloneCell(row), row), 
                    fillLeftDown(posX, y, rowSpan - 1, colSpan)) : getSpanVal(row, "colSpan", row.colSpan), 
                    lastCell = row);
                });
            },
            deleteCols: function() {
                var cols = [];
                each(grid, function(row, y) {
                    each(row, function(cell, x) {
                        isCellSelected(cell) && -1 === tinymce.inArray(cols, x) && (each(grid, function(row) {
                            var row = row[x].elm, colSpan = getSpanVal(row, "colSpan");
                            1 < colSpan ? setSpanVal(row, "colSpan", colSpan - 1) : dom.remove(row);
                        }), cols.push(x));
                    });
                }), cleanup();
            },
            deleteRows: function() {
                var rows;
                rows = getSelectedRows(), each(rows.reverse(), function(tr) {
                    !function(tr) {
                        var pos, lastCell;
                        each(tr.cells, function(cell) {
                            var rowSpan = getSpanVal(cell, "rowSpan");
                            1 < rowSpan && (setSpanVal(cell, "rowSpan", rowSpan - 1), 
                            fillLeftDown((pos = getPos(cell)).x, pos.y, 1, 1));
                        }), pos = getPos(tr.cells[0]), each(grid[pos.y], function(cell) {
                            var rowSpan;
                            (cell = cell.elm) != lastCell && ((rowSpan = getSpanVal(cell, "rowSpan")) <= 1 ? dom.remove(cell) : setSpanVal(cell, "rowSpan", rowSpan - 1), 
                            lastCell = cell);
                        });
                    }(tr);
                }), cleanup();
            },
            cutRows: function() {
                var rows = getSelectedRows();
                return dom.remove(rows), cleanup(), rows;
            },
            copyRows: function() {
                var rows = getSelectedRows();
                return each(rows, function(row, i) {
                    rows[i] = cloneNode(row, !0);
                }), rows;
            },
            pasteRows: function(rows, before) {
                var selectedRows, targetRow, targetCellCount;
                rows && (selectedRows = getSelectedRows(), targetRow = selectedRows[before ? 0 : selectedRows.length - 1], 
                targetCellCount = targetRow.cells.length, each(grid, function(row) {
                    var match;
                    if (targetCellCount = 0, each(row, function(cell, x) {
                        cell.real && (targetCellCount += cell.colspan), cell.elm.parentNode == targetRow && (match = 1);
                    }), match) return !1;
                }), before || rows.reverse(), each(rows, function(row) {
                    for (var cell, cellCount = row.cells.length, i = 0; i < cellCount; i++) setSpanVal(cell = row.cells[i], "colSpan", 1), 
                    setSpanVal(cell, "rowSpan", 1);
                    for (i = cellCount; i < targetCellCount; i++) row.appendChild(cloneCell(row.cells[cellCount - 1]));
                    for (i = targetCellCount; i < cellCount; i++) dom.remove(row.cells[i]);
                    before ? targetRow.parentNode.insertBefore(row, targetRow) : dom.insertAfter(row, targetRow);
                }), dom.removeClass(dom.select("td.mceSelected,th.mceSelected"), "mceSelected"));
            },
            getPos: getPos,
            setStartCell: function(cell) {
                startPos = getPos(cell);
            },
            setEndCell: function(cell) {
                var colSpan;
                if (endPos = getPos(cell), startPos && endPos) {
                    for (var endX, endY, startX = Math.min(startPos.x, endPos.x), startY = Math.min(startPos.y, endPos.y), maxX = endX = Math.max(startPos.x, endPos.x), maxY = endY = Math.max(startPos.y, endPos.y), y = startY; y <= maxY; y++) (cell = grid[y][startX]).real || startX - (cell.colspan - 1) < startX && (startX -= cell.colspan - 1);
                    for (var x = startX; x <= maxX; x++) (cell = grid[startY][x]).real || startY - (cell.rowspan - 1) < startY && (startY -= cell.rowspan - 1);
                    for (y = startY; y <= endY; y++) for (x = startX; x <= endX; x++) (cell = grid[y][x]).real && ((colSpan = cell.colspan - 1) && maxX < x + colSpan && (maxX = x + colSpan), 
                    colSpan = cell.rowspan - 1) && maxY < y + colSpan && (maxY = y + colSpan);
                    for (dom.removeClass(dom.select("td.mceSelected,th.mceSelected"), "mceSelected"), 
                    y = startY; y <= maxY; y++) for (x = startX; x <= maxX; x++) grid[y][x] && dom.addClass(grid[y][x].elm, "mceSelected");
                }
            },
            moveRelIdx: function(cellElm, delta) {
                var cell, pos = getPos(cellElm), index = pos.y * gridWidth + pos.x;
                do {
                    if (!(cell = getCell((index += delta) % gridWidth, Math.floor(index / gridWidth)))) break;
                    if (cell.elm != cellElm) return selection.select(cell.elm, !0), 
                    dom.isEmpty(cell.elm) && selection.collapse(!0), !0;
                } while (cell.elm == cellElm);
                return !1;
            },
            refresh: buildGrid
        });
    }
    tinymce.create("tinymce.plugins.TablePlugin", {
        init: function(ed, url) {
            var winMan, clipboardRows, hasCellSelection = !0;
            function createTableGrid(node) {
                var selection = ed.selection, node = ed.dom.getParent(node || selection.getNode(), "table");
                if (node) return new TableGrid(node, ed.dom, selection, ed.settings);
            }
            function cleanup(force) {
                ed.getBody().style.webkitUserSelect = "", (force || hasCellSelection) && (ed.dom.removeClass(ed.dom.select("td.mceSelected,th.mceSelected"), "mceSelected"), 
                hasCellSelection = !1);
            }
            (this.editor = ed).addButton("table", "table.desc", "mceInsertTable", !0), 
            ed.getParam("table_buttons", 1) && each([ [ "table", "table.desc", "mceInsertTable", !0 ], [ "delete_table", "table.del", "mceTableDelete" ], [ "delete_col", "table.delete_col_desc", "mceTableDeleteCol" ], [ "delete_row", "table.delete_row_desc", "mceTableDeleteRow" ], [ "col_after", "table.col_after_desc", "mceTableInsertColAfter" ], [ "col_before", "table.col_before_desc", "mceTableInsertColBefore" ], [ "row_after", "table.row_after_desc", "mceTableInsertRowAfter" ], [ "row_before", "table.row_before_desc", "mceTableInsertRowBefore" ], [ "row_props", "table.row_desc", "mceTableRowProps", !0 ], [ "cell_props", "table.cell_desc", "mceTableCellProps", !0 ], [ "split_cells", "table.split_cells_desc", "mceTableSplitCells", !0 ], [ "merge_cells", "table.merge_cells_desc", "mceTableMergeCells", !0 ] ], function(c) {
                ed.addButton(c[0], {
                    title: c[1],
                    cmd: c[2],
                    ui: c[3]
                });
            }), ed.onPreInit.add(function() {
                ed.onSetContent.add(function(ed, e) {
                    cleanup(!0), ed.dom.addClass(ed.dom.select("table"), "mce-item-table");
                }), ed.onPastePostProcess.add(function(ed, args) {
                    var dom = ed.dom;
                    dom.addClass(dom.select("table", args.node), "mce-item-table"), 
                    each(dom.select("td[valign]", args.node), function(elm) {
                        dom.setStyle(elm, "vertical-align", elm.getAttribute("valign")), 
                        elm.removeAttribute("valign");
                    });
                });
            }), ed.onPreProcess.add(function(ed, args) {
                var nodes, i, node, value, dom = ed.dom;
                if ("html4" === ed.settings.schema) for (i = (nodes = dom.select("table,td,th,tr", args.node)).length; i--; ) {
                    node = nodes[i], dom.setAttrib(node, "data-mce-style", ""), 
                    "auto" === dom.getStyle(node, "margin-left") && "auto" === dom.getStyle(node, "margin-right") && (dom.setAttrib(node, "align", "center"), 
                    dom.setStyles(node, {
                        "margin-left": "",
                        "margin-right": ""
                    }));
                    var flt = dom.getStyle(node, "float"), flt = ("left" !== flt && "right" !== flt || (dom.setAttrib(node, "align", flt), 
                    dom.setStyle(node, "float", "")), dom.getStyle(node, "text-align"));
                    flt && (dom.setAttrib(node, "align", flt), dom.setStyle(node, "text-align", ""));
                }
                for (i = (nodes = dom.select("table, td, th", args.node)).length; i--; ) node = nodes[i], 
                (value = dom.getAttrib(node, "width")) && (dom.setStyle(node, "width", value), 
                dom.setAttrib(node, "width", "")), (value = dom.getAttrib(node, "height")) && (dom.setStyle(node, "height", value), 
                dom.setAttrib(node, "height", ""));
            }), ed.onNodeChange.add(function(ed, cm, n) {
                var p;
                n = ed.selection.getStart(), p = ed.dom.getParent(n, "td,th,caption"), 
                cm.setActive("table", "TABLE" === n.nodeName || !!p), p && "CAPTION" === p.nodeName && (p = 0), 
                ed.getParam("table_buttons", 1) && (cm.setDisabled("delete_table", !p), 
                cm.setDisabled("delete_col", !p), cm.setDisabled("delete_table", !p), 
                cm.setDisabled("delete_row", !p), cm.setDisabled("col_after", !p), 
                cm.setDisabled("col_before", !p), cm.setDisabled("row_after", !p), 
                cm.setDisabled("row_before", !p), cm.setDisabled("row_props", !p), 
                cm.setDisabled("cell_props", !p), cm.setDisabled("split_cells", !p), 
                cm.setDisabled("merge_cells", !p), cm.setDisabled("table_props", !p));
            }), ed.onClick.add(function(ed, e) {
                var n = e.target;
                "TABLE" == (n = e.altKey && ed.dom.is(n, "td,th,caption") ? ed.dom.getParent(n, "table") : n).nodeName && (ed.selection.select(n), 
                ed.nodeChanged());
            }), ed.onInit.add(function(ed) {
                var tableGrid, getSingleChildNode, isTextNode, startCell, startTable, lastMouseOverTarget, dom = ed.dom;
                function isCellInTable(table, cell) {
                    return table && cell && table === dom.getParent(cell, "table");
                }
                function moveWebKitSelection() {
                    function eventHandler(e) {
                        var preBrowserNode, node, key = e.keyCode;
                        function handle(upBool, sourceNode) {
                            var siblingDirection = upBool ? "previousSibling" : "nextSibling", currentRow = ed.dom.getParent(sourceNode, "tr"), siblingRow = currentRow[siblingDirection];
                            if (siblingRow) return moveCursorToRow(ed, sourceNode, siblingRow, upBool), 
                            e.preventDefault(), !0;
                            var siblingRow = ed.dom.getParent(currentRow, "table"), middleNode = currentRow.parentNode, parentNodeName = middleNode.nodeName.toLowerCase();
                            if ("tbody" === parentNodeName || parentNodeName === (upBool ? "tfoot" : "thead")) {
                                parentNodeName = function(upBool, topNode, secondNode, nodeName) {
                                    var nodeName = ed.dom.select(">" + nodeName, topNode), position = nodeName.indexOf(secondNode);
                                    {
                                        if (upBool && 0 === position || !upBool && position === nodeName.length - 1) return function(upBool, parent) {
                                            upBool = upBool ? "thead" : "tfoot", 
                                            upBool = ed.dom.select(">" + upBool, parent);
                                            return 0 !== upBool.length ? upBool[0] : null;
                                        }(upBool, topNode);
                                        if (-1 === position) return topNode = "thead" === secondNode.tagName.toLowerCase() ? 0 : nodeName.length - 1, 
                                        nodeName[topNode];
                                    }
                                    return nodeName[position + (upBool ? -1 : 1)];
                                }(upBool, siblingRow, middleNode, "tbody");
                                if (null !== parentNodeName) return function(upBool, targetParent, sourceNode) {
                                    targetParent = getChildForDirection(targetParent, upBool);
                                    targetParent && moveCursorToRow(ed, sourceNode, targetParent, upBool);
                                    return e.preventDefault(), !0;
                                }(upBool, parentNodeName, sourceNode);
                            }
                            return function(upBool, currentRow, siblingDirection, table) {
                                siblingDirection = table[siblingDirection];
                                if (siblingDirection) return moveCursorToStartOfElement(siblingDirection), 
                                !0;
                                siblingDirection = ed.dom.getParent(table, "td,th");
                                if (siblingDirection) return handle(upBool, siblingDirection);
                                return moveCursorToStartOfElement(getChildForDirection(currentRow, !upBool)), 
                                e.preventDefault(), !1;
                            }(upBool, currentRow, siblingDirection, siblingRow);
                        }
                        function getChildForDirection(parent, up) {
                            parent = parent && parent[up ? "lastChild" : "firstChild"];
                            return parent && "BR" === parent.nodeName ? ed.dom.getParent(parent, "td,th") : parent;
                        }
                        function moveCursorToStartOfElement(n) {
                            ed.selection.setCursorLocation(n, 0);
                        }
                        function moveCursorToRow(ed, node, row, upBool) {
                            ed = function(rowElement, columnIndex) {
                                var c = 0, r = 0;
                                return each(rowElement.children, function(cell, i) {
                                    if (c += getSpanVal(cell, "colspan"), r = i, 
                                    columnIndex < c) return !1;
                                }), r;
                            }(row, function(column) {
                                for (var colIndex = 0, c = column; c.previousSibling; ) colIndex += getSpanVal(c = c.previousSibling, "colspan");
                                return colIndex;
                            }(ed.dom.getParent(node, "td,th"))), node = row.childNodes[ed];
                            moveCursorToStartOfElement(getChildForDirection(node, upBool) || node);
                        }
                        function shouldFixCaret(preBrowserNode) {
                            var newNode = ed.selection.getNode(), newNode = ed.dom.getParent(newNode, "td,th"), preBrowserNode = ed.dom.getParent(preBrowserNode, "td,th");
                            return newNode && newNode !== preBrowserNode && (preBrowserNode = preBrowserNode, 
                            ed.dom.getParent(newNode, "TABLE") === ed.dom.getParent(preBrowserNode, "TABLE"));
                        }
                        key != VK.UP && key != VK.DOWN || (node = ed.selection.getNode(), 
                        null === ed.dom.getParent(node, "tr")) || (preBrowserNode = ed.selection.getNode(), 
                        Delay.setEditorTimeout(ed, function() {
                            shouldFixCaret(preBrowserNode) && handle(!e.shiftKey && key === VK.UP, preBrowserNode);
                        }, 0));
                    }
                    ed.onKeyDown.add(function(e) {
                        eventHandler(e);
                    });
                }
                function fixBeforeTableCaretBug() {
                    ed.onKeyDown.add(function(e) {
                        var rng, table, dom = ed.dom;
                        (37 == e.keyCode || 38 == e.keyCode) && (rng = ed.selection.getRng(), 
                        table = dom.getParent(rng.startContainer, "table")) && ed.getBody().firstChild == table && function(rng, par) {
                            var doc = par.ownerDocument, rng2 = doc.createRange();
                            return rng2.setStartBefore(par), rng2.setEnd(rng.endContainer, rng.endOffset), 
                            (par = doc.createElement("body")).appendChild(rng2.cloneContents()), 
                            0 === par.innerHTML.replace(/<(br|img|object|embed|input|textarea)[^>]*>/gi, "-").replace(/<[^>]+>/g, "").length;
                        }(rng, table) && ((rng = dom.createRng()).setStartBefore(table), 
                        rng.setEndBefore(table), ed.selection.setRng(rng), e.preventDefault());
                    });
                }
                function fixTableCaretPos() {
                    ed.dom.bind("KeyDown SetContent VisualAid", function() {
                        for (var last = ed.getBody().lastChild; last; last = last.previousSibling) if (3 == last.nodeType) {
                            if (0 < last.nodeValue.length) break;
                        } else if (1 == last.nodeType && ("BR" == last.tagName || !last.getAttribute("data-mce-bogus"))) break;
                        last && "TABLE" == last.nodeName && (ed.settings.forced_root_block ? ed.dom.add(ed.getBody(), ed.settings.forced_root_block, ed.settings.forced_root_block_attrs, '<br data-mce-bogus="1" />') : ed.dom.add(ed.getBody(), "br", {
                            "data-mce-bogus": "1"
                        }));
                    }), ed.onPreProcess.add(function(ed, o) {
                        o = o.node.lastChild;
                        o && ("BR" == o.nodeName || 1 == o.childNodes.length && ("BR" == o.firstChild.nodeName || "\xa0" == o.firstChild.nodeValue)) && o.previousSibling && "TABLE" == o.previousSibling.nodeName && ed.dom.remove(o);
                    });
                }
                function fixTableCellSelection() {
                    function fixSelection() {
                        var rng = ed.selection.getRng(), n = ed.selection.getNode(), currentCell = ed.dom.getParent(rng.startContainer, "TD,TH");
                        if (function(ed, rng, n, currentCell) {
                            var tableParent;
                            return (ed = ed.dom.getParent(rng.startContainer, "TABLE")) && (tableParent = ed.parentNode), 
                            ed = 3 == rng.startContainer.nodeType && 0 === rng.startOffset && 0 === rng.endOffset && currentCell && ("TR" == n.nodeName || n == tableParent), 
                            rng = ("TD" == n.nodeName || "TH" == n.nodeName) && !currentCell, 
                            ed || rng;
                        }(ed, rng, n, currentCell)) {
                            for (var end = (currentCell = currentCell || n).lastChild; end.lastChild; ) end = end.lastChild;
                            3 == end.nodeType && (rng.setEnd(end, end.data.length), 
                            ed.selection.setRng(rng));
                        }
                    }
                    ed.onKeyDown.add(function() {
                        fixSelection();
                    }), ed.onMouseDown.add(function(e) {
                        2 != e.button && fixSelection();
                    });
                }
                function placeCaretInCell(cell) {
                    ed.selection.select(cell, !0), ed.selection.collapse(!0);
                }
                function clearCell(cell) {
                    ed.dom.empty(cell), function(cell) {
                        cell.hasChildNodes() || (cell.innerHTML = '<br data-mce-bogus="1" />');
                    }(cell);
                }
                function restoreCaretPlaceholder(node, insertCaret) {
                    var rng = ed.selection.getRng(), caretNode = node.ownerDocument.createTextNode("\xa0");
                    rng.startOffset ? node.insertBefore(caretNode, node.firstChild) : node.appendChild(caretNode), 
                    insertCaret && (ed.selection.select(caretNode, !0), ed.selection.collapse(!0));
                }
                function getSingleChr(node) {
                    return node = getSingleChildNode(node), isTextNode(node) && 1 === node.data.length ? node.data : null;
                }
                function isEmptyNode(node) {
                    return ed.dom.isEmpty(node) || "\xa0" === getSingleChr(node);
                }
                winMan = ed.windowManager, "html4" === ed.settings.schema && tinymce.each("left,center,right,full".split(","), function(name) {
                    var fmts = ed.formatter.get("align" + name);
                    tinymce.each(fmts, function(fmt) {
                        fmt.onformat = function(elm, fmt) {
                            /^(TABLE|TH|TD|TR)$/.test(elm.nodeName) && ("full" === name && (name = "justify"), 
                            ed.dom.setAttrib(elm, "align", name));
                        };
                    });
                }), ed.onKeyUp.add(function(ed, e) {
                    cleanup();
                }), ed.onKeyDown.add(function(e) {
                    var selectedTableCells, cell, table;
                    e.keyCode != VK.DELETE && e.keyCode != VK.BACKSPACE || e.isDefaultPrevented() || (table = ed.dom.getParent(ed.selection.getStart(), "table")) && (table = ed.dom.select("td,th", table), 
                    0 === (selectedTableCells = tinymce.grep(table, function(cell) {
                        return !!ed.dom.getAttrib(cell, "data-mce-selected");
                    })).length ? (cell = ed.dom.getParent(ed.selection.getStart(), "td,th"), 
                    ed.selection.isCollapsed() && cell && ed.dom.isEmpty(cell) && (e.preventDefault(), 
                    clearCell(cell), placeCaretInCell(cell))) : (e.preventDefault(), 
                    ed.undoManager.add(), table.length == selectedTableCells.length ? ed.execCommand("mceTableDelete") : (tinymce.each(selectedTableCells, clearCell), 
                    placeCaretInCell(selectedTableCells[0]))));
                }), getSingleChildNode = function(node) {
                    return node.firstChild === node.lastChild && node.firstChild;
                }, isTextNode = function(node) {
                    return node && 3 === node.nodeType;
                }, ed.onKeyDown.add(function(e) {
                    var container, node;
                    (function(e) {
                        return (e.keyCode == VK.DELETE || e.keyCode == VK.BACKSPACE) && !e.isDefaultPrevented();
                    })(e) && (container = ed.dom.getParent(ed.selection.getStart(), "caption"), 
                    node = container) && "CAPTION" == node.nodeName && "TABLE" == node.parentNode.nodeName && (tinymce.isIE && (ed.selection.isCollapsed() ? function(node) {
                        var childNode = getSingleChildNode(node), node = getSingleChr(node);
                        return childNode && !isTextNode(childNode) || node && !("\xa0" === node);
                    }(container) && restoreCaretPlaceholder(container) : (ed.undoManager.add(), 
                    ed.execCommand("Delete"), isEmptyNode(container) && restoreCaretPlaceholder(container, !0), 
                    e.preventDefault())), isEmptyNode(container)) && e.preventDefault();
                }), ed.onMouseDown.add(function(ed, e) {
                    2 != e.button && (cleanup(), startCell = dom.getParent(e.target, "td,th"), 
                    startTable = dom.getParent(startCell, "table"));
                }), dom.bind(ed.getDoc(), "mouseover", function(e) {
                    var currentCell, target = e.target;
                    if (target !== lastMouseOverTarget && (lastMouseOverTarget = target, 
                    startTable) && startCell && (currentCell = dom.getParent(target, "td,th"), 
                    isCellInTable(startTable, currentCell) || (currentCell = dom.getParent(startTable, "td,th")), 
                    startCell !== currentCell || hasCellSelection) && isCellInTable(startTable, currentCell)) {
                        e.preventDefault(), tableGrid || ((tableGrid = createTableGrid(startTable)).setStartCell(startCell), 
                        ed.getBody().style.webkitUserSelect = "none"), tableGrid.setEndCell(currentCell), 
                        hasCellSelection = !0, target = ed.selection.getSel();
                        try {
                            target.removeAllRanges ? target.removeAllRanges() : target.empty();
                        } catch (ex) {}
                    }
                }), ed.onMouseUp.add(function() {
                    var selectedCells, walker, lastNode, sel = ed.selection;
                    function setPoint(node, start) {
                        var walker = new TreeWalker(node, node);
                        do {
                            if (3 == node.nodeType) return void (start ? rng.setStart(node, 0) : rng.setEnd(node, node.nodeValue.length));
                            if ("BR" == node.nodeName) return void (start ? rng.setStartBefore(node) : rng.setEndBefore(node));
                        } while (node = start ? walker.next() : walker.prev());
                    }
                    if (startCell) {
                        if (tableGrid && (ed.getBody().style.webkitUserSelect = ""), 
                        0 < (selectedCells = dom.select("td.mceSelected,th.mceSelected")).length) {
                            var parent = dom.getParent(selectedCells[0], "table"), rng = dom.createRng(), node = selectedCells[0];
                            rng.setStartBefore(node), rng.setEndAfter(node), setPoint(node, 1), 
                            walker = new TreeWalker(node, parent);
                            do {
                                if ("TD" == node.nodeName || "TH" == node.nodeName) {
                                    if (!dom.hasClass(node, "mceSelected")) break;
                                    lastNode = node;
                                }
                            } while (node = walker.next());
                            setPoint(lastNode), sel.setRng(rng);
                        }
                        ed.nodeChanged(), startCell = tableGrid = startTable = lastMouseOverTarget = null;
                    }
                }), tinymce.isWebKit && (moveWebKitSelection(), fixTableCellSelection()), 
                tinymce.isGecko && (fixBeforeTableCaretBug(), fixTableCaretPos()), 
                (9 < tinymce.isIE || tinymce.isIE12) && (fixBeforeTableCaretBug(), 
                fixTableCaretPos()), ed && ed.plugins.contextmenu && ed.plugins.contextmenu.onContextMenu.add(function(th, m, e) {
                    ed.dom.getParent(e, "td") || ed.dom.getParent(e, "th") || ed.dom.select("td.mceSelected,th.mceSelected").length ? (m.add({
                        title: "table.desc",
                        icon: "table",
                        cmd: "mceInsertTable",
                        value: {
                            action: "insert"
                        }
                    }), m.add({
                        title: "table.props_desc",
                        icon: "table_props",
                        cmd: "mceInsertTable"
                    }), m.add({
                        title: "table.del",
                        icon: "delete_table",
                        cmd: "mceTableDelete"
                    }), m.addSeparator(), (e = m.addMenu({
                        title: "table.cell"
                    })).add({
                        title: "table.cell_desc",
                        icon: "cell_props",
                        cmd: "mceTableCellProps"
                    }), e.add({
                        title: "table.split_cells_desc",
                        icon: "split_cells",
                        cmd: "mceTableSplitCells"
                    }), e.add({
                        title: "table.merge_cells_desc",
                        icon: "merge_cells",
                        cmd: "mceTableMergeCells"
                    }), (e = m.addMenu({
                        title: "table.row"
                    })).add({
                        title: "table.row_desc",
                        icon: "row_props",
                        cmd: "mceTableRowProps"
                    }), e.add({
                        title: "table.row_before_desc",
                        icon: "row_before",
                        cmd: "mceTableInsertRowBefore"
                    }), e.add({
                        title: "table.row_after_desc",
                        icon: "row_after",
                        cmd: "mceTableInsertRowAfter"
                    }), e.add({
                        title: "table.delete_row_desc",
                        icon: "delete_row",
                        cmd: "mceTableDeleteRow"
                    }), e.addSeparator(), e.add({
                        title: "table.cut_row_desc",
                        icon: "cut",
                        cmd: "mceTableCutRow"
                    }), e.add({
                        title: "table.copy_row_desc",
                        icon: "copy",
                        cmd: "mceTableCopyRow"
                    }), e.add({
                        title: "table.paste_row_before_desc",
                        icon: "paste",
                        cmd: "mceTablePasteRowBefore"
                    }).setDisabled(!clipboardRows), e.add({
                        title: "table.paste_row_after_desc",
                        icon: "paste",
                        cmd: "mceTablePasteRowAfter"
                    }).setDisabled(!clipboardRows), (e = m.addMenu({
                        title: "table.col"
                    })).add({
                        title: "table.col_before_desc",
                        icon: "col_before",
                        cmd: "mceTableInsertColBefore"
                    }), e.add({
                        title: "table.col_after_desc",
                        icon: "col_after",
                        cmd: "mceTableInsertColAfter"
                    }), e.add({
                        title: "table.delete_col_desc",
                        icon: "delete_col",
                        cmd: "mceTableDeleteCol"
                    })) : m.add({
                        title: "table.desc",
                        icon: "table",
                        cmd: "mceInsertTable"
                    });
                });
            });
            url = ed.getParam("site_url") + "index.php?option=com_jce&task=plugin.display&plugin=table";
            each({
                mceTableSplitCells: function(grid) {
                    grid.split();
                },
                mceTableMergeCells: function(grid) {
                    var rowSpan, colSpan, cell = ed.dom.getParent(ed.selection.getNode(), "th,td");
                    cell && (rowSpan = cell.rowSpan, colSpan = cell.colSpan), ed.dom.select("td.mceSelected,th.mceSelected").length ? grid.merge() : winMan.open({
                        url: url + "&slot=merge",
                        width: 240 + parseInt(ed.getLang("table.merge_cells_delta_width", 0), 10),
                        height: 170 + parseInt(ed.getLang("table.merge_cells_delta_height", 0), 10),
                        inline: 1,
                        size: "mce-modal-landscape-small"
                    }, {
                        rows: rowSpan,
                        cols: colSpan,
                        onaction: function(data) {
                            grid.merge(cell, data.cols, data.rows);
                        },
                        plugin_url: url,
                        layout: "merge",
                        size: "mce-modal-landscape-small"
                    });
                },
                mceTableInsertRowBefore: function(grid) {
                    grid.insertRow(!0);
                },
                mceTableInsertRowAfter: function(grid) {
                    grid.insertRow();
                },
                mceTableInsertColBefore: function(grid) {
                    grid.insertCol(!0);
                },
                mceTableInsertColAfter: function(grid) {
                    grid.insertCol();
                },
                mceTableDeleteCol: function(grid) {
                    grid.deleteCols();
                },
                mceTableDeleteRow: function(grid) {
                    grid.deleteRows();
                },
                mceTableCutRow: function(grid) {
                    clipboardRows = grid.cutRows();
                },
                mceTableCopyRow: function(grid) {
                    clipboardRows = grid.copyRows();
                },
                mceTablePasteRowBefore: function(grid) {
                    grid.pasteRows(clipboardRows, !0);
                },
                mceTablePasteRowAfter: function(grid) {
                    grid.pasteRows(clipboardRows);
                },
                mceTableDelete: function(grid) {
                    grid.deleteTable();
                }
            }, function(func, name) {
                ed.addCommand(name, function() {
                    var grid = createTableGrid();
                    grid && (func(grid), ed.execCommand("mceRepaint"), cleanup());
                });
            }), each({
                mceInsertTable: function(val) {
                    winMan.open({
                        url: url,
                        size: "mce-modal-landscape-xlarge"
                    }, {
                        plugin_url: url,
                        action: val ? val.action : 0,
                        layout: "table"
                    });
                },
                mceTableRowProps: function() {
                    winMan.open({
                        url: url + "&slot=row",
                        size: "mce-modal-landscape-xlarge"
                    }, {
                        plugin_url: url,
                        layout: "row"
                    });
                },
                mceTableCellProps: function() {
                    winMan.open({
                        url: url + "&slot=cell",
                        size: "mce-modal-landscape-xlarge"
                    }, {
                        plugin_url: url,
                        layout: "cell"
                    });
                }
            }, function(func, name) {
                ed.addCommand(name, function(ui, val) {
                    func(val);
                });
            }), !1 !== ed.settings.table_tab_navigation && ed.onKeyDown.add(function(ed, e) {
                var cellElm, grid;
                9 == e.keyCode && (cellElm = ed.dom.getParent(ed.selection.getStart(), "th,td")) && (e.preventDefault(), 
                grid = createTableGrid(), e = e.shiftKey ? -1 : 1, ed.undoManager.add(), 
                !grid.moveRelIdx(cellElm, e)) && 0 < e && (grid.insertRow(), grid.refresh(), 
                grid.moveRelIdx(cellElm, e));
            });
        },
        createControl: function(n, cm) {
            var ed = this.editor;
            function createMenuGrid(cols, rows) {
                for (var html = '<table role="presentation" class="mceTableSplitMenu"><tbody>', i = 0; i < rows; i++) {
                    html += "<tr>";
                    for (var x = 0; x < cols; x++) html += '<td><a href="#"></a></td>';
                    html += "</tr>";
                }
                return html = (html += "</tbody>") + ('<tfoot><tr><td colspan="' + rows + '" class="mceTableGridCount">&nbsp;</td></tr></tfoot>') + "</table>";
            }
            function menuGridMouseOver(e) {
                var e = e.target, tbody = ("TD" !== e.nodeName && (e = e.parentNode), 
                DOM.getParent(e, "tbody"));
                if (tbody) {
                    var i, rows = tbody.childNodes, tbody = e.parentNode, x = tinymce.inArray(tbody.childNodes, e), y = tinymce.inArray(rows, tbody);
                    if (!(x < 0 || y < 0)) {
                        for (i = 0; i < rows.length; i++) for (var cells = rows[i].childNodes, z = 0; z < cells.length; z++) x < z || y < i ? DOM.removeClass(cells[z], "selected") : DOM.addClass(cells[z], "selected");
                        DOM.setHTML(DOM.select("td.mceTableGridCount", n), y + 1 + " x " + (x + 1));
                    }
                }
            }
            function menuGridClick(e) {
                for (var el = e.target, el = ("TD" !== el.nodeName && (el = el.parentNode), 
                DOM.getParent(el, "table")), styles = [], width = ed.getParam("table_default_width"), width = (/^[0-9\.]+$/.test(width) && (width += "px"), 
                width && styles.push("width:" + width), ed.getParam("table_default_height")), width = (/^[0-9\.]+$/.test(width) && (width += "px"), 
                width && styles.push("height:" + width), ed.getParam("table_default_border", "")), html = "<table", width = ("" != (width = "html5" == ed.settings.schema && ed.settings.validate ? width && 1 : width) && (html += ' border="' + width + '"'), 
                ed.getParam("table_default_align", "")), classes = ed.getParam("table_classes", ""), rows = ("" != width && "html4" === ed.settings.schema && (html += ' align="' + width + '"'), 
                "" != width && "html4" !== ed.settings.schema && ("center" === width ? (styles.push("margin-left: auto"), 
                styles.push("margin-right: auto")) : styles.push("float: " + width)), 
                classes && (html += ' class="' + classes + '"'), styles.length && (html += ' style="' + styles.join(";") + ';"'), 
                html += ">", tinymce.grep(DOM.select("tr", el), function(row) {
                    return DOM.select("td.selected", row).length;
                })), y = 0; y < rows.length; y++) {
                    html += "<tr>";
                    for (var cols = DOM.select("td.selected", rows[y]).length, x = 0; x < cols; x++) html += "<td>" + (ed.settings.validate ? '<br data-mce-bogus="1"/>' : "&nbsp;") + "</td>";
                    html += "</tr>";
                }
                return ed.execCommand("mceInsertContent", !1, html += "</table>"), 
                Event.cancel(e);
            }
            return "table_insert" === n ? ((cm = cm.createSplitButton("table_insert", {
                title: "table.desc",
                cmd: "mceInsertTable",
                class: "mce_table"
            })).onRenderMenu.add(function(c, m) {
                var tm, sm, sb = (ed.getParam("table_buttons", 1) ? m : tm = m.addMenu({
                    title: "table.desc",
                    icon: "table",
                    cmd: "mceInsertTable"
                })).add({
                    onmouseover: menuGridMouseOver,
                    onclick: menuGridClick,
                    html: createMenuGrid(8, 8)
                });
                m.onShowMenu.add(function() {
                    var n = DOM.get(sb.id);
                    n && (DOM.removeClass(DOM.select(".mceTableSplitMenu td", n), "selected"), 
                    DOM.setHTML(DOM.select(".mceTableSplitMenu .mceTableGridCount", n), "&nbsp;"));
                    var n = ed.selection.getNode(), p = DOM.getParent(n, "table");
                    tinymce.walk(m, function(o) {
                        if (o === sb || o === tm) return !1;
                        o.settings.cmd && o.setDisabled(!p);
                    }, "items", m);
                }), ed.getParam("table_buttons", 1) || (m.add({
                    title: "table.del",
                    icon: "delete_table",
                    cmd: "mceTableDelete"
                }), m.addSeparator(), (sm = m.addMenu({
                    title: "table.cell"
                })).add({
                    title: "table.cell_desc",
                    icon: "cell_props",
                    cmd: "mceTableCellProps"
                }), sm.add({
                    title: "table.split_cells_desc",
                    icon: "split_cells",
                    cmd: "mceTableSplitCells"
                }), sm.add({
                    title: "table.merge_cells_desc",
                    icon: "merge_cells",
                    cmd: "mceTableMergeCells"
                }), (sm = m.addMenu({
                    title: "table.row"
                })).add({
                    title: "table.row_desc",
                    icon: "row_props",
                    cmd: "mceTableRowProps"
                }), sm.add({
                    title: "table.row_before_desc",
                    icon: "row_before",
                    cmd: "mceTableInsertRowBefore"
                }), sm.add({
                    title: "table.row_after_desc",
                    icon: "row_after",
                    cmd: "mceTableInsertRowAfter"
                }), sm.add({
                    title: "table.delete_row_desc",
                    icon: "delete_row",
                    cmd: "mceTableDeleteRow"
                }), sm.addSeparator(), sm.add({
                    title: "table.cut_row_desc",
                    icon: "cut",
                    cmd: "mceTableCutRow"
                }), sm.add({
                    title: "table.copy_row_desc",
                    icon: "copy",
                    cmd: "mceTableCopyRow"
                }), sm.add({
                    title: "table.paste_row_before_desc",
                    icon: "paste",
                    cmd: "mceTablePasteRowBefore"
                }), sm.add({
                    title: "table.paste_row_after_desc",
                    icon: "paste",
                    cmd: "mceTablePasteRowAfter"
                }), (sm = m.addMenu({
                    title: "table.col"
                })).add({
                    title: "table.col_before_desc",
                    icon: "col_before",
                    cmd: "mceTableInsertColBefore"
                }), sm.add({
                    title: "table.col_after_desc",
                    icon: "col_after",
                    cmd: "mceTableInsertColAfter"
                }), sm.add({
                    title: "table.delete_col_desc",
                    icon: "delete_col",
                    cmd: "mceTableDeleteCol"
                }));
            }), cm) : null;
        }
    }), tinymce.PluginManager.add("table", tinymce.plugins.TablePlugin);
}(tinymce);