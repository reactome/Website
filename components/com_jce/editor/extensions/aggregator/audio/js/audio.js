<<<<<<< HEAD
/* jce - 2.9.24 | 2022-05-27 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2022 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
=======
/* jce - 2.9.10 | 2021-07-08 | https://www.joomlacontenteditor.net | Copyright (C) 2006 - 2021 Ryan Demmer. All rights reserved | GNU/GPL Version 2 or later - http://www.gnu.org/licenses/gpl-2.0.html */
>>>>>>> e1b2f01623577002e6d005616cb059ca4e2f8090
WFAggregator.add("audio",{params:{},props:{autoplay:0,loop:0,controls:1,mute:0},setup:function(){$.each(this.params,function(k,v){$("#audio_"+k).val(v).filter(":checkbox, :radio").prop("checked",!!v)})},getTitle:function(){return this.title||this.name},getType:function(){return"audio"},isSupported:function(v){return!1}});