import { createDecorator } from 'vue-class-component'
import { PropOptions, Constructor } from 'vue/types/options';
import {Prop, Vue} from 'vue-property-decorator';


export interface InOutOptions extends PropOptions {
	isVModel?: boolean;
}

export const InOut = function(optionsInOut?: (InOutOptions | Constructor[] | Constructor)): PropertyDecorator {
	
	const callbackProp = Prop(optionsInOut);
	const callbackInOut = createDecorator((options, key) => {
		
		const data: any = options['data'] ? options['data'] : function(): any { return {}; };
		const mounted = options['mounted'] ? options['mounted'] :function() {};
		
		options['data'] = function() {
			return {
				...data.apply(this),
				[key + '_inner']: null,
			};
		}
		
		
		options['mounted'] = function(...args: any[]): void {
			
			const self = this;
			const descriptor: any = Object.getOwnPropertyDescriptor(this['_props'], key);
			const get = descriptor.get;
			const set = descriptor.set;
			
			this[key + '_inner'] = this[key];
			
			Object.defineProperty(this, key + '_original', {
				configurable: true,
				enumerable: true,
				get: function (): any {
					return get;
				}
			});
			
			
			Object.defineProperty(this['_props'], key, {
				configurable: true,
				enumerable: true,
				get: function (): any {
					return self[key + '_inner'];
				},
				set: function(value: any) {
					set.call(this, value);
					self[key + '_inner'] = value;
				}
			});
			
			Object.defineProperty(this, key, {
				get: function(): any {
					return this[key + '_inner'];
				},
				set: function(value: any) {
					this[key + '_inner'] = value;
					if (optionsInOut && (<InOutOptions>optionsInOut).isVModel === true) {
						this['$emit']('input', value);
					} else {
						this['$emit']('update:'+key, value);
					}
					this.$forceUpdate();
				}
			});
			mounted.apply(this, <any>args);
		};
	});
	
	return function(...args: any[]) {
		callbackProp.apply(null, <any>args);
		callbackInOut.apply(null, <any>args);
	}
};
