var _ = require('lodash');

var Doxer = function(doxData) {
    this.data = doxData;
};

Doxer.prototype.getProperties = function() {

    return _.filter(this.data, function(item) {

        return item.ctx.type === 'property' && !item.isClass && !item.isConstructor;

    });

};

Doxer.prototype.getEvents = function() {

    return _.filter(this.data, function(item) {

        return item.isEvent;

    });

};

Doxer.prototype.getMethods = function() {

    return _.filter(this.data, function(item) {

        return item.ctx.type === 'method' && !item.isClass && !item.isConstructor;

    });

};

Doxer.prototype.getTypes = function(propertyItem){

    if (!propertyItem) {
        return [];
    }

    if (typeof propertyItem === 'number') {
        propertyItem = this.data[propertyItem]
    }

    var typeTag = _.find(propertyItem.tags, function(tag) {
        return tag.type === 'type';
    });

    return typeTag ? typeTag.types : [];

};

module.exports = Doxer;