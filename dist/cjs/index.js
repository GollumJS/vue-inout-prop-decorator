"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InOut = void 0;
var vue_class_component_1 = require("vue-class-component");
var vue_property_decorator_1 = require("vue-property-decorator");
var InOut = function (optionsInOut) {
    var callbackProp = (0, vue_property_decorator_1.Prop)(optionsInOut);
    var callbackInOut = (0, vue_class_component_1.createDecorator)(function (options, key) {
        var data = options['data'] ? options['data'] : function () { return {}; };
        var mounted = options['mounted'] ? options['mounted'] : function () { };
        options['data'] = function () {
            var _a;
            return __assign(__assign({}, data.apply(this)), (_a = {}, _a[key + '_inner'] = null, _a));
        };
        options['mounted'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = this;
            var descriptor = Object.getOwnPropertyDescriptor(this['_props'], key);
            var get = descriptor.get;
            var set = descriptor.set;
            this[key + '_inner'] = this[key];
            Object.defineProperty(this, key + '_original', {
                configurable: true,
                enumerable: true,
                get: function () {
                    return get;
                }
            });
            Object.defineProperty(this['_props'], key, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return self[key + '_inner'];
                },
                set: function (value) {
                    set.call(this, value);
                    self[key + '_inner'] = value;
                }
            });
            Object.defineProperty(this, key, {
                get: function () {
                    return this[key + '_inner'];
                },
                set: function (value) {
                    this[key + '_inner'] = value;
                    if (optionsInOut && optionsInOut.isVModel === true) {
                        this['$emit']('input', value);
                    }
                    else {
                        this['$emit']('update:' + key, value);
                    }
                    this.$forceUpdate();
                }
            });
            mounted.apply(this, args);
        };
    });
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        callbackProp.apply(null, args);
        callbackInOut.apply(null, args);
    };
};
exports.InOut = InOut;
//# sourceMappingURL=index.js.map