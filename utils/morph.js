var morphdom = require('morphdom');
var includes = require('./includes');

function onBeforeMorphEl(fromEl, toEl) {

    var includeId = toEl.dataset.includeId;
    var includeItem = includes[includeId];

    if (includeItem && fromEl.view) {

        if (fromEl.view.constructor === includeItem.constructor) {
            fromEl.view.render(includeItem.config);
            delete includeItem.list[includeId];
        }
        return false;
    }

    return true;
}

function onBeforeNodeDiscarded(node) {

    if (node.view) {
        node.view.remove();
    }

    return true;
}

module.exports = function(fromEl, toEl){

    if (!toEl){
        return fromEl;
    }

    return morphdom(fromEl, toEl, {
        onBeforeMorphEl: onBeforeMorphEl,
        onBeforeNodeDiscarded: onBeforeNodeDiscarded
    });
};
