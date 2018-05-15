import { createDecorator } from 'vue-class-component'
import { PropOptions, Constructor } from 'vue/types/options';
import {Prop, Vue} from 'vue-property-decorator';

const recursiveForceUpdate = (vm: any) => {
	vm.$forceUpdate();
	vm.$children.forEach(c => recursiveForceUpdate(c));
};

const callWatch = (component: Vue, expression: string, value: any): void => {
	if (component['_watchers']) {
		component['_watchers']
			.filter(w => w.expression === expression).
			forEach(w => {
				if (w.value != value) {
					w.cb(value, w.value);
					w.dirty = false;
					w.value = value;
				}
			});
		;
	}
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
					callWatch(<Vue>self, key, value);
					recursiveForceUpdate(<Vue>self);
				}
			});
			
			this['$data'][key+'_value'] = this[key];
			
			Object.defineProperty(this, key, {
				get: function(): any {
					return this['$data'][key+'_value'];
				},
				set: function(value: any) {
					this['$data'][key+'_value'] = value;
					callWatch(<Vue>this, key, value);
					this['$emit']('update:'+key, value);
					recursiveForceUpdate(<Vue>this);
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