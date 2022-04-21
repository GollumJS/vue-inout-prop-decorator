import { createDecorator } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
export const InOut = function (optionsInOut) {
    const callbackProp = Prop(optionsInOut);
    const callbackInOut = createDecorator((options, key) => {
        const data = options['data'] ? options['data'] : function () { return {}; };
        const mounted = options['mounted'] ? options['mounted'] : function () { };
        options['data'] = function () {
            return Object.assign(Object.assign({}, data.apply(this)), { [key + '_inner']: null });
        };
        options['mounted'] = function (...args) {
            const self = this;
            const descriptor = Object.getOwnPropertyDescriptor(this['_props'], key);
            const get = descriptor.get;
            const set = descriptor.set;
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
    return function (...args) {
        callbackProp.apply(null, args);
        callbackInOut.apply(null, args);
    };
};
//# sourceMappingURL=index.js.map