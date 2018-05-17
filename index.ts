import { createDecorator } from 'vue-class-component'
import { PropOptions, Constructor } from 'vue/types/options';
import {Prop, Vue} from 'vue-property-decorator';

const recursiveForceUpdate = (vm: any) => {
	vm.$forceUpdate();
	vm.$children.forEach(c => recursiveForceUpdate(c));
};

const callWatch = (component: Vue, expression: string, value: any): void => {
	if (component.hasOwnProperty('_watchers')) {
		component['_watchers']
			.forEach(w => w.update());
		;
	}
	if (component.hasOwnProperty('_computedWatchers')) {
		Object.keys(component['_computedWatchers']).
		forEach(key => component['_computedWatchers'][key].update());
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
			
			let real_value = this[key];
			
			Object.defineProperty(this['_props'], key, {
				configurable: true,
				enumerable: true,
				get: function (): any {
					return real_value;
				},
				set: function(value: any) {
					set.call(this, value);
					real_value = value;
					callWatch(<Vue>self, key, value);
					recursiveForceUpdate(<Vue>self);
				}
			});
			
			Object.defineProperty(this, key, {
				get: function(): any {
					return real_value;
				},
				set: function(value: any) {
					real_value = value;
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