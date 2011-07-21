/*
* TinyMCEExtensions.js contains Javascript functions used for extending the
* functionality of the TinyMCE text editor.
*
* To use these scripts, include TinyMCEExtensions.js somewhere within your
* Web page.
*
* To enable the various extenstions, follow the instructions included along
* with the functions below.
*/
/*****************************************************************************/
/*
* Modifications
* -------------
*
* 2009 Apr 30  E. Wilde       Initial coding.
*/
/*****************************************************************************/
function TinyMCEReadOnlySetup(EdInst, HideBars)
/*
* EdInst                                The instance of the editor that is to
*                                       be extended with the capability to
*                                       toggle readonly mode.
*
* HideBars                              A boolean that, if true, indicates that
*                                       the tool bars and/or status bar should
*                                       also be hidden when readonly mode is
*                                       set.  The default, if omitted is false.
*
* This function will add a method named switchReadOnly to the tinymce.Editor
* class for the instance of the editor passed in EdInst.  Calling
* switchReadOnly will cause readonly mode to be switched on/off.  If HideBars
* is true, when this function is called, the call to switchReadOnly will also
* cause the tool bars/status bar to be hidden/unhidden when readonly mode is
* switched on/off.
*
* Typically, this function would be used at startup time to extend TinyMCE so
* that readonly mode could be switched for all editor instances.  For example:
*
*      tinyMCE.init(
*        {
*             .
*             .
*             .
*        setup : function(ed) { TinyMCEReadOnlySetup(ed, true); },
*             .
*             .
*             .
*        });
*
* Note that the initial, readonly state of the editors being set up in this
* manner is irrelevant.  The editor must be initialized as editable for
* toggling to work but this routine takes care of that detail so the readonly
* flag may still be used in tinyMCE.init.
*
* If you wish to set up an individual editor, after the fact, the readonly
* flag must not be set to true during tinyMCE.init.  If it is omitted or set to
* false, you may call this routine as follows:
*
*      TinyMCEReadOnlySetup(tinyMCE.get('TextArea1'), true);
*
* Once an instance of the editor has been initialized with this extension, a
* new method named switchReadOnly is added to the editor instance.  You may
* call it something like this:
*
*      EdInst = tinyMCE.get('TextArea1');
*      EdInst.switchReadOnly(true);
*
* If you already have the editor instance variable, there's no need to look it
* up.  And, the single parameter passed to switchReadOnly is a boolean which
* indicates, if true, that the editor instance should be made readonly.  If it
* is false, the editor instance is made editable.  The toolbars and/or status
* bar will be hidden/unhidden depending on the value that was passed to
* TinyMCEReadOnlySetup on the setup call.
*
* If you'd like to start with all instances of TinyMCE set to readonly and
* enable them depending on which one the user clicks on, you can do something
* like this:
*
*      tinyMCE.init(
*        {
*             .
*             .
*             .
*        handle_event_callback : "ReadonlyFocus",
*             .
*             .
*             .
*        });
*           .
*           .
*           .
*      function ReadonlyFocus(ev, ed)
*      {
*      if (ed.settings.readonly) { ed.switchReadOnly(false); }
*      return (true);
*      }
*
* And, if you'd like to then switch off readonly as the user navigates through
* the various editor instances on a page, try this:
*
*      tinyMCE.init(
*        {
*             .
*             .
*             .
*        ed.onDeactivate.add(function(ed)
*          {
*          if (!ed.settings.readonly) { ed.switchReadOnly(true); }
*          }
*             .
*             .
*             .
*        });
*/
{
// The user may pass the optional HideBars parameter to us to indicate that
// we also should hide the toolbars and/or the status bar, when the control
// is made readonly.
if (typeof(HideBars) != undefined)
  {
  if (HideBars) { EdInst.settings.ROExtHideBars = true; }
  else { EdInst.settings.ROExtHideBars = false; }
  }
else { EdInst.settings.ROExtHideBars = false; }
// By assigning an unnamed function to the switchReadOnly variable, we set
// up the method of the same name.
EdInst.switchReadOnly = function(IsReadOnly)
  {
  var EdTable;
  // Cache the editor settings.
  var EdSettings = this.settings;
  // We need a pointer to the table that the editor is built in.
  if (document.all && !document.getElementById)
    { EdTable = document.all[this.id+'_tbl']; }
  else { EdTable = document.getElementById(this.id+'_tbl'); }
  // If the current editor setting is editable and the user wishes the mode
  // to be read only, set it that way.
  if (!EdSettings.readonly && IsReadOnly)
    {
    var TBContainer = null, TBContainerHeight = 0, SBContainerHeight = 0;
    var ToolBar, TBNum;
    // Make the content read only.
    //
    // This code will fail on Gecko if the editor is placed in a hidden
    // container element.  If that happens, design mode will be set once the
    // editor is given focus.
    if (!tinymce.isIE)
      {
      var EdDoc = this.getDoc();        // Look this up outside the try
      try { EdDoc.designMode = 'Off'; } catch (Except) { }
      }
    // Otherwise, do it differently for IE.
    else
      {
      // The editor won't steal focus if we hide it while setting
      // contentEditable.
      var DOM = tinymce.DOM, EdBody = this.getBody();
      DOM.hide(EdBody);
      EdBody.contentEditable = false;
      DOM.show(EdBody);
      }
    // Make a note to ourselves that the editor is now readonly.
    EdSettings.readonly = true;
    // If the user wants us to hide toolbars and/or the status bar, let's
    // do it.
    if (EdSettings.ROExtHideBars)
      {
      // Begin by making any toolbars disappear.
      for (TBNum = 1; TBNum <= 4; TBNum++)
        {
        if (document.all && !document.getElementById)
          { ToolBar = document.all[this.id+'_toolbar'+TBNum]; }
        else { ToolBar = document.getElementById(this.id+'_toolbar'+TBNum); }
        // If this toolbar exists, take care of it.
        if (ToolBar)
          {
          // If this is the top toolbar, we need to save the height of the
          // table row that contains it so that we can reduce the table by
          // that much, later on.  We need to do this first, since
          // disappearing the toolbars reduces the height.
          if (!TBContainer)
            {
            if (ToolBar.offsetParent) { TBContainer = ToolBar.offsetParent; }
            else if (ToolBar.parentNode) { TBContainer = ToolBar.parentNode; }
            else { TBContainer = ToolBar; }
            if (typeof(TBContainer.clientHeight) == 'number')
              { TBContainerHeight = TBContainer.clientHeight; }
            }
          // Now, we can make it disappear.
          ToolBar.style.display = 'none';
          }
        }
      // If there is a status bar, we need to make it disappear too.
      if (document.all && !document.getElementById)
        { ToolBar = document.all[this.id+'_path_row']; }
      else { ToolBar = document.getElementById(this.id+'_path_row'); }
      if (ToolBar)
        {
        // To find the table data for the status bar, we need to move up from
        // the <div>.
        ToolBar = ToolBar.parentNode;
        // We need to save the height of the table row that contains the
        // status bar so that we can reduce the table by that much, later on.
        // Note that we said table row but really we get the height of the
        // table data because IE seems to have a funny idea of what the table
        // row's height should be.  Also, we need to do this first, since
        // disappearing the status bar reduces the height.
        if (typeof(ToolBar.clientHeight) == 'number')
          { SBContainerHeight = ToolBar.clientHeight; }
        // Now, we can make the table row disappear.  We make the row
        // disappear because making the table data disappear causes strange
        // artifacts on redisplay under Mozilla (nice one, Smiley).
        ToolBar.parentNode.style.display = 'none';
        }
      // Get the height of the editor table now.  We'll reduce it by the
      // height of the toolbar and status bar.  But, we also need to save it
      // so that we can restore it when we switch it to editable, later on.
      TBNum = parseInt(EdTable.style.height);
      EdSettings.ROExtHeightWithBars = TBNum;
      // The editor table was given a fixed height.  To get rid of any
      // artifacts caused by this, we need to reduce the height of the table
      // to account for the height of the stuff that we just disappeared.
      //
      // But, first, we'll reduce the height of the table row that encloses
      // the toolbar to three pixels.  This gives us the hint of a toolbar so
      // that the user knows there's something there (i.e. its not just
      // another text box).  I suppose, if you didn't like this, you could
      // just disappear the whole table row (above, instead of the table
      // data).
      if (TBContainer) { TBContainer.style.height = '3px'; }
      EdTable.style.height
        = (TBNum-TBContainerHeight-SBContainerHeight+3)+'px';
      }
    }
  // Otherwise, if the current editor setting is read only and the user
  // wishes the mode to be editable, set it that way.
  else if (EdSettings.readonly && !IsReadOnly)
    {
    var TBStyleCleared = false;
    var ToolBar, TBNum;
    // Make the content editable.
    //
    // This code will fail on Gecko if the editor is placed in a hidden
    // container element.  If that happens, design mode will be set once the
    // editor is given focus.
    if (!tinymce.isIE)
      {
      var EdDoc = this.getDoc();        // Look this up outside the try
      try { EdDoc.designMode = 'On'; } catch (Except) { }
      }
    // Otherwise, do it differently for IE.
    else
      {
      // The editor won't steal focus if we hide it while setting
      // contentEditable.
      var DOM = tinymce.DOM, EdBody = this.getBody();
      DOM.hide(EdBody);
      EdBody.contentEditable = true;
      DOM.show(EdBody);
      }
    // Make a note to ourselves that the editor is now editable.
    EdSettings.readonly = false;
    // If the user had us hide toolbars and/or the status bar, now's the time
    // to undo it.
    if (EdSettings.ROExtHideBars)
      {
      // Begin by making any toolbars reappear.
      for (TBNum = 1; TBNum <= 4; TBNum++)
        {
        if (document.all && !document.getElementById)
          { ToolBar = document.all[this.id+'_toolbar'+TBNum]; }
        else { ToolBar = document.getElementById(this.id+'_toolbar'+TBNum); }
        // If this toolbar exists, take care of it.
        if (ToolBar)
          {
          // If we haven't yet cleared the height that we set on the table
          // row that contains the toolbar, we should do so now.  We set its
          // height to use it for a placeholder but now we need it to
          // automatically adjust for however many toolbar rows we make
          // appear.
          if (!TBStyleCleared)
            {
            if (ToolBar.offsetParent)
              { ToolBar.offsetParent.style.height = ''; }
            else if (ToolBar.parentNode)
              { ToolBar.parentNode.style.height = ''; }
            TBStyleCleared = true;
            }
          // Now, we can make the toolbar reappear by setting the display
          // style to '', which puts it back to whatever it was before.
          ToolBar.style.display = '';
          }
        }
      // If there is a status bar, we need to make it reappear too.
      if (document.all && !document.getElementById)
        { ToolBar = document.all[this.id+'_path_row']; }
      else { ToolBar = document.getElementById(this.id+'_path_row'); }
      if (ToolBar)
        {
        // To find the table row for the status bar, we need to move up from
        // the <div>.  Then, we can make it reappear by setting the display
        // style to '', which puts it back to whatever it was before. 
        ToolBar.parentNode.parentNode.style.display = '';
        }
      // The editor table was given a fixed height.  To get rid of any
      // artifacts caused by this, we reduced the height of the table to
      // account for the height of the toolbars and/or status bar that we
      // disappeared, when we switched to readonly mode.  Now, we need to
      // put the height back the way it was.
      if (typeof(EdSettings.ROExtHeightWithBars) == 'number')
        { EdTable.style.height = EdSettings.ROExtHeightWithBars+'px'; }
      }
    }
  // Let the caller know how the editor is set.
  return (EdSettings.readonly);
  };
// If we don't initialize the editor with read only mode turned off, there
// will be no toolbars drawn at the top of the box and no status bar.  So,
// upon startup, if the editor is set to read only, it is switched to
// editable (temporarily).  This draws the toolbars and/or status bar.  Then,
// an onInit routine is shoved into the startup work queue that flips the
// mode back to read only.
if (EdInst.settings.readonly)
  {
  EdInst.settings.readonly = false;
  EdInst.onInit.add(function() { this.switchReadOnly(true); });
  }
}
