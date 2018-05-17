"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_class_component_1 = require("vue-class-component");
var vue_property_decorator_1 = require("vue-property-decorator");
var recursiveForceUpdate = function (vm) {
    vm.$forceUpdate();
    vm.$children.forEach(function (c) { return recursiveForceUpdate(c); });
};
var callWatch = function (component, expression, value) {
    if (component.hasOwnProperty('_watchers')) {
        component['_watchers']
            .forEach(function (w) { return w.update(); });
        ;
    }
    if (component.hasOwnProperty('_computedWatchers')) {
        Object.keys(component['_computedWatchers']).
            forEach(function (key) { return component['_computedWatchers'][key].update(); });
        ;
    }
};
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
            var real_value = this[key];
            Object.defineProperty(this['_props'], key, {
                configurable: true,
                enumerable: true,
                get: get,
                set: function (value) {
                    set.call(this, value);
                    real_value = value;
                    callWatch(self, key, value);
                    recursiveForceUpdate(self);
                }
            });
            Object.defineProperty(this, key, {
                get: function () {
                    return real_value;
                },
                set: function (value) {
                    real_value = value;
                    callWatch(this, key, value);
                    this['$emit']('update:' + key, value);
                    recursiveForceUpdate(this);
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