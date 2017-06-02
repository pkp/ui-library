<template>
	<div class="component">
		<div class="details">
			<h1>
				{{ componentName }}
				<span v-if="exampleName">
					{{ exampleName }}
				</span>
			</h1>
			<component :is="componentType"/>
			<pre>{{ componentMarkup }}</pre>
			<table>
				<tr v-for="data in this.componentData">
					<td>{{ data.key }}</td>
					<td>{{ data.type }}</td>
					<td>{{ data.currentVal }}</td>
					<td>
						{{ config.dataDesc[data.key] }}
					</td>
				</tr>
			</table>
		</div>
		<div class="examples">
			<ul>
				<li>
					<router-link :to="componentUrl">{{ componentName }}</router-link>
				</li>
				<li v-for="example in examplesList">
					<router-link :to="example.url">{{ example.label }}</router-link>
				</li>
			</ul>
			{{ examplesList }}
		</div>
	</div>
</template>

<script>
import ComponentExamples from './examples.js';
import Vue from 'vue';

export default {
	name: 'ViewComponent',
	props: ['componentName', 'exampleName'],
	computed: {
		componentType: function () {
			if (this.exampleName) {
				if (this.config.examples[this.exampleName] !== 'undefined') {
					return this.config.examples[this.exampleName].component;
				}
			}
			var cmp = ComponentExamples[this.componentName].component;
			cmp.data = this.config.baseData;
			return cmp;
		},
		componentData: function () {
			var cmp = new Vue(this.componentType);
			var componentData = {};
			for (var key in cmp.$data) {
				componentData[key] = {
					key: key,
					type: typeof cmp.$data[key],
					currentVal: cmp.$data[key],
				};
			}
			return componentData;
		},
		componentMarkup: function () {
			var file = '';
			if (this.exampleName) {
				if (this.config.examples[this.exampleName] !== 'undefined') {
					file = this.config.examples[this.exampleName].componentRaw;
				}
			} else {
				file = ComponentExamples[this.componentName].componentRaw;
			}
			return file.match(/<template>([\s\S]*?)<\/template>/g)[0];
		},
		examplesList: function () {
			var examplesList = [];
			for (var i in this.config.examples) {
				examplesList.push({
					label: this.config.examples[i].label,
					url: '/components/' + this.componentName + '/examples/' + i,
				});
			}
			return examplesList;
		},
		config: function () {
			return require('./../docs/examples/' + this.componentName + '/_default.data.js').default;
		},
		componentUrl: function () {
			return '/components/' + this.componentName;
		},
	},
};
</script>
