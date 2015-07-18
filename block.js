import _ from 'bower_components/lodash/lodash.js';
import $ from 'bower_components/jquery/dist/jquery.js';
import EventEmitter from 'bower_components/eventEmitter/EventEmitter.js';

function deepExtend(obj) {

    var cloneArray = function(arr) {
        return _.map(arr, function(item) {
            if (_.isPlainObject(item)) {
                return deepExtend({}, item);
            } else if (_.isArray(item)) {
                return cloneArray(item);
            } else {
                return item;
            }
        })
    };

    _.each([].slice.call(arguments, 1), function(source) {
        _.forOwn(source, function(value, key) {
            if (_.isPlainObject(value)) {
                obj[key] = deepExtend({}, obj[key], value);
            } else if (_.isArray(value)) {
                obj[key] = cloneArray(value);
            } else {
                obj[key] = value;
            }
        });
    });

    return obj;

}

function getChanges(newData, oldData) {

    var changes = {};

    if (newData === oldData) {
        return {};
    }

    if (!_.isPlainObject(newData)) {
        return newData;
    }

    _.forOwn(newData, function(value, key) {
        if (_.isPlainObject(value) && oldData[key]) {
            changes[key] = getChanges(value, oldData[key]);

            if (_.isEmpty(changes[key]) && !_.isEmpty(value)) {
                delete changes[key];
            }

        } else if (oldData[key] !== value) {
            changes[key] = value;
        }
    });

    return changes;
}

function triggerChanges(path, data){

    if (_.isPlainObject(data)) {
        _.forEach(data, (data, key) => {
            triggerChanges.call(this, path ? (path + '.' + key) : key, data);
        });
    }

    this.trigger(path ? ('change:' + path) : 'change', [data]);
}

function pathToObject(path, value) {
    var object = {},
        attr = object,
        segments = path.split('.');

    _.each(segments, function(segment, index) {
        if (index === segments.length - 1) {
            attr[segments[segments.length - 1]] = value;
        } else {
            attr[segment] = {};
        }
        attr = attr[segment];
    });

    return object;
}

export default class Block {

    constructor(opt) {
        deepExtend(this, opt);
    }

    get el() {
        return this.__el || document.createElement('div');
    }

    set el(element) {
        this.__el = $(element)[0];
    }

    get(path) {

        let attr = this,
            segments = path.split('.');

        _.every(segments, function(segment) {

            if (typeof attr[segment] === 'function') {
                attr = attr[segment].call(object);
            } else {
                attr = attr[segment];
            }

            return attr;
        });

        return attr;
    }

    set(path, data) {

        let changedData;

        if (typeof path === 'string') {
            data = pathToObject(path, data);
        } else {
            data = path;
        }

        changedData = getChanges(data, this);

        triggerChanges.call(this, null, changedData);

        deepExtend(this, changedData);

        return changedData;
    }
}

_.extend(Block.prototype, _.clone(EventEmitter.prototype));