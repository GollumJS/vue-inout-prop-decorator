"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_class_component_1 = require("vue-class-component");
var vue_property_decorator_1 = require("vue-property-decorator");
exports.InOut = function (optionsProp) {
    var callbackProp = vue_property_decorator_1.Prop(optionsProp);
    var callbackInOut = vue_class_component_1.createDecorator(function (options, key) {
        var mounted = options['mounted'] ? options['mounted'] : function () { };
        options['mounted'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var self = this;
            var descriptor = Object.getOwnPropertyDescriptor(this['_props'], key);
            var get = descriptor.get;
            var set = descriptor.set;
            Object.defineProperty(this['_props'], key, {
                configurable: true,
                enumerable: true,
                get: get,
                set: function (value) {
                    set.call(this, value);
                    self['$data'][key + '_value'] = value;
                }
            });
            this['$data'][key + '_value'] = this[key];
            Object.defineProperty(this, key, {
                get: function () {
                    return this['$data'][key + '_value'];
                },
                set: function (value) {
                    this['$data'][key + '_value'] = value;
                    this['$emit']('update:' + key, value);
                    this['$forceUpdate']();
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
//# sourceMappingURL=index.js.map