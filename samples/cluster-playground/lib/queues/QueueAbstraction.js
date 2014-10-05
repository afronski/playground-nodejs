function QueueAbstractionConstructor() {
    this._queue = [];
}

function removeByPredicate(predicate) {
    var foundElement = this._queue.filter(predicate)[0],
        indexForDelete;

    if (foundElement) {
        indexForDelete = this._queue.indexOf(foundElement);

        if (indexForDelete !== -1) {
            return this._queue.splice(indexForDelete, 1)[0];
        }
    }

    return null;
}

QueueAbstractionConstructor.prototype._wrap = function(workerId, linkName) {
    return {
        id : workerId,
        link : linkName
    };
};

QueueAbstractionConstructor.prototype.add = function(workerId, linkName) {
    this._queue.push(this._wrap(workerId, linkName));
};

QueueAbstractionConstructor.prototype.remove = function(workerId) {
    return removeByPredicate.call(this, function(el) { return el.id === workerId; });
};

QueueAbstractionConstructor.prototype.removeByLink = function(link) {
    return removeByPredicate.call(this, function(el) { return el.link === link; });
};

QueueAbstractionConstructor.prototype.peek = function() {
    if (this._queue.length > 0) {
        return this._queue[0];
    } else {
        return null;
    }
};

QueueAbstractionConstructor.prototype.pop = function() {
    if (this._queue.length > 0) {
        return this._queue.shift();
    } else {
        return null;
    }
};

exports.QueueAbstraction = QueueAbstractionConstructor;