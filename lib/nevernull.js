"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (global) {
    "use strict";

    if (typeof WeakMap === "undefined") {
        global.WeakMap = function () {};
        global.WeakMap.prototype = {
            get: function get(k) {
                return undefined;
            },
            set: function set(k, v) {
                throw new Error("WeakMap not supported");
            }
        };
    }

    function isStandardAttribute(name) {
        return (/^(get|set|value|writable|enumerable|configurable)$/.test(name)
        );
    }

    function toPropertyDescriptor(obj) {
        if (Object(obj) !== obj) {
            throw new TypeError("property descriptor should be an Object, given: " + obj);
        }
        var desc = {};
        if ('enumerable' in obj) {
            desc.enumerable = !!obj.enumerable;
        }
        if ('configurable' in obj) {
            desc.configurable = !!obj.configurable;
        }
        if ('value' in obj) {
            desc.value = obj.value;
        }
        if ('writable' in obj) {
            desc.writable = !!obj.writable;
        }
        if ('get' in obj) {
            var getter = obj.get;
            if (getter !== undefined && typeof getter !== "function") {
                throw new TypeError("property descriptor 'get' attribute must be " + "callable or undefined, given: " + getter);
            }
            desc.get = getter;
        }
        if ('set' in obj) {
            var setter = obj.set;
            if (setter !== undefined && typeof setter !== "function") {
                throw new TypeError("property descriptor 'set' attribute must be " + "callable or undefined, given: " + setter);
            }
            desc.set = setter;
        }
        if ('get' in desc || 'set' in desc) {
            if ('value' in desc || 'writable' in desc) {
                throw new TypeError("property descriptor cannot be both a data and an " + "accessor descriptor: " + obj);
            }
        }
        return desc;
    }

    function isAccessorDescriptor(desc) {
        if (desc === undefined) return false;
        return 'get' in desc || 'set' in desc;
    }
    function isDataDescriptor(desc) {
        if (desc === undefined) return false;
        return 'value' in desc || 'writable' in desc;
    }
    function isGenericDescriptor(desc) {
        if (desc === undefined) return false;
        return !isAccessorDescriptor(desc) && !isDataDescriptor(desc);
    }

    function toCompletePropertyDescriptor(desc) {
        var internalDesc = toPropertyDescriptor(desc);
        if (isGenericDescriptor(internalDesc) || isDataDescriptor(internalDesc)) {
            if (!('value' in internalDesc)) {
                internalDesc.value = undefined;
            }
            if (!('writable' in internalDesc)) {
                internalDesc.writable = false;
            }
        } else {
            if (!('get' in internalDesc)) {
                internalDesc.get = undefined;
            }
            if (!('set' in internalDesc)) {
                internalDesc.set = undefined;
            }
        }
        if (!('enumerable' in internalDesc)) {
            internalDesc.enumerable = false;
        }
        if (!('configurable' in internalDesc)) {
            internalDesc.configurable = false;
        }
        return internalDesc;
    }

    function isEmptyDescriptor(desc) {
        return !('get' in desc) && !('set' in desc) && !('value' in desc) && !('writable' in desc) && !('enumerable' in desc) && !('configurable' in desc);
    }

    function isEquivalentDescriptor(desc1, desc2) {
        return sameValue(desc1.get, desc2.get) && sameValue(desc1.set, desc2.set) && sameValue(desc1.value, desc2.value) && sameValue(desc1.writable, desc2.writable) && sameValue(desc1.enumerable, desc2.enumerable) && sameValue(desc1.configurable, desc2.configurable);
    }

    function sameValue(x, y) {
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        }

        return x !== x && y !== y;
    }

    function normalizeAndCompletePropertyDescriptor(attributes) {
        if (attributes === undefined) {
            return undefined;
        }
        var desc = toCompletePropertyDescriptor(attributes);

        for (var name in attributes) {
            if (!isStandardAttribute(name)) {
                Object.defineProperty(desc, name, { value: attributes[name],
                    writable: true,
                    enumerable: true,
                    configurable: true });
            }
        }
        return desc;
    }

    function normalizePropertyDescriptor(attributes) {
        var desc = toPropertyDescriptor(attributes);

        for (var name in attributes) {
            if (!isStandardAttribute(name)) {
                Object.defineProperty(desc, name, { value: attributes[name],
                    writable: true,
                    enumerable: true,
                    configurable: true });
            }
        }
        return desc;
    }

    var prim_preventExtensions = Object.preventExtensions,
        prim_seal = Object.seal,
        prim_freeze = Object.freeze,
        prim_isExtensible = Object.isExtensible,
        prim_isSealed = Object.isSealed,
        prim_isFrozen = Object.isFrozen,
        prim_getPrototypeOf = Object.getPrototypeOf,
        prim_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
        prim_defineProperty = Object.defineProperty,
        prim_defineProperties = Object.defineProperties,
        prim_keys = Object.keys,
        prim_getOwnPropertyNames = Object.getOwnPropertyNames,
        prim_getOwnPropertySymbols = Object.getOwnPropertySymbols,
        prim_assign = Object.assign,
        prim_isArray = Array.isArray,
        prim_concat = Array.prototype.concat,
        prim_isPrototypeOf = Object.prototype.isPrototypeOf,
        prim_hasOwnProperty = Object.prototype.hasOwnProperty;

    var Object_isFrozen, Object_isSealed, Object_isExtensible, Object_getPrototypeOf, Object_getOwnPropertyNames;

    function isFixed(name, target) {
        return {}.hasOwnProperty.call(target, name);
    }
    function isSealed(name, target) {
        var desc = Object.getOwnPropertyDescriptor(target, name);
        if (desc === undefined) {
            return false;
        }
        return desc.configurable === false;
    }
    function isSealedDesc(desc) {
        return desc !== undefined && desc.configurable === false;
    }

    function isCompatibleDescriptor(extensible, current, desc) {
        if (current === undefined && extensible === false) {
            return false;
        }
        if (current === undefined && extensible === true) {
            return true;
        }
        if (isEmptyDescriptor(desc)) {
            return true;
        }
        if (isEquivalentDescriptor(current, desc)) {
            return true;
        }
        if (current.configurable === false) {
            if (desc.configurable === true) {
                return false;
            }
            if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
                return false;
            }
        }
        if (isGenericDescriptor(desc)) {
            return true;
        }
        if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
            if (current.configurable === false) {
                return false;
            }
            return true;
        }
        if (isDataDescriptor(current) && isDataDescriptor(desc)) {
            if (current.configurable === false) {
                if (current.writable === false && desc.writable === true) {
                    return false;
                }
                if (current.writable === false) {
                    if ('value' in desc && !sameValue(desc.value, current.value)) {
                        return false;
                    }
                }
            }
            return true;
        }
        if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
            if (current.configurable === false) {
                if ('set' in desc && !sameValue(desc.set, current.set)) {
                    return false;
                }
                if ('get' in desc && !sameValue(desc.get, current.get)) {
                    return false;
                }
            }
        }
        return true;
    }

    function setIntegrityLevel(target, level) {
        var ownProps = Object_getOwnPropertyNames(target);
        var pendingException = undefined;
        if (level === "sealed") {
            var l = +ownProps.length;
            var k;
            for (var i = 0; i < l; i++) {
                k = String(ownProps[i]);
                try {
                    Object.defineProperty(target, k, { configurable: false });
                } catch (e) {
                    if (pendingException === undefined) {
                        pendingException = e;
                    }
                }
            }
        } else {
            var l = +ownProps.length;
            var k;
            for (var i = 0; i < l; i++) {
                k = String(ownProps[i]);
                try {
                    var currentDesc = Object.getOwnPropertyDescriptor(target, k);
                    if (currentDesc !== undefined) {
                        var desc;
                        if (isAccessorDescriptor(currentDesc)) {
                            desc = { configurable: false };
                        } else {
                            desc = { configurable: false, writable: false };
                        }
                        Object.defineProperty(target, k, desc);
                    }
                } catch (e) {
                    if (pendingException === undefined) {
                        pendingException = e;
                    }
                }
            }
        }
        if (pendingException !== undefined) {
            throw pendingException;
        }
        return Reflect.preventExtensions(target);
    }

    function testIntegrityLevel(target, level) {
        var isExtensible = Object_isExtensible(target);
        if (isExtensible) return false;

        var ownProps = Object_getOwnPropertyNames(target);
        var pendingException = undefined;
        var configurable = false;
        var writable = false;

        var l = +ownProps.length;
        var k;
        var currentDesc;
        for (var i = 0; i < l; i++) {
            k = String(ownProps[i]);
            try {
                currentDesc = Object.getOwnPropertyDescriptor(target, k);
                configurable = configurable || currentDesc.configurable;
                if (isDataDescriptor(currentDesc)) {
                    writable = writable || currentDesc.writable;
                }
            } catch (e) {
                if (pendingException === undefined) {
                    pendingException = e;
                    configurable = true;
                }
            }
        }
        if (pendingException !== undefined) {
            throw pendingException;
        }
        if (level === "frozen" && writable === true) {
            return false;
        }
        if (configurable === true) {
            return false;
        }
        return true;
    }

    function Validator(target, handler) {
        this.target = target;
        this.handler = handler;
    }

    Validator.prototype = {
        getTrap: function getTrap(trapName) {
            var trap = this.handler[trapName];
            if (trap === undefined) {
                return undefined;
            }

            if (typeof trap !== "function") {
                throw new TypeError(trapName + " trap is not callable: " + trap);
            }

            return trap;
        },

        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(name) {
            "use strict";

            var trap = this.getTrap("getOwnPropertyDescriptor");
            if (trap === undefined) {
                return Reflect.getOwnPropertyDescriptor(this.target, name);
            }

            name = String(name);
            var desc = trap.call(this.handler, this.target, name);
            desc = normalizeAndCompletePropertyDescriptor(desc);

            var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
            var extensible = Object.isExtensible(this.target);

            if (desc === undefined) {
                if (isSealedDesc(targetDesc)) {
                    throw new TypeError("cannot report non-configurable property '" + name + "' as non-existent");
                }
                if (!extensible && targetDesc !== undefined) {
                    throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
                }
                return undefined;
            }

            if (!extensible) {
                if (targetDesc === undefined) {
                    throw new TypeError("cannot report a new own property '" + name + "' on a non-extensible object");
                }
            }

            if (name !== undefined) {
                if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
                    throw new TypeError("cannot report incompatible property descriptor " + "for property '" + name + "'");
                }
            }

            if (desc.configurable === false) {
                if (targetDesc === undefined || targetDesc.configurable === true) {
                    throw new TypeError("cannot report a non-configurable descriptor " + "for configurable or non-existent property '" + name + "'");
                }
                if ('writable' in desc && desc.writable === false) {
                    if (targetDesc.writable === true) {
                        throw new TypeError("cannot report non-configurable, writable property '" + name + "' as non-configurable, non-writable");
                    }
                }
            }

            return desc;
        },

        getPropertyDescriptor: function getPropertyDescriptor(name) {
            var handler = this;

            if (!handler.has(name)) return undefined;

            return {
                get: function get() {
                    return handler.get(this, name);
                },
                set: function set(val) {
                    if (handler.set(this, name, val)) {
                        return val;
                    } else {
                        throw new TypeError("failed assignment to " + name);
                    }
                },
                enumerable: true,
                configurable: true
            };
        },

        defineProperty: function defineProperty(name, desc) {

            var trap = this.getTrap("defineProperty");
            if (trap === undefined) {
                return Reflect.defineProperty(this.target, name, desc);
            }

            name = String(name);
            var descObj = normalizePropertyDescriptor(desc);
            var success = trap.call(this.handler, this.target, name, descObj);
            success = !!success;

            if (success === true) {

                var targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
                var extensible = Object.isExtensible(this.target);

                if (!extensible) {
                    if (targetDesc === undefined) {
                        throw new TypeError("cannot successfully add a new property '" + name + "' to a non-extensible object");
                    }
                }

                if (targetDesc !== undefined) {
                    if (!isCompatibleDescriptor(extensible, targetDesc, desc)) {
                        throw new TypeError("cannot define incompatible property " + "descriptor for property '" + name + "'");
                    }
                    if (isDataDescriptor(targetDesc) && targetDesc.configurable === false && targetDesc.writable === true) {
                        if (desc.configurable === false && desc.writable === false) {
                            throw new TypeError("cannot successfully define non-configurable, writable " + " property '" + name + "' as non-configurable, non-writable");
                        }
                    }
                }

                if (desc.configurable === false && !isSealedDesc(targetDesc)) {
                    throw new TypeError("cannot successfully define a non-configurable " + "descriptor for configurable or non-existent property '" + name + "'");
                }
            }

            return success;
        },

        preventExtensions: function preventExtensions() {
            var trap = this.getTrap("preventExtensions");
            if (trap === undefined) {
                return Reflect.preventExtensions(this.target);
            }

            var success = trap.call(this.handler, this.target);
            success = !!success;
            if (success) {
                if (Object_isExtensible(this.target)) {
                    throw new TypeError("can't report extensible object as non-extensible: " + this.target);
                }
            }
            return success;
        },

        delete: function _delete(name) {
            "use strict";

            var trap = this.getTrap("deleteProperty");
            if (trap === undefined) {
                return Reflect.deleteProperty(this.target, name);
            }

            name = String(name);
            var res = trap.call(this.handler, this.target, name);
            res = !!res;

            var targetDesc;
            if (res === true) {
                targetDesc = Object.getOwnPropertyDescriptor(this.target, name);
                if (targetDesc !== undefined && targetDesc.configurable === false) {
                    throw new TypeError("property '" + name + "' is non-configurable " + "and can't be deleted");
                }
                if (targetDesc !== undefined && !Object_isExtensible(this.target)) {
                    throw new TypeError("cannot successfully delete existing property '" + name + "' on a non-extensible object");
                }
            }

            return res;
        },

        getOwnPropertyNames: function getOwnPropertyNames() {
            return this.ownKeys();
        },

        ownKeys: function ownKeys() {
            var trap = this.getTrap("ownKeys");
            if (trap === undefined) {
                return Reflect.ownKeys(this.target);
            }

            var trapResult = trap.call(this.handler, this.target);

            var propNames = Object.create(null);
            var numProps = +trapResult.length;
            var result = new Array(numProps);

            for (var i = 0; i < numProps; i++) {
                var s = String(trapResult[i]);
                if (!Object.isExtensible(this.target) && !isFixed(s, this.target)) {
                    throw new TypeError("ownKeys trap cannot list a new " + "property '" + s + "' on a non-extensible object");
                }

                propNames[s] = true;
                result[i] = s;
            }

            var ownProps = Object_getOwnPropertyNames(this.target);
            var target = this.target;
            ownProps.forEach(function (ownProp) {
                if (!propNames[ownProp]) {
                    if (isSealed(ownProp, target)) {
                        throw new TypeError("ownKeys trap failed to include " + "non-configurable property '" + ownProp + "'");
                    }
                    if (!Object.isExtensible(target) && isFixed(ownProp, target)) {
                        throw new TypeError("ownKeys trap cannot report existing own property '" + ownProp + "' as non-existent on a non-extensible object");
                    }
                }
            });

            return result;
        },

        isExtensible: function isExtensible() {
            var trap = this.getTrap("isExtensible");
            if (trap === undefined) {
                return Reflect.isExtensible(this.target);
            }

            var result = trap.call(this.handler, this.target);
            result = !!result;
            var state = Object_isExtensible(this.target);
            if (result !== state) {
                if (result) {
                    throw new TypeError("cannot report non-extensible object as extensible: " + this.target);
                } else {
                    throw new TypeError("cannot report extensible object as non-extensible: " + this.target);
                }
            }
            return state;
        },

        getPrototypeOf: function getPrototypeOf() {
            var trap = this.getTrap("getPrototypeOf");
            if (trap === undefined) {
                return Reflect.getPrototypeOf(this.target);
            }

            var allegedProto = trap.call(this.handler, this.target);

            if (!Object_isExtensible(this.target)) {
                var actualProto = Object_getPrototypeOf(this.target);
                if (!sameValue(allegedProto, actualProto)) {
                    throw new TypeError("prototype value does not match: " + this.target);
                }
            }

            return allegedProto;
        },

        setPrototypeOf: function setPrototypeOf(newProto) {
            var trap = this.getTrap("setPrototypeOf");
            if (trap === undefined) {
                return Reflect.setPrototypeOf(this.target, newProto);
            }

            var success = trap.call(this.handler, this.target, newProto);

            success = !!success;
            if (success && !Object_isExtensible(this.target)) {
                var actualProto = Object_getPrototypeOf(this.target);
                if (!sameValue(newProto, actualProto)) {
                    throw new TypeError("prototype value does not match: " + this.target);
                }
            }

            return success;
        },

        getPropertyNames: function getPropertyNames() {
            throw new TypeError("getPropertyNames trap is deprecated");
        },

        has: function has(name) {
            var trap = this.getTrap("has");
            if (trap === undefined) {
                return Reflect.has(this.target, name);
            }

            name = String(name);
            var res = trap.call(this.handler, this.target, name);
            res = !!res;

            if (res === false) {
                if (isSealed(name, this.target)) {
                    throw new TypeError("cannot report existing non-configurable own " + "property '" + name + "' as a non-existent " + "property");
                }
                if (!Object.isExtensible(this.target) && isFixed(name, this.target)) {
                    throw new TypeError("cannot report existing own property '" + name + "' as non-existent on a non-extensible object");
                }
            }

            return res;
        },

        get: function get(receiver, name) {

            var trap = this.getTrap("get");
            if (trap === undefined) {
                return Reflect.get(this.target, name, receiver);
            }

            name = String(name);
            var res = trap.call(this.handler, this.target, name, receiver);

            var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);

            if (fixedDesc !== undefined) {
                if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
                    if (!sameValue(res, fixedDesc.value)) {
                        throw new TypeError("cannot report inconsistent value for " + "non-writable, non-configurable property '" + name + "'");
                    }
                } else {
                    if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.get === undefined) {
                        if (res !== undefined) {
                            throw new TypeError("must report undefined for non-configurable " + "accessor property '" + name + "' without getter");
                        }
                    }
                }
            }

            return res;
        },

        set: function set(receiver, name, val) {
            var trap = this.getTrap("set");
            if (trap === undefined) {
                return Reflect.set(this.target, name, val, receiver);
            }

            name = String(name);
            var res = trap.call(this.handler, this.target, name, val, receiver);
            res = !!res;
            if (res === true) {
                var fixedDesc = Object.getOwnPropertyDescriptor(this.target, name);
                if (fixedDesc !== undefined) {
                    if (isDataDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.writable === false) {
                        if (!sameValue(val, fixedDesc.value)) {
                            throw new TypeError("cannot successfully assign to a " + "non-writable, non-configurable property '" + name + "'");
                        }
                    } else {
                        if (isAccessorDescriptor(fixedDesc) && fixedDesc.configurable === false && fixedDesc.set === undefined) {
                            throw new TypeError("setting a property '" + name + "' that has " + " only a getter");
                        }
                    }
                }
            }

            return res;
        },

        enumerate: function enumerate() {
            var trap = this.getTrap("enumerate");
            if (trap === undefined) {
                var trapResult = Reflect.enumerate(this.target);
                var result = [];
                var nxt = trapResult.next();
                while (!nxt.done) {
                    result.push(String(nxt.value));
                    nxt = trapResult.next();
                }
                return result;
            }

            var trapResult = trap.call(this.handler, this.target);

            if (trapResult === null || trapResult === undefined || trapResult.next === undefined) {
                throw new TypeError("enumerate trap should return an iterator, got: " + trapResult);
            }

            var propNames = Object.create(null);

            var result = [];
            var nxt = trapResult.next();

            while (!nxt.done) {
                var s = String(nxt.value);
                if (propNames[s]) {
                    throw new TypeError("enumerate trap cannot list a " + "duplicate property '" + s + "'");
                }
                propNames[s] = true;
                result.push(s);
                nxt = trapResult.next();
            }

            var ownEnumerableProps = Object.keys(this.target);
            var target = this.target;
            ownEnumerableProps.forEach(function (ownEnumerableProp) {
                if (!propNames[ownEnumerableProp]) {
                    if (isSealed(ownEnumerableProp, target)) {
                        throw new TypeError("enumerate trap failed to include " + "non-configurable enumerable property '" + ownEnumerableProp + "'");
                    }
                    if (!Object.isExtensible(target) && isFixed(ownEnumerableProp, target)) {
                        throw new TypeError("cannot report existing own property '" + ownEnumerableProp + "' as non-existent on a " + "non-extensible object");
                    }
                }
            });

            return result;
        },

        iterate: Validator.prototype.enumerate,

        apply: function apply(target, thisBinding, args) {
            var trap = this.getTrap("apply");
            if (trap === undefined) {
                return Reflect.apply(target, thisBinding, args);
            }

            if (typeof this.target === "function") {
                return trap.call(this.handler, target, thisBinding, args);
            } else {
                throw new TypeError("apply: " + target + " is not a function");
            }
        },

        construct: function construct(target, args, newTarget) {
            var trap = this.getTrap("construct");
            if (trap === undefined) {
                return Reflect.construct(target, args, newTarget);
            }

            if (typeof target !== "function") {
                throw new TypeError("new: " + target + " is not a function");
            }

            if (newTarget === undefined) {
                newTarget = target;
            } else {
                if (typeof newTarget !== "function") {
                    throw new TypeError("new: " + newTarget + " is not a function");
                }
            }
            return trap.call(this.handler, target, args, newTarget);
        }
    };

    var directProxies = new WeakMap();

    Object.preventExtensions = function (subject) {
        var vhandler = directProxies.get(subject);
        if (vhandler !== undefined) {
            if (vhandler.preventExtensions()) {
                return subject;
            } else {
                throw new TypeError("preventExtensions on " + subject + " rejected");
            }
        } else {
            return prim_preventExtensions(subject);
        }
    };
    Object.seal = function (subject) {
        setIntegrityLevel(subject, "sealed");
        return subject;
    };
    Object.freeze = function (subject) {
        setIntegrityLevel(subject, "frozen");
        return subject;
    };
    Object.isExtensible = Object_isExtensible = function Object_isExtensible(subject) {
        var vHandler = directProxies.get(subject);
        if (vHandler !== undefined) {
            return vHandler.isExtensible();
        } else {
            return prim_isExtensible(subject);
        }
    };
    Object.isSealed = Object_isSealed = function Object_isSealed(subject) {
        return testIntegrityLevel(subject, "sealed");
    };
    Object.isFrozen = Object_isFrozen = function Object_isFrozen(subject) {
        return testIntegrityLevel(subject, "frozen");
    };
    Object.getPrototypeOf = Object_getPrototypeOf = function Object_getPrototypeOf(subject) {
        var vHandler = directProxies.get(subject);
        if (vHandler !== undefined) {
            return vHandler.getPrototypeOf();
        } else {
            return prim_getPrototypeOf(subject);
        }
    };

    Object.getOwnPropertyDescriptor = function (subject, name) {
        var vhandler = directProxies.get(subject);
        if (vhandler !== undefined) {
            return vhandler.getOwnPropertyDescriptor(name);
        } else {
            return prim_getOwnPropertyDescriptor(subject, name);
        }
    };

    Object.defineProperty = function (subject, name, desc) {
        var vhandler = directProxies.get(subject);
        if (vhandler !== undefined) {
            var normalizedDesc = normalizePropertyDescriptor(desc);
            var success = vhandler.defineProperty(name, normalizedDesc);
            if (success === false) {
                throw new TypeError("can't redefine property '" + name + "'");
            }
            return subject;
        } else {
            return prim_defineProperty(subject, name, desc);
        }
    };

    Object.defineProperties = function (subject, descs) {
        var vhandler = directProxies.get(subject);
        if (vhandler !== undefined) {
            var names = Object.keys(descs);
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                var normalizedDesc = normalizePropertyDescriptor(descs[name]);
                var success = vhandler.defineProperty(name, normalizedDesc);
                if (success === false) {
                    throw new TypeError("can't redefine property '" + name + "'");
                }
            }
            return subject;
        } else {
            return prim_defineProperties(subject, descs);
        }
    };

    Object.keys = function (subject) {
        var vHandler = directProxies.get(subject);
        if (vHandler !== undefined) {
            var ownKeys = vHandler.ownKeys();
            var result = [];
            for (var i = 0; i < ownKeys.length; i++) {
                var k = String(ownKeys[i]);
                var desc = Object.getOwnPropertyDescriptor(subject, k);
                if (desc !== undefined && desc.enumerable === true) {
                    result.push(k);
                }
            }
            return result;
        } else {
            return prim_keys(subject);
        }
    };

    Object.getOwnPropertyNames = Object_getOwnPropertyNames = function Object_getOwnPropertyNames(subject) {
        var vHandler = directProxies.get(subject);
        if (vHandler !== undefined) {
            return vHandler.ownKeys();
        } else {
            return prim_getOwnPropertyNames(subject);
        }
    };

    if (prim_getOwnPropertySymbols !== undefined) {
        Object.getOwnPropertySymbols = function (subject) {
            var vHandler = directProxies.get(subject);
            if (vHandler !== undefined) {
                return [];
            } else {
                return prim_getOwnPropertySymbols(subject);
            }
        };
    }

    if (prim_assign !== undefined) {
        Object.assign = function (target) {
            var noProxies = true;
            for (var i = 0; i < arguments.length; i++) {
                var vHandler = directProxies.get(arguments[i]);
                if (vHandler !== undefined) {
                    noProxies = false;
                    break;
                }
            }
            if (noProxies) {
                return prim_assign.apply(Object, arguments);
            }

            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    }

    function isObject(arg) {
        var type = typeof arg === "undefined" ? "undefined" : _typeof(arg);
        return type === 'object' && arg !== null || type === 'function';
    };

    function safeWeakMapGet(map, key) {
        return isObject(key) ? map.get(key) : undefined;
    };

    function makeUnwrapping0ArgMethod(primitive) {
        return function builtin() {
            var vHandler = safeWeakMapGet(directProxies, this);
            if (vHandler !== undefined) {
                return builtin.call(vHandler.target);
            } else {
                return primitive.call(this);
            }
        };
    };

    function makeUnwrapping1ArgMethod(primitive) {
        return function builtin(arg) {
            var vHandler = safeWeakMapGet(directProxies, this);
            if (vHandler !== undefined) {
                return builtin.call(vHandler.target, arg);
            } else {
                return primitive.call(this, arg);
            }
        };
    };

    Object.prototype.valueOf = makeUnwrapping0ArgMethod(Object.prototype.valueOf);
    Object.prototype.toString = makeUnwrapping0ArgMethod(Object.prototype.toString);
    Function.prototype.toString = makeUnwrapping0ArgMethod(Function.prototype.toString);
    Date.prototype.toString = makeUnwrapping0ArgMethod(Date.prototype.toString);

    Object.prototype.isPrototypeOf = function builtin(arg) {
        while (true) {
            var vHandler2 = safeWeakMapGet(directProxies, arg);
            if (vHandler2 !== undefined) {
                arg = vHandler2.getPrototypeOf();
                if (arg === null) {
                    return false;
                } else if (sameValue(arg, this)) {
                    return true;
                }
            } else {
                return prim_isPrototypeOf.call(this, arg);
            }
        }
    };

    Array.isArray = function (subject) {
        var vHandler = safeWeakMapGet(directProxies, subject);
        if (vHandler !== undefined) {
            return Array.isArray(vHandler.target);
        } else {
            return prim_isArray(subject);
        }
    };

    function isProxyArray(arg) {
        var vHandler = safeWeakMapGet(directProxies, arg);
        if (vHandler !== undefined) {
            return Array.isArray(vHandler.target);
        }
        return false;
    }

    Array.prototype.concat = function () {
        var length;
        for (var i = 0; i < arguments.length; i++) {
            if (isProxyArray(arguments[i])) {
                length = arguments[i].length;
                arguments[i] = Array.prototype.slice.call(arguments[i], 0, length);
            }
        }
        return prim_concat.apply(this, arguments);
    };

    var prim_setPrototypeOf = Object.setPrototypeOf;

    var __proto__setter = function () {
        var protoDesc = prim_getOwnPropertyDescriptor(Object.prototype, '__proto__');
        if (protoDesc === undefined || typeof protoDesc.set !== "function") {
            return function () {
                throw new TypeError("setPrototypeOf not supported on this platform");
            };
        }

        try {
            protoDesc.set.call({}, {});
        } catch (e) {
            return function () {
                throw new TypeError("setPrototypeOf not supported on this platform");
            };
        }

        prim_defineProperty(Object.prototype, '__proto__', {
            set: function set(newProto) {
                return Object.setPrototypeOf(this, Object(newProto));
            }
        });

        return protoDesc.set;
    }();

    Object.setPrototypeOf = function (target, newProto) {
        var handler = directProxies.get(target);
        if (handler !== undefined) {
            if (handler.setPrototypeOf(newProto)) {
                return target;
            } else {
                throw new TypeError("proxy rejected prototype mutation");
            }
        } else {
            if (!Object_isExtensible(target)) {
                throw new TypeError("can't set prototype on non-extensible object: " + target);
            }
            if (prim_setPrototypeOf) return prim_setPrototypeOf(target, newProto);

            if (Object(newProto) !== newProto || newProto === null) {
                throw new TypeError("Object prototype may only be an Object or null: " + newProto);
            }
            __proto__setter.call(target, newProto);
            return target;
        }
    };

    Object.prototype.hasOwnProperty = function (name) {
        var handler = safeWeakMapGet(directProxies, this);
        if (handler !== undefined) {
            var desc = handler.getOwnPropertyDescriptor(name);
            return desc !== undefined;
        } else {
            return prim_hasOwnProperty.call(this, name);
        }
    };

    var Reflect = global.Reflect = {
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, name) {
            return Object.getOwnPropertyDescriptor(target, name);
        },
        defineProperty: function defineProperty(target, name, desc) {
            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.defineProperty(target, name, desc);
            }

            var current = Object.getOwnPropertyDescriptor(target, name);
            var extensible = Object.isExtensible(target);
            if (current === undefined && extensible === false) {
                return false;
            }
            if (current === undefined && extensible === true) {
                Object.defineProperty(target, name, desc);
                return true;
            }
            if (isEmptyDescriptor(desc)) {
                return true;
            }
            if (isEquivalentDescriptor(current, desc)) {
                return true;
            }
            if (current.configurable === false) {
                if (desc.configurable === true) {
                    return false;
                }
                if ('enumerable' in desc && desc.enumerable !== current.enumerable) {
                    return false;
                }
            }
            if (isGenericDescriptor(desc)) {} else if (isDataDescriptor(current) !== isDataDescriptor(desc)) {
                if (current.configurable === false) {
                    return false;
                }
            } else if (isDataDescriptor(current) && isDataDescriptor(desc)) {
                if (current.configurable === false) {
                    if (current.writable === false && desc.writable === true) {
                        return false;
                    }
                    if (current.writable === false) {
                        if ('value' in desc && !sameValue(desc.value, current.value)) {
                            return false;
                        }
                    }
                }
            } else if (isAccessorDescriptor(current) && isAccessorDescriptor(desc)) {
                if (current.configurable === false) {
                    if ('set' in desc && !sameValue(desc.set, current.set)) {
                        return false;
                    }
                    if ('get' in desc && !sameValue(desc.get, current.get)) {
                        return false;
                    }
                }
            }
            Object.defineProperty(target, name, desc);
            return true;
        },
        deleteProperty: function deleteProperty(target, name) {
            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.delete(name);
            }

            var desc = Object.getOwnPropertyDescriptor(target, name);
            if (desc === undefined) {
                return true;
            }
            if (desc.configurable === true) {
                delete target[name];
                return true;
            }
            return false;
        },
        getPrototypeOf: function getPrototypeOf(target) {
            return Object.getPrototypeOf(target);
        },
        setPrototypeOf: function setPrototypeOf(target, newProto) {

            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.setPrototypeOf(newProto);
            }

            if (Object(newProto) !== newProto || newProto === null) {
                throw new TypeError("Object prototype may only be an Object or null: " + newProto);
            }

            if (!Object_isExtensible(target)) {
                return false;
            }

            var current = Object.getPrototypeOf(target);
            if (sameValue(current, newProto)) {
                return true;
            }

            if (prim_setPrototypeOf) {
                try {
                    prim_setPrototypeOf(target, newProto);
                    return true;
                } catch (e) {
                    return false;
                }
            }

            __proto__setter.call(target, newProto);
            return true;
        },
        preventExtensions: function preventExtensions(target) {
            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.preventExtensions();
            }
            prim_preventExtensions(target);
            return true;
        },
        isExtensible: function isExtensible(target) {
            return Object.isExtensible(target);
        },
        has: function has(target, name) {
            return name in target;
        },
        get: function get(target, name, receiver) {
            receiver = receiver || target;

            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.get(receiver, name);
            }

            var desc = Object.getOwnPropertyDescriptor(target, name);
            if (desc === undefined) {
                var proto = Object.getPrototypeOf(target);
                if (proto === null) {
                    return undefined;
                }
                return Reflect.get(proto, name, receiver);
            }
            if (isDataDescriptor(desc)) {
                return desc.value;
            }
            var getter = desc.get;
            if (getter === undefined) {
                return undefined;
            }
            return desc.get.call(receiver);
        },

        set: function set(target, name, value, receiver) {
            receiver = receiver || target;

            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.set(receiver, name, value);
            }

            var ownDesc = Object.getOwnPropertyDescriptor(target, name);

            if (ownDesc === undefined) {
                var proto = Object.getPrototypeOf(target);

                if (proto !== null) {
                    return Reflect.set(proto, name, value, receiver);
                }

                ownDesc = { value: undefined,
                    writable: true,
                    enumerable: true,
                    configurable: true };
            }

            if (isAccessorDescriptor(ownDesc)) {
                var setter = ownDesc.set;
                if (setter === undefined) return false;
                setter.call(receiver, value);
                return true;
            }

            if (ownDesc.writable === false) return false;

            var existingDesc = Object.getOwnPropertyDescriptor(receiver, name);
            if (existingDesc !== undefined) {
                var updateDesc = { value: value,

                    writable: existingDesc.writable,
                    enumerable: existingDesc.enumerable,
                    configurable: existingDesc.configurable };
                Object.defineProperty(receiver, name, updateDesc);
                return true;
            } else {
                if (!Object.isExtensible(receiver)) return false;
                var newDesc = { value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true };
                Object.defineProperty(receiver, name, newDesc);
                return true;
            }
        },

        enumerate: function enumerate(target) {
            var handler = directProxies.get(target);
            var result;
            if (handler !== undefined) {
                result = handler.enumerate(handler.target);
            } else {
                result = [];
                for (var name in target) {
                    result.push(name);
                };
            }
            var l = +result.length;
            var idx = 0;
            return {
                next: function next() {
                    if (idx === l) return { done: true };
                    return { done: false, value: result[idx++] };
                }
            };
        },

        ownKeys: function ownKeys(target) {
            return Object_getOwnPropertyNames(target);
        },
        apply: function apply(target, receiver, args) {
            return Function.prototype.apply.call(target, receiver, args);
        },
        construct: function construct(target, args, newTarget) {
            var handler = directProxies.get(target);
            if (handler !== undefined) {
                return handler.construct(handler.target, args, newTarget);
            }

            if (typeof target !== "function") {
                throw new TypeError("target is not a function: " + target);
            }
            if (newTarget === undefined) {
                newTarget = target;
            } else {
                if (typeof newTarget !== "function") {
                    throw new TypeError("newTarget is not a function: " + target);
                }
            }

            return new (Function.prototype.bind.apply(newTarget, [null].concat(args)))();
        }
    };

    if (typeof Proxy !== "undefined" && typeof Proxy.create !== "undefined") {

        var primCreate = Proxy.create,
            primCreateFunction = Proxy.createFunction;

        var revokedHandler = primCreate({
            get: function get() {
                throw new TypeError("proxy is revoked");
            }
        });

        global.Proxy = function (target, handler) {
            if (Object(target) !== target) {
                throw new TypeError("Proxy target must be an Object, given " + target);
            }

            if (Object(handler) !== handler) {
                throw new TypeError("Proxy handler must be an Object, given " + handler);
            }

            var vHandler = new Validator(target, handler);
            var proxy;
            if (typeof target === "function") {
                proxy = primCreateFunction(vHandler, function () {
                    var args = Array.prototype.slice.call(arguments);
                    return vHandler.apply(target, this, args);
                }, function () {
                    var args = Array.prototype.slice.call(arguments);
                    return vHandler.construct(target, args);
                });
            } else {
                proxy = primCreate(vHandler, Object.getPrototypeOf(target));
            }
            directProxies.set(proxy, vHandler);
            return proxy;
        };

        global.Proxy.revocable = function (target, handler) {
            var proxy = new Proxy(target, handler);
            var revoke = function revoke() {
                var vHandler = directProxies.get(proxy);
                if (vHandler !== null) {
                    vHandler.target = null;
                    vHandler.handler = revokedHandler;
                }
                return undefined;
            };
            return { proxy: proxy, revoke: revoke };
        };

        global.Proxy.create = primCreate;
        global.Proxy.createFunction = primCreateFunction;
    } else {
        if (typeof Proxy === "undefined") {
            global.Proxy = function (_target, _handler) {
                throw new Error("proxies not supported on this platform. On v8/node/iojs, make sure to pass the --harmony_proxies flag");
            };
        }
    }

    if (typeof exports !== 'undefined') {
        Object.keys(Reflect).forEach(function (key) {
            exports[key] = Reflect[key];
        });
    }
})(window);

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