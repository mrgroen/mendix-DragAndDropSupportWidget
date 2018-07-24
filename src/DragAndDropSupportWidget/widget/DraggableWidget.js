/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console */
/*mendix */
/*
    DraggableWidget
    ========================

    @file      : DraggableWidget.js
    @version   : 1.1.1
    @author    : Marcel Groeneweg
    @date      : 20-02-2017
    @copyright : ITvisors
    @license   : Apache 2

    Documentation
    ========================
    Draggable widget
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require([
    'dojo/_base/declare', 'mxui/widget/_WidgetBase',
    'mxui/dom',
    'DragAndDropSupportWidget/lib/jquery.ui.touch-punch'
], function (declare, _WidgetBase, dom, $) {
    'use strict';

    // Declare widget's prototype.
    return declare('DragAndDropSupportWidget.widget.DraggableWidget', [ _WidgetBase ], {

        // Parameters configured in the Modeler.

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
//            console.log(this.id + '.postCreate');

//            this.domNode.appendChild(dom.create('span', { 'class': 'DraggableWidget-message' }, this.messageString));

            this._setupEvents();
        },

            if (callback) {
            callback();
            }
        },

        _setupEvents: function () {
            var args = {};
            if (this.dragContainment) {
                args.containment = this.dragContainment;
            }
            args.revert = "invalid";
            if (this.makeClone) {
                args.helper = "clone";
            }
            $(this.domNode.parentElement).addClass(this.draggableClass).draggable(args);
        },

        _updateRendering: function () {
            $(this.domNode.parentElement).attr({
                "data-object-type" : this._contextObj && this._contextObj.getEntity() || "",
                "data-object-guid" : this._contextObj && this._contextObj.getGuid() || ""
            });
            }

    });
});
