/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequestHandler
 *
 */
Oskari.clazz.define('Oskari.upt.suitability.request.ShowSuitAbilityRequestHandler', function(sandbox, instance) {
    this.sandbox = sandbox;

    /** @property instance */
    this.instance = instance;
    this._log = Oskari.log('ShowSuitAbilityRequestHandler');
}, {

    /** @method handleRequest dispatches processing to instance */
    handleRequest: function(core, request) {
        this._log.debug('Show SuitAbility: ' + request.getUuid());
        this.instance.scheduleShowSuitAbility(request);
    }
}, {
    protocol: ['Oskari.mapframework.core.RequestHandler']
});