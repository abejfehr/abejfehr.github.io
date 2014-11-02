---
layout: post
title: Clearing optional date prompts in Cognos Report Studio
date:   2014-10-31 12:00:00
categories: posts
description:
---

In some cases it may be necessary to have a date prompt in your report which is optional. It can also be frustrating that the optional date prompts on these pages automatically get populated with today's date as a default value.

![Cognos optional date prompt default value][cognos-optional-date-prompt]

The [Clear Prompt Selections](https://www-01.ibm.com/support/knowledgecenter/SSEP7J_10.2.1/com.ibm.swg.ba.cognos.ug_cr_rptstd.10.2.1.doc/c_rs_smples_prompt_api.html?lang=en) Prompt API sample doesn't accomplish this. I'd like to provide a JavaScript way, with some use of the magical prompt API and some [extra help](http://dustindiaz.com/smallest-domready-ever), to clear the value for a date prompt.

# The code

{% highlight javascript %}
// Executed when the DOM is ready
function r(f){/in/.test(document.readyState)?setTimeout('r('+f+')',9):f()}
r(function() {
  // Create the report object
  var oCR= cognos.Report.getReport("_THIS_");

  // Create an array of prompts controls
  var aPromptControls = oCR.prompt.getControls( );

  // Loop through the prompt controls on this page
  for(var  i=0; i < aPromptControls.length; i++) {
    // Create a prompt control object
    var p = aPromptControls[i];

    // Check if it's optional and clear if it is
    if(!p.isRequired()) {
      document.getElementById('txtDate'+p._id_).value='';
    }
  }
});
{% endhighlight %}

The above script only works when the date prompts are Edit Boxes, not calendars. To use the script, simply place an HTML object into the Cognos prompt page and paste in the code above between a set of script tags(`<script>` and `</script>`)

![Cleared date prompts in Cognos][cognos-date-prompt-cleared]

[cognos-optional-date-prompt]: ../../../../images/2014-10-31/cognos-optional-date-prompt.png "Sudoku Candidate Puzzle"
[cognos-date-prompt-cleared]: ../../../../images/2014-10-31/cognos-date-prompt-cleared.png "Box, colum, and row neighbours of a cell in a Sudoku Puzzle"