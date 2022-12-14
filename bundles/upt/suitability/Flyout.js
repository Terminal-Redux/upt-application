/**
 * @class Oskari.upt.suitability.Flyout
 *
 * Renders the "suitability" flyout.
 */
Oskari.clazz.define('Oskari.upt.suitability.Flyout',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.upt.suitability.SuitAbilityBundleInstance}
     *        instance reference to component that created the tile
     */
    function(instance) {
        this.userGuideTabs = [];
    }, {

        /**
         * @method setEl
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         * Interface method implementation
         */
        setEl: function(el, flyout, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('suitability')) {
                jQuery(this.container).addClass('suitability');
            }
            if (!flyout.hasClass('suitability')) {
                flyout.addClass('suitability');
            }
        },

        /**
         * @method startPlugin
         * called by host to start flyout operations
         */
        startPlugin: function() {
            this.userGuideTabs = this.instance.getLocalization('tabs') || [];
        },

        /**
         * @method createUi
         * Creates the UI for a fresh start
         */

        createUi: function() {
            var me = this,
                i,
                newtab,
                tab;
            me.cel = jQuery(me.container);
            me.cel.empty();
            this.userGuideTabs = this.instance.getLocalization('tabs') || [];
            if (this.instance.getLocalization('tabs')) {
                me.tabContainer = Oskari.clazz.create('Oskari.userinterface.component.TabContainer');

                for (i = 0; i < me.userGuideTabs.length; i += 1) {
                    newtab = me.userGuideTabs[i];
                    tab = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
                    tab.setTitle(newtab.title);
                    tab.setContent(me.getLocalization('flyout').loadingtxt);
                    tab.tagsTxt = newtab.tags;

                    me.tabContainer.addPanel(tab);
                }
                me.tabContainer.insertTo(me.cel);
            }
        },

        /**
         * @method getUserGuides
         * Calling method will return userGuideTabs
         */

        getUserGuides: function() {
            return this.userGuideTabs;
        },

        /**
         * @method setContent
         * Sets content to container
         */

        setContent: function(content, tagsTxt) {
            var me = this;
            if (this.instance.getLocalization('tabs')) {
                var tabs = me.tabContainer.panels,
                    i,
                    newtab;
                for (i = 0; i < tabs.length; i += 1) {
                    newtab = tabs[i];
                    if (tagsTxt === newtab.tagsTxt) {
                        newtab.setContent(content);
                    }
                }
            } else {
                me.cel.append(content);
            }
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });