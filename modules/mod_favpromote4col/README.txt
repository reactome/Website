# Current Version 2.1

-> HOW TO UPDATE MOD_FAVPROMOTE TO TAKE INTO ACCOUNT THE 4 COLUMNS MODULE.

 ##### Perform all changes in folder, zip it and install as a normal extension ##### 

-> TASKS

* rename the folder - mod_favpromote4col

* mod_favpromote4col.xml [rename mod_favpromote.xml]

- replace favpromote to favpromote4col
	- <name>FavPromote4col</name>
	- <help key="FavPromote4col" />


- add widget_text field
          after "description_text1"
          <field
                  name="widget_text1"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 1 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

	  after "description_text2"
          <field
                  name="widget_text2"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 2 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

	  after "description_text3"
          <field
                  name="widget_text3"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 3 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

	  after "description_text4"
          <field
                  name="widget_text4"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 4 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

	  after "description_text5"
          <field
                  name="widget_text5"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 5 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

	  after "description_text6"
          <field
                  name="widget_text6"
                  type="textarea"
                  filter="raw"
                  rows="10"
                  cols="40"
                  label="Widget 6 Text"
                  description="Insert the text for the description of the module column. A blank field reverts the setting to the default value." />

- disable updateserver

* mod_favpromote4col.php [rename mod_favpromote.php]

- replace favpromote to favpromote4col
- add "${'widget_text'.$j} = $params->get('widget_text'.$j);" as the last statement before closing the for loop
- locate favpromote4col-text, it is a <p>
	- in the style add height:150px; overflow: auto;
- add                     
<p id="favpromote4col-widget<?php echo $i; ?>"
   style=" margin-top: 15px;
           color: #<?php echo ${'description_text_color'.$i}; ?>;
           font-size: <?php echo $description_text_font_size; ?>;
           line-height: <?php echo $description_text_line_height; ?>;
           text-align: <?php echo $description_text_align; ?>;">
    <?php echo ${'widget_text'.$i}; ?>
</p>
after <p id="favpromote4col-text">

* theme/css/favpromote4col.css [rename favpromote.css]

replace favpromote to favpromote4col

* img/favpromote4col.jpg [rename favpromote.jpg]

#### ZIP THE FOLDER AND INSTALL AS NORMAL EXTENSION ####
