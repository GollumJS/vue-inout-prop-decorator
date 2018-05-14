# InOut typescript decorator for vuejs component 

## Exemple use:

### child component

```html
<template>
	<div>
		<p>Value1: {{ value1 }}</p>
		<p>Value2: {{ value2 }}</p>
		<button change="change" ></button>
	</div>
</template>

<script lang="ts">
	import {Component} from 'vue-property-decorator';
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
	import {Component} from 'vue-property-decorator';
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
