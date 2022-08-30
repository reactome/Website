<<<<<<< HEAD
/* jce - 2.9.24 | 2022-05-27 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2022 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(){tinymce.PluginManager.add("print",function(ed){ed.addCommand("mcePrint",function(){ed.getWin().print()}),ed.addButton("print",{title:"print.desc",cmd:"mcePrint"})})}();
=======
/* jce - 2.9.10 | 2021-07-08 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2021 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
!function(){tinymce.create("tinymce.plugins.Print",{init:function(a,b){a.addCommand("mcePrint",function(){a.getWin().print()}),a.addButton("print",{title:"print.desc",cmd:"mcePrint"})},getInfo:function(){return{longname:"Print",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/print",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("print",tinymce.plugins.Print)}();
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
