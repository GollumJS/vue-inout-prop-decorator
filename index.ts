import { createDecorator } from 'vue-class-component'
import { PropOptions, Constructor } from 'vue/types/options';
import {Prop} from 'vue-property-decorator';

const recursiveForceUpdate = (vm: any) => {
	vm.$forceUpdate();
	vm.$children.forEach(c => recursiveForceUpdate(c));
};

export const InOut = function(optionsProp?: (PropOptions | Constructor[] | Constructor)): PropertyDecorator {
	
	const callbackProp = Prop(optionsProp);
	const callbackInOut = createDecorator((options, key) => {
		
		const mounted = options['mounted'] ? options['mounted'] :function() {};
		options['mounted'] = function(...args: any[]): void {
			
			const self = this;
			const descriptor = Object.getOwnPropertyDescriptor(this['_props'], key);
			const get = descriptor.get;
			const set = descriptor.set;
			
			Object.defineProperty(this['_props'], key, {
				configurable: true,
				enumerable: true,
				get: get,
				set: function(value: any) {
					set.call(this, value);
					self['$data'][key+'_value'] = value;
					recursiveForceUpdate(self);
				}
			});
			
			this['$data'][key+'_value'] = this[key];
			
			Object.defineProperty(this, key, {
				get: function(): any {
					return this['$data'][key+'_value'];
				},
				set: function(value: any) {
					this['$data'][key+'_value'] = value;
					this['$emit']('update:'+key, value);
					recursiveForceUpdate(this);
				}
			});
			mounted.apply(this, args);
		};
	});
	
	return function(...args: any[]) {
		callbackProp.apply(null, args);
		callbackInOut.apply(null, args);
	}
};