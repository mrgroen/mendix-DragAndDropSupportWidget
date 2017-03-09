/*jslint white:true, nomen: true, plusplus: true */
/*global mx, define, require, browser, devel, console */
/*mendix */
/*
    DroppableWidget
    ========================

    @file      : DroppableWidget.js
    @version   : 1.0
    @author    : Marcel Groeneweg
    @date      : 20-02-2017
    @copyright : ITvisors
    @license   : Apache 2

    Documentation
    ========================
    Droppable widget
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
require( [
    'dojo/_base/declare', 'mxui/widget/_WidgetBase', 
    'mxui/dom', 'dojo/_base/lang',
    'DragAndDropSupportWidget/lib/jquery.ui.touch-punch'
], function (declare, _WidgetBase, dom, lang, $) {
    'use strict';
    
    // Declare widget's prototype.
    return declare('DragAndDropSupportWidget.widget.DroppableWidget', [ _WidgetBase ], {

        // Parameters configured in the Modeler.

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handle: null,
        _contextObj: null,
        _dropData: null,
        _dropEntityItem: null,

        // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
        constructor: function () {
        },

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
//            console.log(this.id + '.postCreate');
            
//            this.domNode.appendChild(dom.create('span', { 'class': 'DroppableWidget-message' }, this.messageString));

            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
//            console.log(this.id + '.update');

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
            var args = {},
                node,
                thisObj = this;
            
            if (this.acceptSelector) {
                args.accept = this.acceptSelector;
            }
            args.greedy = true;
            args.hoverClass = this.dropTargetHoverClass;
            args.drop = function (event, ui) {
                thisObj._drop(event, ui);
            };
            if (this.dropTargetSelector) {
                node = $(this.dropTargetSelector);
            } else {
                node = $(this.domNode.parentElement);
            }
            node.addClass(this.dropTargetClass).droppable(args);
         
        },
        
        _drop: function (event, ui) {
            var droppedObjectType,
                droppedObjectGuid,
                index;
            
            this._dropData = ui;
                        
            droppedObjectType = ui.draggable.attr("data-object-type");
            droppedObjectGuid = ui.draggable.attr("data-object-guid");
            for (index = 0; index < this.dropEntityList.length; index++) {
                if (droppedObjectType === this.dropEntityList[index].draggedEntity) {
                    this._dropEntityItem = this.dropEntityList[index];
                    console.log("Dropped " + droppedObjectType + ":" + droppedObjectGuid + " onto " + this._contextObj.getEntity() + ":" + this._contextObj.getGuid());
                    mx.data.create({
                        entity   : this._dropEntityItem.onDropEntity,
                        callback : lang.hitch(this, this.onDropObjectCreated),
                        error    : lang.hitch(this, this.onDropObjectCreateError)
                    });
                }
            }

        },


        /**
         * Called upon creation of onDropEntity
         *
         * @param mendixObject  The new Mendix object
         */
        onDropObjectCreated : function (mendixObject) {

            // console.log("onDropObjectCreated");
            var draggedReference,
                droppedObjectGuid,
                dropTargetReference;

            draggedReference = this._dropEntityItem.draggedReference.substr(0, this._dropEntityItem.draggedReference.indexOf('/'));
            dropTargetReference = this._dropEntityItem.dropTargetReference.substr(0, this._dropEntityItem.dropTargetReference.indexOf('/'));
            droppedObjectGuid = this._dropData.draggable.attr("data-object-guid");
            mendixObject.addReference(draggedReference, droppedObjectGuid);
            mendixObject.addReference(dropTargetReference, this._contextObj.getGuid());
            // console.log("Commit object");
            this.onDropMendixObject = mendixObject;
            mx.data.commit({
                mxobj    : mendixObject,
                callback : lang.hitch(this, this.onDropMendixObjectCommitted),
                error    : lang.hitch(this, this.onDropMendixObjectCommitError)
            });
        },

        /**
         * Called after object committed
         *
         */
        onDropMendixObjectCommitted : function () {

            // console.log("onDropMendixObjectCommitted");
            
            mx.data.action({
                params       : {
                    applyto     : "selection",
                    actionname  : this._dropEntityItem.onDropMicroflow,
                    guids : [this.onDropMendixObject.getGuid()]
                },
                callback     : lang.hitch(this, this.onDropMicroflowCallback),
                error        : lang.hitch(this, this.onDropMicroflowError),
                onValidation : lang.hitch(this, this.onDropMicroflowError)
            });
            if (this._dropData.draggable.draggable("option", "helper") === "original") {
                // When the original item is dragged, it must be returned to its original position.
                // Mendix does not recreate widgets when refreshing lists but just updates existing widgets where possible and creates new ones when necessary.
                this._dropData.draggable.css({top: "0px", left: "0px"});
            }

        },

        /**
         * Call to onDrop microflow completed
         *
         */
        onDropMicroflowCallback : function () {
            this._moveDraggedNodeBack();

        },       

        /**
         * Called after creation of onDropEntity failed
         *
         * @param err       The error object, if any
         */
        onDropObjectCreateError : function (err) {

            console.dir(err);
            console.log("Create object of entity " + this.onDropEntity + " ended with an error");

        },

        /**
         * Called after commit of onDropEntity failed
         *
         * @param err       The error object, if any
         */
        onDropMendixObjectCommitError : function (err) {

            console.dir(err);
            console.log("Commit object of entity " + this.onDropEntity + " ended with an error");

        },

        /**
         * Call to onDrop microflow failed
         *
         * @param err       The error object, if any
         */
        onDropMicroflowError : function (err) {

            this._moveDraggedNodeBack();
            console.dir(err);
            console.log("Call to microflow " + this.onDropMicroflow + " ended with an error");

        },       
        
        _moveDraggedNodeBack: function () {
            if (this._dropData.draggable.draggable("option", "helper") === "original") {
                // When the original item is dragged, it must be returned to its original position.
                // Mendix does not recreate widgets when refreshing lists but just updates existing widgets where possible and creates new ones when necessary.
                this._dropData.draggable.css({top: "0px", left: "0px"});
            }
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
