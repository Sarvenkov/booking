var eventBus = (function() {
    let callbacks = {};
    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };
    function subscribe(type, callback) {
        if (!callbacks[type]) {
            callbacks[type] = [];
        }
        callbacks[type].push(callback);
    }
    function unsubscribe(type, callback) {
        if (callbacks[type]) {
            for (var i = 0; i < callbacks[type].length; i++) {
                if (callbacks[type][i] === callback) {
                    callbacks[type].splice(i, 1);
                    break;
                }
            }
        }
    }
    function publish(type, payload) {
        if (!callbacks[type]) return false;

        callbacks[type].forEach(function(callback){
            callback(payload);
        })
    }
})();
