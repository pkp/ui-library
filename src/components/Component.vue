<template>
	<div class="component">
		<h1>{{ msg }} {{ componentName }} / {{ exampleName }}</h1>
		<component :is="component"/>
		<!-- <table>
			<tr v-for="data in componentData">
				<td>{{ data.key }}</td>
				<td>{{ data.type }}</td>
				<td>{{ data.currentVal }}</td>
			</tr>
		</table> -->
	</div>
</template>

<script>
import TestComponent from './TestComponent.vue';
// import ExampleTest from './../examples/test-component.js'
// import ExampleTestMD from './../examples/test-component.md'
// import ExampleTestRaw from '!!raw-loader!./TestComponent.vue'
// import marked from 'marked'
import ComponentExamples from './../docs/examples.js';

export default {
	name: 'component',
	props: ['componentName', 'exampleName'],
	components: {
		TestComponent,
	},
	data () {
		return {
			msg: 'Component name: ',
			test: null,
			componentData: null,
		};
	},
	computed: {
		component: function () {
			if (this.exampleName) {
				var examples = require('./../docs/examples/' + this.componentName + '/_default.data.js');
				if (typeof examples.default.examples[this.exampleName] !== 'undefined') {
					return examples.default.examples[this.exampleName];
				}
			}
			return ComponentExamples['Example' + this.componentName];
		},
	},
	mounted: function () {
		// var data = {}
		// for (var key in this.$children[0].$data) {
		// 	data[key] = {
		// 		key: key,
		// 		type: typeof this.$children[0].$data[key],
		// 		currentVal: this.$children[0].$data[key],
		// 	}
		// }
		// this.componentData = data
		// console.log(marked(ExampleTestMD))
		// console.log(ExampleTestRaw)
		// console.log(ExampleTestRaw.match(/<template>([\s\S]*?)<\/template>/g))
	},
};
</script>
