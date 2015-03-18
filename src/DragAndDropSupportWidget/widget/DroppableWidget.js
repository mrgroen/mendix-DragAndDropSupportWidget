/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console */
/*mendix */
/*
    DroppableWidget
    ========================

    @file      : DroppableWidget.js
    @version   : 1.0
    @author    : Marcel Groeneweg
    @date      : Mon, 09 Mar 2015 08:17:04 GMT
    @copyright : Synobsys
    @license   : Apache 2

    Documentation
    ========================
    Droppable widget
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require({
    packages: [{ name: 'jquery', location: '../../widgets/DragAndDropSupportWidget/lib', main: 'jquery-1.11.2.min' }]
}, [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 
    'mxui/dom', 'dojo/dom', 
    'jquery', 'jqueryui'
], function (declare, _WidgetBase, dom, dojoDom, $) {
    'use strict';
    
    // Declare widget's prototype.
    return declare('DragAndDropSupportWidget.widget.DroppableWidget', [ _WidgetBase ], {

        // Parameters configured in the Modeler.

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            console.log(this.id + '.postCreate');
            
//            this.domNode.appendChild(dom.create('span', { 'class': 'DroppableWidget-message' }, this.messageString));

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + '.update');

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

        // mxui.widget._WidgetBase.enable is called when the widget should enable editing. Implement to enable editing if widget is input widget.
        enable: function () {

        },

        // mxui.widget._WidgetBase.enable is called when the widget should disable editing. Implement to disable editing if widget is input widget.
        disable: function () {

        },

        // mxui.widget._WidgetBase.resize is called when the page's layout is recalculated. Implement to do sizing calculations. Prefer using CSS instead.
        resize: function (box) {

        },

        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        },

        _setupEvents: function () {
//            this.connect(this.domNode, 'click', function () {
//                mx.data.action({
//                    params: {
//                        applyto: 'selection',
//                        actionname: this.mfToExecute,
//                        guids: [this._contextObj.getGuid()]
//                    },
//                    callback: function (obj) {
//                        //TODO what to do when all is ok!
//                    },
//                    error: function (error) {
//                        console.log(this.id + ': An error occurred while executing microflow: ' + error.description);
//                    }
//                }, this);
//            });
        },

        _updateRendering: function () {

        },

        _resetSubscriptions: function () {
            // Release handle on previous object, if any.
            if (this._handle) {
                this.unsubscribe(this._handle);
                this._handle = null;
            }

            if (this._contextObj) {
                this._handle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: this._updateRendering
                });
            }
        }
    });
});
