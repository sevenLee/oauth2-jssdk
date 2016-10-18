module.exports = {
    assign: function() {
        var target = {};

        for(var i = 0; i < arguments.length; i++){
            for(var p in arguments[i]) {
                if(arguments[i].hasOwnProperty(p)){
                    target[p] = arguments[i][p];
                }
            }
        }

        return target;
    },
    expects: function(obj, props) {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];

            if (obj[prop] == null) {
                throw new TypeError('Expected "' + prop + '" to exist')
            }
        }
    }
};