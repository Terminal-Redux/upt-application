import React from 'react';
import { Message } from 'oskari-ui';
/**
 * @class Oskari.upt.suitability.SuitAbilityBundleInstance
 *
 * Renders help text.
 *
 */
Oskari.clazz.define('Oskari.upt.suitability.SuitAbilityBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function() {
        this._requestHandlers = {};
        this.attachedToDefault = false;
        this.helper = null;
        this.isContentLoaded = false;

        // override defaults
        var conf = this.getConfiguration();
        conf.name = 'upt.SuitAbility';
        conf.flyoutClazz = 'Oskari.upt.suitability.Flyout';
        this.defaultConf = conf;
    }, {
        /**
         * @method afterstart
         * implements BundleInstance protocol start methdod
         */
        afterStart: function(sandbox) {
            var conf = this.getConfiguration(),
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox';
            sandbox = Oskari.getSandbox(sandboxName);

            // request
            this._requestHandlers['suitability.ShowSuitAbilityRequest'] = Oskari.clazz.create('Oskari.upt.suitability.request.ShowSuitAbilityRequestHandler', sandbox, this);
            sandbox.requestHandler('suitability.ShowSuitAbilityRequest', this._requestHandlers['suitability.ShowSuitAbilityRequest']);

            // draw ui
            this.plugins['Oskari.userinterface.Flyout'].createUi();

            // get help content
            this.helper = Oskari.clazz.create('Oskari.userinterface.component.UIHelper', sandbox);
            this.localization = Oskari.getLocalization(this.getName());
            this._registerForGuidedTour();
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {

            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function(event) {
                var me = this;

                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isOpen = event.getViewState() !== 'close';
                me.displayContent(isOpen);
            }
        },

        /**
         * @method displayContent
         */

        displayContent: function(isOpen) {
            var me = this;
            var newtab;
            var i;
            if (!isOpen) {
                return;
            }
            if (me.isContentLoaded) {
                return;
            }

            var helpContentPart = 'body';
            if (me.getLocalization('help')) {
                helpContentPart = me.getLocalization('help').contentPart || helpContentPart;
            }

            function closureMagic(tagsTxt) {
                return function(isSuccess, pContent) {
                    var content = pContent;
                    var errorTxt = 'error.generic';
                    if (me.getLocalization('error') &&
                        me.getLocalization('error').generic) {
                        errorTxt = me.getLocalization('error').generic;
                    }
                    if (!isSuccess) {
                        content = errorTxt;
                    } else if (content[helpContentPart]) {
                        content = content[helpContentPart];
                    }

                    me.plugins['Oskari.userinterface.Flyout'].setContent(content, tagsTxt);
                    me.isContentLoaded = true;
                };
            }

            var userGuideTabs = me.plugins['Oskari.userinterface.Flyout'].getUserGuides();
            for (i = 0; i < userGuideTabs.length; i += 1) {
                newtab = userGuideTabs[i];
                me.helper.getHelpArticle(
                    newtab.tags,
                    closureMagic(newtab.tags)
                );
            }
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        'stop': function() {
            var sandbox = this.sandbox(),
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            /* request handler cleanup */
            sandbox.removeRequestHandler('suitability.ShowSuitAbilityRequest', this._requestHandlers['suitability.ShowSuitAbilityRequest']);

            var request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(this, request);

            // this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 110,
            show: function() {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'upt.SuitAbility']);
            },
            hide: function() {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'upt.SuitAbility']);
            },
            getTitle: function() {
                return this.localization.guidedTour.title;
            },
            getContent: function() {
                return <Message bundleKey = { this.getName() }
                messageKey = 'guidedTour.message'
                allowHTML / > ;
            },
            getLinks: function() {
                var me = this;
                var loc = this.localization.guidedTour;
                return [{
                        title: loc.openLink,
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'upt.SuitAbility']),
                        visible: false
                    },
                    {
                        title: loc.closeLink,
                        onClick: () => me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'upt.SuitAbility']),
                        visible: true
                    }
                ];
            }
        },
        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function() {
            var me = this;

            function sendRegister() {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder && me.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for (var prop in me.__guidedTourDelegateTemplate) {
                        if (typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler(msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    });