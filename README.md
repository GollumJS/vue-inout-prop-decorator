# InOut typescript decorator for vuejs component 

[![Build Status](https://travis-ci.org/GollumJS/vue-inout-prop-decorator.svg?branch=master)](https://travis-ci.org/GollumJS/vue-inout-prop-decorator)
[![Licence](https://img.shields.io/npm/l/vue-inout-prop-decorator.svg?colorB=4B9081)](https://github.com/GollumJS/vue-inout-prop-decorator/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/vue-inout-prop-decorator.svg)](https://www.npmjs.com/package/vue-inout-prop-decorator)

## Install:

```
npm install --save vue-inout-prop-decorator
```

## Exemple with InOut annotation:

### child component

```html
<template>
	<div>
		<p>Value1: {{ value1 }}</p>
		<p>Value2: {{ value2 }}</p>
		<button @click="change" ></button>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import {InOut} from "vue-inout-prop-decorator";
	
	@Component
	export default class ParentComponent extends Vue {
		
		@InOut() value1: string;
		@InOut({ type: String, default: "World" }) value2: string;
		
		change() {
			this.value1 = "Ho ho ho!";
			this.value2 = "Ha ha ha!";
		}
		
	}
</script>
```

### parent component

```html
<template>
	<div>
		<p>Value: {{ value }}</p>
		<my-child :value1.sync="value" ></my-child>
	</div>
</template>

<script lang="ts">
	import {Component, Vue} from 'vue-property-decorator';
	import MyChild from './MyChild.vue';
	
	@Component({
		components: {
			MyChild,
		}
	})
	export default class ParentComponent extends Vue {
		value: string = 'hello';		
	}
</script>
```

## Exemple WITHOUT InOut annotation:


```html
<template>
	<div>
		<p>Value1: {{ value1_val }}</p>
		<p>Value2: {{ value2_val }}</p>
		<button @click="change" ></button>
	</div>
</template>

<script lang="ts">
	import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
	import {InOut} from "vue-inout-prop-decorator";
	
	@Component
	export default class ParentComponent extends Vue {
		
		@Prop() value1: string;
		@Prop({ type: String, default: "World" }) value2: string;
		
		change() {
			this.updateValue1("Ho ho ho!");
			this.updateValue2("Ha ha ha!");
		}
		
		value1_val: string = null;
		value2_val: string = null;
		
		@Watch('value1')
		@Watch('value2')
		mounted() {
			this.value1_val = this.value1;
			this.value2_val = this.value2;
		}
		
		@Emit('update:value1')updateValue1(value:  boolean) { this.value1_val = value; }
		@Emit('update:value2')updateValue2(value:  boolean) { this.value2_val = value; }
		
		
	}
</script>
```
