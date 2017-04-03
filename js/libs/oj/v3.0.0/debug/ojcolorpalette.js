/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojarraytabledatasource', 'ojs/ojcolor', 'ojs/ojlistview', 'ojs/ojeditablevalue'],
       function(oj, ko, $)
{

/**
 *  Copyright (c) 2015, Oracle and/or its affiliates.
 *  All rights reserved.
 */

/*---------------------------------------------------------
   ojColorPalette    Jet Color Palette component
   Depends:   jquery.ui.core.js
              jquery.ui.widget.js
----------------------------------------------------------*/

(function () 
{

  function debugObj(o)  {
    var s ;
    try { s = JSON.stringify(o) ; }
    catch (e) { s = "ERROR";}
    return s ;
  };

  //  ojColorPalette class names
  var   /** @const */   OJCP_CONTAINER         = "oj-colorpalette-container",
        /** @const */   OJCP_GRID              = "oj-colorpalette-grid",
        /** @const */   OJCP_LIST              = "oj-colorpalette-list",
        /** @const */   OJCP_TEXT              = "oj-colorpalette-swatch-text",
        /** @const */   OJCP_LIST_CONTAINER    = "oj-listview-container",
        /** @const */   OJCP_LIST_ELEMENT      = "oj-listview-element",
        /** @const */   OJCP_LIST_ITEM_ELEMENT = "oj-listview-item-element",
        /** @const */   OJCP_SELECTED          = "oj-selected";

  // Misc translation keys
  var  /** @const */  TRANSKEY_NONE  = "labelNone" ;


/**
  * @ojcomponent oj.ojColorPalette
  * @augments oj.editableValue
  * @since 0.6
  *
  * @classdesc
  * <h3 id="#colorPaletteOverview-section">
  *   JET Color Palette Component
  *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#colorPaletteOverview-section"></a>
  * </h3>
  * The ojColorPalette component allows an application to display a set of pre-defined
  * colors from which a specific color can be selected. The palette's content is specified as a list
  * of color objects containing an oj.Color.
  * <p>
  * <h3 id="keyboard-section">
  *   Keyboard End User Information
  *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
  * </h3>
  * 
  * {@ojinclude "name":"keyboardDoc"}
  *
  * <p>
  *
  * 
  * <h3 id="rtl-section">
  *   Reading direction
  *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
  * </h3>
  * 
  * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the accordion must be <code class="prettyprint">refresh()</code>ed.
  * 
  * 
  * <h3 id="jqui2jet-section">
  *   JET for jQuery UI developers
  *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
  * </h3>
  * 
  * <p>ANote that event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "destroy".  
  * 
  * <h3 id="theming-section">Theming</h3>
  * <p>Details about the include and import mechanisms described below can be found in the 
  * Theming chapter of the JET documentation.</p>
  * <ul>
  * <li>Include Mechanism Variable: <code>$includeColorPaletteClasses</code>
  * <pre class="prettyprint">
  * <code>$includeAllClasses: false;
  * $includeColorPaletteClasses: true;
  * &#64;import "scss/oj/v@jetversion@/alta/oj-alta";
  * </code></pre>
  * </li>
  * <li>Import Mechanism File: 
  * <code>scss/oj/[VERSION]/[THEME NAME]/widgets/_oj.[THEME NAME].formcontrol.colorpalette.scss</code> 
  * <pre class="prettyprint">
  * <code>&#64;import "scss/oj/v@jetversion@/alta/oj.alta.variables";
  * &#64;import "scss/oj/v@jetversion@/alta/widgets/oj.alta.formcontrol.colorpalette";
  * </code></pre></li>
  * </ul>


  * @desc Creates a JET color palette.
  * </p>
  * @param {Object=} options a map of option-value pairs to set on the component
  *
  */
  oj.__registerWidget("oj.ojColorPalette", $['oj']['editableValue'], 
  {
     widgetEventPrefix : "oj", 
     defaultElement    : "<input>", 

     options: {

         /** Disables the color palette if set to <code class="prettyprint">true</code>.
           *
           * @member
           * @name disabled
           * @memberof oj.ojColorPalette
           * @instance
           * @type {boolean}
           * @default <code class="prettyprint">false</code>
           *
           * @example <caption>Initialize the color palette with the <code class="prettyprint">disabled</code> option specified:</caption>
           * $( ".selector" ).ojColorPalette( { "disabled": true } );
           *
           * @example <caption>Get or set the <code class="prettyprint">disabled</code> option, after initialization:</caption>
           * // getter
           * var disabled = $( ".selector" ).ojColorPalette( "option", "disabled" );
           *
           * // setter
           * $( ".selector" ).ojColorPalette( "option", "disabled", true );
           */
           // disabled option declared in superclass, but we still want the above API doc

         /**
           * Specify an array of objects defining the palette's color set, and optionally, descriptive labels for the colors.
           * Each object has the following structure:
           * <table><tr><th>Property</th><th>Type</th><th>Description/Format</th></tr>
           *    <tr><td>color</td><td><em>oj.Color</em></td><td>the color definition</td></tr>
           *    <tr><td>label</td><td>string</td><td>optional descriptive string (refer to option <em>labeldisplay</em>).
           *                                         If omitted, <em>label</em>defaults to the color's hex string format.</td></tr>
           * </table>
           * 
           * For convenience, a list of color string specifications (could also be from persisted/loaded JSON) can be mapped into a palette array, as follows.:<br>
           * <code>
           * var colors = [{color:'white', label: 'White'}, {color: '#7b9', label: 'Std text'}, . . .];
           * // Map the color definitions to oj.Colors objects.
           * var palette = colors.map(function(o) {
           *                            o.color = oj.Color.valueof(o.color);
           *                            return o;
           *                         });
           * </code>
           * 
           * @member
           * @type {Array}
           * @default <code class="prettyprint">null</code>
           * @expose
           * @instance
           * @memberof oj.ojColorPalette
           */
          palette:       null,
          
         /**
           * The swatch size.  May be <em>'lg'</em> (large) or <em>'sm'</em> (small) or <em>'xs'</em> (extra-small. 
           * If <em>'sm'</em> or <em>'xs'</em> is defined, the color <em>label</em> property is used as a tooltip.
           * @member
           * @type {string}
           * @default <code class="prettyprint">'lg'</code>
           * @expose
           * @instance
           * @memberof oj.ojColorPalette
           */
          swatchSize:    'lg',

         /**
           * Specifies whether a text label accompanines the color swatch. May be <em>'auto'</em> or <em>'off'</em>.
           * For <em>'auto'</em>, labels are displayed if the <em>layout</em> property is <em>'list</em>, and for a
           * <em>layout</em> of <em>'grid'</em> if <em>swatchSize</em> is <em>'lg'</em>.
           * @member
           * @type {string|null}
           * @default <code class="prettyprint">null</code>
           * @expose
           * @instance
           * @memberof oj.ojColorPalette
           */
          labelDisplay:  null,
         /**
           * Specifies the swatch presentation format.  May be <em>'grid'</em> or<em>'list'</em>.
           * @member
           * @type {string}
           * @default <code class="prettyprint">'grid'</code>
           * @expose
           * @instance
           * @memberof oj.ojColorPalette
           */
          layout:        'grid',
         /**
           * The current value of the palette component.
           * @member
           * @type {oj.Color}
           * @default <code class="prettyprint">null</code>
           * @expose
           * @instance
           * @memberof oj.ojColorPalette
           * @example <caption>Specify the initial palette color</caption>
           * <code>
           *&lt;div id="myColorPalette" aria-label="My Spectrum" 
           *  data-bind="ojComponent: {
           *                        component:    'ojColorPalette',
           *                        value:        oj.Color.RED,
           *                        optionChange: myOptionChange
           *                      }" &gt;&lt;/div&gt;
           * </code>
           * @example <caption>Get the current palette color</caption>
           * <code>
           *  var color = $("#myColorPalette").ojColorPalette("option", "value") ;
           * </code>
           * @example <caption>Change the current palette color</caption>
           * <code>
           *  $("#myColorPalette").ojColorPalette("option", "value", new oj.Color("rgba(128, 255, 240, 0.7)")) ;
           * </code>
           */
          value:         null,

          disabled:      false,

     },   // end options


     //** @inheritdoc */
     getNodeBySubId : function(locator)
     {
       if (locator == null) {
         return this.element ? this.element[0] : null;
       }

       var subId = locator['subId'],
           index = locator["index"],
           ret   = null,
           elems;

       switch (subId)
       {
         case 'oj-palette-entry' :
                                     elems = this._$LV.find("li") ;
                                     if (elems.length && index < elems.length)
                                     {
                                       ret = elems[index] ;
                                     }
                                     break ;
      }

      return ret ;
     },

     //** @inheritdoc */
     getSubIdByNode : function(elem)
     {
        var $node = $(elem),
            subId = null,
            index = -1, 
            ret   = null,
            id, elems, i ;

        if ($node.is("li") && $node.hasClass(OJCP_LIST_ITEM_ELEMENT))
        {
          subId = 'oj-palette-entry' ;
          id    = $node.attr("id") ;
          elems = this._$LV.find("li") ;
          $.each(elems, function(i, obj)
              {
                if ($(obj).attr("id") === id)
                {
                   index = i ;
                   return false ;
                }
              });    
        }

        if (subId)
        {
           ret = {'subId': subId} ;
           if (index >= 0)
           {
             ret['index'] = index ;
           }
        }
        return ret ;
     },

     /**
       * Add an entry to the palette.
       * @param {oj.Color | Object}   newEntry  An oj.Color object specfying the color to be added,
       * or an object of the same format as used for defining a palette - see the <code class="prettyprint">palette</code> option.
       * @memberof oj.ojColorPalette
       * @expose
       * @public
       * @instance
       */
     add : function(newEntry)
     {
        var o = null, c ;

        if (newEntry instanceof oj.Color)
        {
           o = { "color" : newEntry} ;
        }
        else if (typeof newEntry === "object")
        {
          c = newEntry["color"] ;
          if (c instanceof oj.Color)
          {
            o = newEntry ;
          }
        }

        if (o)
        {
          o["id"] = this._palette.length ;
          this._palDataSource.add(o) ;   // ListView will render the new entry

         // Fire an optionChange for 'palette' to the user app
         var newPalette = this._palette.slice(0) ;
         newPalette.push(o) ;
         this._fireOptionChangeEvent("palette", newPalette, null);
         this._palette.push(o) ;      // (internalSet is true in fireOptionChangeEvent)
        }
     },

     /**
       * Remove an entry from the palette.
       * @param {Object | number | oj.Color}  palEntry  Can be the zero-based index to the entry, or an
       * object containing the color specfication (using the same format as used for defining the
       * palette - see the <code class="prettyprint">palette</code> option, or an oj.Color object.
       * @memberof oj.ojColorPalette
       * @expose
       * @public
       * @instance
       */
     remove : function(palEntry)
     {
        var index = -1,
            id, t, c ;
     
        t = (typeof palEntry) ;
        if (t === "number")
        {
          index = palEntry ;
          palEntry = {} ;
        }
        else if (t === "object")
        {
          if (palEntry instanceof oj.Color)
          {
            c = palEntry ;
          }
          else
          {
            c = palEntry["color"] ;
          }
     
          index = this._findColorInPalette(c)
        }
     
        if ((index >= 0) && (index < this._palette.length))
        {
          id = this._palette[index]["id"]
          palEntry["id"] = id ;
          this._palDataSource.remove(palEntry) ;
          this._palette.splice(index, 1) ;
        }
     },

     /**
      * Returns a Promise that resolves when the component is ready and has finished rendering.
      * <p>This method does not accept any arguments.
      * @memberof oj.ojColorPalette
      * @expose
      * @public
      * @instance
      * @return {Promise} A Promise that resolves when the component is ready.
      */
     whenReady: function()
     {
        var self = this ;
        var promise = new Promise(function(resolve, reject)  {
             self._$LV.ojListView("whenReady")
                 .then(function(zz) {
                                      resolve(true);
                                     });
        });
        return promise ;
     },

     /**
      * Destroy the Color Palette
      * @memberof oj.ojColorPalette
      * @instance
      * @override
      * @protected
      */
     _destroy: function()
     {
        if (this._$LV)
        {
         this._$LV.ojListView("destroy") ;
        }
        this._palDataSource  = null ;
        this._$paletteContainer.remove() ;          // remove our markup from dom
        this._$boundElem.removeClass("oj-colorpalette");
        this._clear() ;
        this._super();
     },

     /**
       *  Called the first time the widget is called on an element.
       *  @private
       */
     _ComponentCreate: function ()
     {
        this._super() ;
        this._initPalette() ;
     },

    _AfterCreate: function()
    {
      this._super();

      var label = this._GetLabelElement();

      // Apply the label to the listview
      if (label)
      {
        // Set the aria-labelledby attribute of the listview to the returned id
        var labelId = label.attr('id');
        if (!labelId)
        {
          oj.Logger.warn("JET Color Palette: The label for this component needs an id in order " + 
            "to be accessible");
        }
        else
          this._$LV.attr('aria-labelledby', labelId);
      }
      else
      {
        // Check if the element has aria-label
        var ariaLabelString = this.element.attr('aria-label');
        if (ariaLabelString)
        {
          // Set the aria-label of the listview to the returned string
          this._$LV.attr('aria-label', ariaLabelString);
        }
      }
    },

     /**
       *  Handle an option change.
       *  Called by $(selector).ojColorPalette("option", "prop", value)
       *  @param {string}   key
       *  @param {string | oj.Color | boolean}   newval
       *  @param {Object}   flags
       *  @private
       */
     _setOption: function (key, newval, flags)
     {
        var change ;

        switch (key)
        {
           case "value"  :        change = this._setOptValue(newval) ;
                                  break ;
           case "palette" :       change = this._setOptPalette(newval) ;
                                  break ;
           case "swatchSize" :    change = this._setOptSwatchSize(newval) ;
                                  break ;
           case "layout" :        change = this._setOptLayout(newval) ;
                                  break ;
           case "labelDisplay" :  change = this._setOptLabelDisplay(newval) ;
                                  break ;
           case "disabled":       change = this._setOptDisabled(newval, true) ;
                                  break;
        }

        this._super(key, newval, flags);
     },

     /**
       *  @private
       */
     _onLVOptionChange: function(event, ui)
     {
       if (ui.option === "selection") {
         this._selected(event, ui) ;
       }
     },

     /**
       *  Compares two color values (oj.Colors) 
       *  @param {oj.Color}   color1   a color to match
       *  @param {oj.Color}   color2   a color to match
       *  @returns {boolean}  true if colors match, else false. 
       *  @private
       */
     _compareColorValues  :  function(color1, color2)
     {
        var t1  = (color1 instanceof oj.Color),
            t2  = (color2 instanceof oj.Color),
            ret = false ;

        if (t1 && t2)
        {
          ret = color1.isEqual(color2) ;
        }
        return ret ;
     },

     /**
       *  Fire optionChange event
       *  @param {string}  key             the option key whose property value has been changed.
       *  @param {Object | null}  newVal   the new value after the change
       *  @param {Event | null} origEvent  false if option change is not due to user interaction.
       *  @private
       */
     _fireOptionChangeEvent : function(key, newVal, origEvent)
     {
        if (key === "palette")  {
          this.option(key, newVal, {'_context' : { originalEvent: origEvent,
                                                   internalSet: true
                                                 },
                                    'changed': true     // don't need comparison check
                                   });
        }    // end if "value"
     },

     /**
       *  Find the supplied oj.Color in the palette and return the index to it.
       *  @param {oj.Color}  color  the color to be found.
       *  @returns {number}  the index in the palette array, or -1 if not found.
       *  @private
       */
     _findColorInPalette: function(color)
     {
        var  index = -1,
             a     = this._palette,
             l     = a.length,
             i, co ;

        for (i = 0; i < l; i++)
        {
          co = a[i] ;
          if (color.isEqual(co["color"]))
          {
             index = i ;
             break ;
          }
        }

        return index ;
     },


     /**
       *  Swatch renderer  called from ojListView.
       *  @param {Object}  context the ojListView context.
       *  @private
       */
     _renderer : function(context)
     {
       //console.log("_renderer - this._labelDisplay=" + this._labelDisplay + " swatchSize=" + this._swatchSize + " swatchClass=" + this._swatchClass) ;
       var raw ;

       var color, label, haveLabel, showLabels, none, tooltip;

       color = context["data"]["color"] ;
       if (!(color instanceof oj.Color))
       {
          // If color is undefined, will substitute black.
          color = oj.Color.BLACK;
          oj.Logger.warn("JET Color Palette: Substituting oj.Color.BLACK for an object that is " + 
            "not an instance of oj.Color");
       }

       label = haveLabel = context["data"]["label"] ;
       showLabels = ((this._labelDisplay === 'auto' && this._layout === 'list' && this._swatchSize === 'sm') ||
                     (this._labelDisplay === 'auto' && this._layout === 'grid' && this._swatchSize === 'lg'));
       
       if (color != null)
       {
          tooltip = label? label : this._convHex.format(color) ;

         if (showLabels)
         {
           label = tooltip? tooltip : this._convHex.format(color) ;
           label = haveLabel? label : label.toUpperCase() ;
         }
         else
         {
           label = null ;
         }

         none  = !!(this._isTransparent(color) || (label && label.toLowerCase() === "none"));
       }

       var selectedClass = "" ;
       if (this._initSelection === context['data']['id'])
       {
         selectedClass       = OJCP_SELECTED ;
         this._initSelection = -1 ;
         // The swatch is not rendered yet so will note the parent.  Will find the
         // swatch to remove the selection highlighting on the next selection.
         this._selectedParent = context['parentElement'] ;
       }

       var swatchClass ;
       if (this._layout === 'list')
       {
         swatchClass = "oj-colorpalette-swatchsize-" + this._swatchSize + 
           (none ? " oj-colorpalette-swatch-none" : "");
       }
       else 
       {
         swatchClass =  this._swatchClass + (none ? " oj-colorpalette-swatch-none" : "") ;
       }

       if (none)
       {
         // transparent color required
         raw =  this._renderNone(showLabels, label, tooltip, swatchClass, selectedClass); // transparent color
       }
       else {
         //  standard swatch
         raw = this._renderStandard(color, showLabels, label, tooltip, swatchClass, selectedClass);
       }

       return raw ;
     },

     /**
      *  Render a standard swatch
      *  @param {oj.Color}  color
      *  @param {boolean}   showLabels
      *  @param {string}    label
      *  @param {string}    swatchClass
      *  @param {string}    selectedClass
      *  @private
      */
     _renderStandard : function(color, showLabels, label, tooltip, swatchClass, selectedClass)
     {
//console.log("renderStandard") ;
        var raw;

        raw = "<div class='oj-colorpalette-swatch-entry " + swatchClass + 
                (showLabels ? " oj-colorpalette-swatch-showlabel" : "") + "'>" +
                "<div class='oj-colorpalette-swatch-container'>" +
                  "<div class='oj-colorpalette-swatch " + selectedClass +
                    "' style='background-color:" + color.toString() + "'" + 
                    ((! label)? " title='" + tooltip + "'" : "") + ">" + 
                  "</div>" + 
                "</div>" ;
//"' style='background:" + color.toString() + "'" + " title='" + tooltip + "' +
//((! showLabels)? " aria-label='" + tooltip + "'") + "></div>" ;
              
        if (label) {
          raw += "<span class='oj-colorpalette-swatch-text'>" + label + "</span>" ;
        }
        raw += "</div>" ;
        return  $(raw)[0] ;
     },

     /**
      * Render a 'none' swatch.
      *  @param {boolean}   showLabels
      * @param {string} label
      * @param {string} swatchClass
      * @param {string} selectedClass
      * @param {string} tooltip
      * @private
      */
     _renderNone: function(showLabels, label, tooltip, swatchClass, selectedClass)
     {
//console.log("renderNone") ;
        var raw;

        raw = "<div class='oj-colorpalette-swatch-entry " + swatchClass + 
                (showLabels ? " oj-colorpalette-swatch-showlabel" : "") + "'>" +
                "<div class='oj-colorpalette-swatch-container'>" +
                  "<div class='oj-colorpalette-swatch " + selectedClass + "'" + 
                    ((!label) ? " title='" + tooltip + "'" : "") + ">" + 
                    "<div class='oj-colorpalette-swatch-none-icon'>" +
                    "</div>" + 
                  "</div>" + 
                "</div>";
              
        if (label)
        {
          raw += "<span class='oj-colorpalette-swatch-text'>" + label + "</span>";
        }
        raw += "</div>";
        return $(raw)[0];
     },

     /**
       *   Handle selection event of a swatch from ListView
       *   @param {Event}   event  the associated Event object.
       *   @param {Object}  ui the context object.
       *   @private
       */
     _selected : function(event, ui)
     {
//console.log("_selected " + (typeof ui.value) + " " + $.isArray(ui.value) + " ui.value=" + ui.value + " " +  debugObj(ui.value)) ;
         var newColor = null, swatch, lastSelected ;

         // Color the internal swatch border (normally transparent) so that it
         // shows as selected.
         swatch = $(ui.items[0]).find(".oj-colorpalette-swatch") ;
         swatch.addClass(OJCP_SELECTED) ;

         // Remove the last selected swatch highlighting
         lastSelected = this._selectedSwatch ;
         this._selectedSwatch = swatch ;
         if (! lastSelected)
         {
            // Do we have an initial selection to remove
            if (this._selectedParent)
            {
               lastSelected = $(this._selectedParent).find(".oj-colorpalette-swatch") 
               this._selectedParent = null ;
            }
         }     
         if (lastSelected)
         {
           lastSelected.removeClass(OJCP_SELECTED) ;
         }

         // Fire value-changed event
         if (ui.value.length === 1)
         {
           newColor  = this._palette[ui.value]["color"] ;
         }
         else
         {
           // No value, probably because its a deselection caused by a changing the pallete
           // option and the current value is not in the new palette.  Will leave the value
           // as is, and not fire a value change event.
           return ;
         }
         this._SetValue(newColor, event);
         this._value = newColor ;
     },

     /**
      * Handle "disabled" option change.
      * @param {boolean}  disabled  the "disabled" option value. 
      * @param {boolean} applyOnlyIfDifferent Only apply the new value if it's different from the
      *        current value.
      * @returns {boolean}   true if the "disabled" option changed, else false.
      * @private
      */
     _setOptDisabled : function(disabled, applyOnlyIfDifferent)
     {
        var $swatches, $obj, t,
            change = !applyOnlyIfDifferent ||
                     (applyOnlyIfDifferent && (disabled !== this._disabled)) ;

        if (change)
        {
          if (this._$LV)
          {
            this._$LV.ojListView("option", "disabled", disabled) ;
          }

          $swatches = $(".oj-colorpalette-container .oj-colorpalette-swatch");
          t = this;

          // Enable/diable the appearance of the swatches
          if (disabled)
          {
            //  ListView doesn't show any difference to the disabled items, so do it here
            this._disabledBG = [] ;
            $.each($swatches, function(i, obj) {
                t._disabledBG.push(obj.style.backgroundColor) ;
                obj.style.backgroundColor = "#eee" ;
            });
          }
          else
          {
            if (this._disabledBG && this._disabledBG.length)
            {
              $.each($swatches, function(i, obj) {
                  obj.style.backgroundColor = t._disabledBG[i] ;
              });
            }
            this._disabledBG = null ;
          }

          this._disabled = disabled;
        }
        return change ;
     },

     /**
       *  Handle "value" option change.
       *  @param {oj.Color}  color  the "value" option color.
       *  @returns {boolean}  true if the "value" option caused the selection to change,
       *                      else false.
       *  @private
       */
     _setOptValue :  function(color)
     {
        var palIndex = -1;
        var pal = [] ;

//console.log(this._debug + "setOptValue c=" + color.toString() + " prev value=" + this._value.toString()); 

        if (this._palette.length > 0)
        {
          if (color instanceof oj.Color)
          {
            // Check if value has changed
            if (! this._compareColorValues(this._value, color))
            {
               // Color is different from current
               palIndex = this._findColorInPalette(color) ;
               if (palIndex >= 0)
               {
                  // Found in palette, so select it
                  pal.push(palIndex) ;
               }
               this._$LV.ojListView("option", "selection", pal) ;   // select, or deselect if not found
               this._value = color ;
            }
          }
        }

        return (palIndex >= 0) ;        // return index or -1
     },

     /**
       *  Handle "palette" option change.
       *  @param {Array}  palette  the "palette" option array. 
       *  @returns {boolean}  true if the "palette" option array is different from the current
       *                      option, else false.
       *  @private
       */
     _setOptPalette :  function(palette)
     {
        var ret = false ;
        if ($.isArray(palette))
        {
          if (! this._isPaletteEqual(palette, this._palette))
          {
              // Palettes are different
              this._palette = palette.slice(0); ;   // make copy in case app is using same array
              this._initSelection = this._findColorInPalette(this._value) ;
              this._setData(palette, this._initSelection, true) ;
              ret = true ;
          }
        }

        return ret ;
     },

     /**
       *   Handle "swatchSize" option change.
       *   @private
       */
     _setOptSwatchSize :  function(swatchSize)
     {
        var ret = false ;

        if (typeof swatchSize === "string")
        {
           if (swatchSize !== this._swatchSize)
           {
              this._swatchSize = swatchSize ;
              this._swatchClass = "oj-colorpalette-swatchsize-" + (swatchSize === "lg"? "lg" : 
                                                                  ((swatchSize === "sm")? "sm" : "xs")) ;
              this._$LV.ojListView("refresh") ;
              ret = true ;
           }
        }

        return ret ;
     },

     /**
       *  Handle "labelDisplay" option change.
       *  @param {string}  labelDisplay  the "labelDisplay" option value. 
       *  @private
       */
     _setOptLabelDisplay :  function(labelDisplay)
     {
        var ret = false ;

        if (typeof labelDisplay === "string")
        {
           if (labelDisplay !== this._labelDisplay)
           {
             if (labelDisplay === "auto" || labelDisplay === "off")
             {
               this._labelDisplay = labelDisplay ;
             this._$LV.ojListView("refresh") ;
               ret = true ;
             }
           }
        }

        return ret ;
     },

     /**
       *  Handle "layout" option change.
       *  @param {string}  layout  the "layout" option value. 
       *  @private
       */
     _setOptLayout :  function(layout)
     {
        var ret = false;

        if (typeof layout === "string")
        {
           if (layout !== this._layout)
           {
              this._layout = layout ;
              this._setDisplayFormat() ;
              this._$LV.ojListView("refresh") ;
              ret = true ;
           }
        }

        return ret ;
     },

     /**
       * Update the ListView display format
       * @private
       */
     _setDisplayFormat:  function()
     {
        var grid         = (this._layout === 'grid') ;
        var layoutClass  = (grid ? 'oj-colorpalette-grid' : 'oj-colorpalette-list') ;

        this._$LV.removeClass("oj-colorpalette-grid oj-colorpalette-list oj-listview-card-layout") ;
        this._$LV.addClass(layoutClass) ;
        if (grid)
        {
          //this._$LV.addClass("oj-listview-card-layout") ; // this causes rendering problems
          this._$LV.css("display", "flex");
          this._$LV.css("flex-wrap", "wrap") ;
        }
        else
        {
          this._$LV.css('display', '');
          this._$LV.css('flex-wrap', '');
        }
     },

     /**
       *  Update the ListView data option
       *  @private
       */
     _setData : function(palette, initSelected, setOption)
     {
//console.log("_setData palDatasource len=" + palette.length) ;
       this._addIndexesToPalette(palette) ;            // add "id" props
//console.log(debugObj(palette)) ;
       this._palDataSource  = new oj.ArrayTableDataSource(palette, {"idAttribute": "id"});

       //  If current value property matches a supplied swatch, select it.
       if (initSelected >= 0)
       {
         if (this._palInitSelected.length === 0)
         {
           this._palInitSelected.push(initSelected) ;
         }
         else
         {
           this._palInitSelected[0] = initSelected ;
         }
       }
       else
       {
           // TDO  do we need to deselect here??
       }

       if (setOption)
       {
         this._$LV.ojListView("option", "data", this._palDataSource) ;
       }
     },


    /**
      *   Initializes the widget, examines options and sets up
      *   internal data structures.
      *   @private
      */
     _initPalette : function()
     {
        this._initData() ;
        this._setup() ;
     },

     /**
       *  Perform setup, and init the ListView
       *  @private
       */
     _setup :  function()
     {
        // Add new listview markup as a child of this component's DOM element
        this._$boundElem.append(this._markup) ;
        this._$boundElem.addClass("oj-colorpalette");
        this._$paletteContainer = this._$boundElem.find(".oj-colorpalette-container");
        this._$LV               = this._$paletteContainer.find(":first");  //Listview UL

        //  If value property matches a supplied swatch, note for initial selection.
        if (this._value && this._value instanceof oj.Color)
        {
          this._initSelection = this._findColorInPalette(this._value) ;
        }
        
        this._setData(this._palette, this._initSelection, false) ;

        //  Instantiate the ListView
        this._$LV.ojListView({
                               "data":           this._palDataSource,
                               "item":           {"renderer": this._renderer.bind(this)},
                               "optionChange":   this._onLVOptionChange.bind(this),
                               "selectionMode":  'single',
                               "selection":      this._palInitSelected,
                               "rootAttributes": {style: "height:100%;width:100%"}
                  }).attr('data-oj-internal', ''); // for use in automation api



//this._debug = this._$boundElem.hasClass("demo-saved-palette")? "SAVEDPAL  " : "PALETTE  " ;

        // don't want any list text if palette is empty
        this._$LV.ojListView("option", "translations")["msgNoData"] = "" ;
        
        var self = this;
        this._$LV.ojListView("whenReady").then(function() {
          self._setOptDisabled(self._disabled);
          
          //FIX : when there is a vertical scrollbar, add
          //padding so that no horizontal scrollbar is needed and the 
          //text doesn't get cut off or truncated
          if (self._$LV[0].scrollWidth > self._$LV[0].clientWidth)
          {
            var scrollbarWidth = self._getScrollbarWidth();
            var rtl = (self._GetReadingDirection() === "rtl");
            self._$LV.css(rtl ? "padding-left" : "padding-right", 
              scrollbarWidth + 1);
          }
        });
     },

    /**
      *  Set up instance data
      *  @private
      */
     _initData : function()
     {
        this._applyOptions() ;     // process the component options

        this._converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_COLOR);
        this._convHex  =  this._converterFactory.createConverter({"format": "hex"}) ;

        this._labelNone = this.getTranslatedString(TRANSKEY_NONE);

        var layoutClass, layoutStyle ;
        if ( this._layout === 'grid')
        {
//          layoutClass =  "oj-colorpalette-grid oj-listview-card-layout" ;     // tdo why does this cause problems
          layoutClass =  "oj-colorpalette-grid" ;
          layoutStyle = "display:flex;flex-wrap:wrap;"
        }
        else 
        {
          layoutClass =  "oj-colorpalette-list" ;
          layoutStyle = "" ;
        }
//orig layoutClass      =  (this._layout === 'grid'? 'oj-colorpalette-grid' : 'oj-colorpalette-list') ;
//orig layoutClass      += (this._layout === 'grid'? "'oj-listview-card-layout' style='display:flex;flex-wrap:wrap;'" : "");
//orig var layoutClassStyle = (this._layout === 'grid'? "'oj-listview-card-layout' style='display:flex;flex-wrap:wrap;'" : "");


        //  Create the inner ListView markup
        this._markup = (function () {
           return [
             "<div class='oj-colorpalette-container'>",
                "<ul class='" + layoutClass + "'" + (layoutStyle? (" style='" + layoutStyle + "'") : "") + " />",
             "</div>"
           ].join("") ;
        })();
     },


    /**
      *  Process the component options
      *  @private
      */
     _applyOptions : function()
     {
        var  opts = this.options,
             opt ;

        this._doc             = this.element[0].ownerDocument ;
        this._body            = this._doc.body ;
        this._$boundElem      = $(this.element) ;
        this._disabled        = false ;
        this._palInitSelected = [] ;
        this._palDataSource   = null ;

        opt = opts["swatchSize"] ;
        if (typeof opt === "string") {
          opt = opt.toLowerCase() ;
          if (opt !== "lg" && opt !== "sm" && opt !== "xs")
            opt = "lg" ;
        }
        this._swatchSize  = opt;
        this._swatchClass = "oj-colorpalette-swatchsize-" + opt ;

        opt = opts["labelDisplay"] ;
        if (typeof opt === "string") {
          opt = opt.toLowerCase() ;
          if (opt !== "auto" && opt !== "off")
            opt = "auto" ;
        }
        this._labelDisplay = opt ;

        opt = opts["layout"] ;
        if (typeof opt === "string") {
          opt = opt.toLowerCase() ;
          if (opt !== "grid" && opt !== "list")
            opt = "grid" ;
          if (opt !== "grid" && this._swatchSize === "xs")
          {
            opt = "grid" ;
          }
        }
        this._layout = opt ;

        opt = opts["value"] ;
        if (! (opt instanceof oj.Color))
        {
          opt = null ;
        }
        this._value = (opt? opt : oj.Color.BLACK) ;

        opt = opts["palette"] ;
        if (! $.isArray(opt))
        {
          opt = [] ;
        }
//MASH        this._palette = opt ;
this._palette = opt.slice(0); ;

/*
        opt = opts["renderer"] ;
        if ($.isFunction(opt))
        {
          this._appRenderer = opt ;
        }
*/
        opt = opts["disabled"] ;
        if (typeof opt === "boolean")
        {
          this._disabled = opt ;
        }
     },

    /**
      *  Returns true if an oj.Color represents the 'transparent'.
      *  @param {oj.Color} color the color object to be tested.
      *  @returns {boolean}  true if oj.Color is transparent, else false.
      *  @private
      */
    _isTransparent : function(color)
    {
       var r = color.getRed(),
           g = color.getGreen(),
           b = color.getBlue(),
           a = color.getAlpha();
       
       return (r === 0 && g === 0 && b === 0 && a === 0) ;
    },

    /**
      *   Compare two palette arrays. (index property is not checked.)
      *   @private
      */
    _isPaletteEqual : function(pal1, pal2)
    {
      var len1 = pal1.length,
          len2 = pal2.length,
          lab1, lab2, o1, o2, i, ret  ;

      ret = false ;
      if (len1 === len2)
      {
        for (i = 0; i < len1; i++)
        {
          o1 = pal1[i] ;
          o2 = pal2[i] ;
          if (this._compareColorValues(o1["color"], o2["color"]))
          {
            lab1 = o1["label"] ;
            lab2 = o2["label"] ;
            if (lab1 !== lab2)
            {
              break ;
            }
          }
        }

        ret = (i >= len1) ;
      }
      return ret ;
    },

    /**
      *   Add "id" property to palette entries
      *   @private
      */
    _addIndexesToPalette : function(palette)
    {
       var i, o, l = palette.length ;
       for (i = 0; i < l; i++)
       {
         o = palette[i] ;
         o["id"] = i ;
       }
    },

     /**
       *  Clear resources
       *  @private
       */
     _clear : function()
     {
        this._converterFactory      = 
        this._convHex               = 
        this._markup                = 
        this._$LV                   = null ;
     },
     
    /**
     * Get the width of a vertical scrollbar.
     * @returns {number} Width of a vertical scrollbar
     * @private
     */
    _getScrollbarWidth: function()
    {
      var div = $(
        "<div style='overflow: scroll; width: 100px; height: 100px; " + 
            "position: absolute; visibility: hidden;'>" + 
          "<div style='width: 100%; height: 100%;'></div>" + 
        "</div>"
      );
      this.element.append(div);
      var outerWidth = div[0].offsetWidth;
      var innerWidth = div.children()[0].offsetWidth;
      div.remove();
      return (outerWidth - innerWidth);
    },

    /**
     * Returns a jquery object of the launcher element representing the content nodes.
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorPalette
     */
    _GetMessagingLauncherElement: function () {
      return this.element;
    },

    /**
     * Returns a jquery object of the elements representing the content nodes (spectrum thumb).
     * @protected
     * @override
     * @instance
     * @memberof oj.ojColorPalette
     */
    _GetContentElement: function () {
      return this._$LV;
    },

    /**
     * Returns the element's value. Normally, this is a call to this.element.val(), but for some 
     * components, it could be something else. E.g., for ojRadioset the element's value is really the 
     * value of the selected radio in the set. 
     * 
     * @override
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     */
    _GetElementValue : function () 
    {
      return this._value;
    },

    /**
     * Called when the display value on the element needs to be updated. This method updates the
     * (content) element value. 
     *
     * @param {String} displayValue of the new string to be displayed
     *
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     * @override
     */
    _SetDisplayValue: function (displayValue) {
      if (typeof displayValue === "string")
        this._value = new oj.Color(displayValue);
      else
        this._value = displayValue;
    },

    /**
     * Returns the display value that is ready to be passed to the converter.
     *
     * @return {string} usually a string display value
     *
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     * @override
     */
    _GetDisplayValue: function () {
      return this._value.toString();
    },

    /**
     * Returns the default styleclass for the component. All input components must override.
     * 
     * @return {string}
     * 
     * @memberof oj.ojColorPalette
     * @instance
     * @protected
     * @override
     */
    _GetDefaultStyleClass : function ()
    {
      return "oj-colorpalette";
    }


    // Fragments:

    /**
     * <p>Sub-ID for a palette swatch item at a specific index.</p>
     *
     * @ojsubid oj-palette-entry
     * @memberof oj.ojColorPalette
     *
     * @example <caption>Get the palette's internal JET ojListView entry for the third palette swatch:</caption>
     * var node = $( ".selector" ).ojColorPalette( "getNodeBySubId", {'subId': 'oj-palette-entry', 'index': 2} );
     */

    /**
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>Space or Enter</kbd></td>
     *       <td>Select a color swatch.</tr>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>PgDn</kbd></td>
     *       <td>Navigates down the swatch display to the next page.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>PgUp</kbd></td>
     *       <td>Navigates up the swatch display to the previous page.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Navigate to the next swatch if in list layout, or to the swatch in the same position in the next row if in grid layout.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Navigate to the previous swatch if in list layout, or to the swatch in the same position in the previous row if in grid layout.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Navigate to the next swatch.</td>
     *     </tr>
     *     <tr>
     *       <td>Swatch</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Navigate to the previous swatch.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojColorPalette
     */


  }) ;    // end    $.widget("oj.ojColorPalette", ...


})();


});
