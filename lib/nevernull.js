

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (scope) {
    if (scope['Proxy']) {
        return;
    }
    var lastRevokeFn = null;

    function isObject(o) {
        return o ? (typeof o === 'undefined' ? 'undefined' : _typeof(o)) == 'object' || typeof o == 'function' : false;
    }

    scope.Proxy = function (target, handler) {
        if (!isObject(target) || !isObject(handler)) {
            throw new TypeError('Cannot create proxy with a non-object as target or handler');
        }

        var throwRevoked = function throwRevoked() {};
        lastRevokeFn = function lastRevokeFn() {
            throwRevoked = function throwRevoked(trap) {
                throw new TypeError('Cannot perform \'' + trap + '\' on a proxy that has been revoked');
            };
        };

        var unsafeHandler = handler;
        handler = { 'get': null, 'set': null, 'apply': null, 'construct': null };
        for (var k in unsafeHandler) {
            if (!(k in handler)) {
                throw new TypeError('Proxy polyfill does not support trap \'' + k + '\'');
            }
            handler[k] = unsafeHandler[k];
        }
        if (typeof unsafeHandler == 'function') {
            handler.apply = unsafeHandler.apply.bind(unsafeHandler);
        }

        var proxy = this;
        var isMethod = false;
        var targetIsFunction = typeof target == 'function';
        if (handler.apply || handler['construct'] || targetIsFunction) {
            proxy = function Proxy() {
                var usingNew = this && this.constructor === proxy;
                throwRevoked(usingNew ? 'construct' : 'apply');

                if (usingNew && handler['construct']) {
                    return handler['construct'].call(this, target, arguments);
                } else if (!usingNew && handler.apply) {
                    return handler.apply(target, this, arguments);
                } else if (targetIsFunction) {
                    if (usingNew) {
                        var all = Array.prototype.slice.call(arguments);
                        all.unshift(target);
                        var f = target.bind.apply(target, all);
                        return new f();
                    }
                    return target.apply(this, arguments);
                }
                throw new TypeError(usingNew ? 'not a constructor' : 'not a function');
            };
            isMethod = true;
        }

        var getter = handler.get ? function (prop) {
            throwRevoked('get');
            return handler.get(this, prop, proxy);
        } : function (prop) {
            throwRevoked('get');
            return this[prop];
        };
        var setter = handler.set ? function (prop, value) {
            throwRevoked('set');
            var status = handler.set(this, prop, value, proxy);
            if (!status) {}
        } : function (prop, value) {
            throwRevoked('set');
            this[prop] = value;
        };

        var propertyNames = Object.getOwnPropertyNames(target);
        var propertyMap = {};
        propertyNames.forEach(function (prop) {
            if (isMethod && prop in proxy) {
                return;
            }
            var real = Object.getOwnPropertyDescriptor(target, prop);
            var desc = {
                enumerable: !!real.enumerable,
                get: getter.bind(target, prop),
                set: setter.bind(target, prop)
            };
            Object.defineProperty(proxy, prop, desc);
            propertyMap[prop] = true;
        });

        var prototypeOk = true;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(proxy, Object.getPrototypeOf(target));
        } else if (proxy.__proto__) {
            proxy.__proto__ = target.__proto__;
        } else {
            prototypeOk = false;
        }
        if (handler.get || !prototypeOk) {
            for (var _k in target) {
                if (propertyMap[_k]) {
                    continue;
                }
                Object.defineProperty(proxy, _k, { get: getter.bind(target, _k) });
            }
        }

        Object.seal(target);
        Object.seal(proxy);

        return proxy;
    };

    scope.Proxy.revocable = function (target, handler) {
        var p = new scope.Proxy(target, handler);
        return { 'proxy': p, 'revoke': lastRevokeFn };
    };

    scope.Proxy['revocable'] = scope.Proxy.revocable;
    scope['Proxy'] = scope.Proxy;
})(typeof process !== 'undefined' && {}.toString.call(process) == '[object process]' ? global : self);

var nn = function nn(rawValue) {
    var wrappedValue = function wrappedValue() {
        return rawValue;
    };

    return new Proxy(wrappedValue, {
        get: function get(target, name) {
            var rawTarget = target();
            var rawPropertyValue = rawTarget ? rawTarget[name] : undefined;

            if (typeof rawPropertyValue === 'function') {
                rawPropertyValue = rawPropertyValue.bind(rawTarget);
            }

            return nn(rawPropertyValue);
        }
    });
};
//# sourceMappingURL=nevernull.js.map