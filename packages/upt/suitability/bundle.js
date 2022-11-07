/**
 * @class Oskari.upt.suitability.SuitAbilityBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.upt.suitability.SuitAbilityBundle",
    /**
     * @method create called automatically on construction
     * @static
     */
    function() {

    }, {
        "create": function() {
            return Oskari.clazz.create("Oskari.upt.suitability.SuitAbilityBundleInstance");

        },
        "update": function(manager, bundle, bi, info) {

        }
    }, {

        "protocol": ["Oskari.bundle.Bundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../bundles/upt/suitability/instance.js"
            }],

            "locales": [
                // {
                //     "lang": "fi",
                //     "type": "text/javascript",
                //     "src": "../../../../bundles/sample/sample-info/resources/locale/fi.js"
                // }, {
                //     "lang": "sv",
                //     "type": "text/javascript",
                //     "src": "../../../../bundles/sample/sample-info/resources/locale/sv.js"
                // },
                {
                    "lang": "en",
                    "type": "text/javascript",
                    "src": "../../../bundles/sample/sample-info/resources/locale/en.js"
                },
                // {
                // "lang": "is",
                // "type": "text/javascript",
                // "src": "../../../../bundles/sample/sample-info/resources/locale/is.js"
                // }
            ]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "suitability",
                "Bundle-Name": "suitability",
                "Bundle-Author": [{
                    "Name": "UPTech",
                    "Organisation": "technology.up",
                    "Temporal": {
                        "Start": "2022",
                        "End": "2022"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"],
                "Import-Bundle": {}

            }
        }
    });

Oskari.bundle_manager.installBundleClass("suitability", "Oskari.upt.suitability.SuitAbilityBundle");