<template>
	<div class="pkpul-component">
		<h1 class="pkpul-component__title">
			{{ componentName }}
			<span class="pkpul-component__exampleTitle" v-if="exampleName">
				{{ exampleName }}
			</span>
		</h1>
		<div class="pkpul-component__wrapper">
			<div class="pkpul-component__examples">
				<h2 class="pkpul-component__examples-title">Examples</h2>
				<ul class="pkpul-component__examples-list">
					<li class="pkpul-component__examples-list-item">
						<router-link :to="componentUrl">Base</router-link>
					</li>
					<li v-for="example in examplesList" class="pkpul-component__examples-list-item">
						<router-link :to="example.url">{{ example.label }}</router-link>
					</li>
				</ul>
			</div>
			<div class="pkpul-component__details">
				<div class="pkpul-component__preview">
					<component :is="componentType"/>
				</div>
				<div class="pkpul-component__markup">
					<pre class="pkpul-component__markupCode">{{ componentMarkup }}</pre>
				</div>
				<div class="pkpul-component__data">
					<h2 class="pkpul-component__heading">Data</h2>
					<table class="pkpul-component__table">
						<tr>
							<th>Key</th>
							<th>Type</th>
							<th>Value in Example</th>
							<th>Notes</th>
						</tr>
						<tr v-for="data in this.componentData">
							<td>{{ data.key }}</td>
							<td>{{ data.type }}</td>
							<td>
								<pre>{{ data.currentVal }}</pre></td>
							<td>
								{{ config.dataDesc[data.key] }}
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ComponentExamples from './examples.js';
import Vue from 'vue';

export default {
	name: 'ViewComponent',
	props: ['componentName', 'exampleName', 'subcomponentName'],
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
					type: _.isNull(cmp.$data[key]) ? 'null' : typeof cmp.$data[key],
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

<style lang="less">
@import '../styles/_config';

.pkpul-component {
	border-right: 1px solid #ddd;
}

.pkpul-component__title {
	width: 100%;
	padding: 0 2rem;
}

.pkpul-component__exampleTitle {
	margin-left: 0.5em;
	font-size: 14px;
	line-height: 1.5em;
	font-weight: normal;
	color: #aaa;
	text-transform: uppercase;
	letter-spacing: 2px;
	vertical-align: middle;
}

.pkpul-component__wrapper {
	display: flex;
	flex-direction: row-reverse;
	align-items: stretch;
	border-top: 1px solid #ddd;
}

.pkpul-component__examples {
	flex: 0 0 15rem;
	border-left: 1px solid #ddd;
	padding-top: 2rem;
	padding-left: 2rem;
}

.pkpul-component__examples-title {
    margin: 0;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
}

.pkpul-component__examples-list {
	margin: 0;
	padding: 0;
	list-style: none;
}

.pkpul-component__examples-list-item {
	list-style: none;
	padding: 0.5em 0;
	font-size: 14px;
	line-height: 1.5em;

	.router-link-exact-active {
		font-weight: @bold;
		color: @text-light;
		text-decoration: none;
	}
}


.pkpul-component__preview,
.pkpul-component__markup,
.pkpul-component__data {
	padding: 2rem;
	width: 100%;
	border-bottom: 1px solid #ddd;
}

.pkpul-component__preview {
	position: relative;
	padding-top: 4rem;
	padding-bottom: 4rem;
}

.pkpul-component__markup {
	margin: 0;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.2rem;
    tab-size: 2;
	background: @primary;
	color: rgba(255,255,255,0.9);
}

.pkpul-component__heading {
	margin: -1rem 0 0.5rem;
	font-family: monospace;
	font-size: 10px;
	font-weight: normal;
	color: #aaa;
	text-transform: uppercase;
	letter-spacing: 2px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
}

.pkpul-component__table {
	margin: 0;
	padding: 0;
	max-width: 100%;
	border: 1px solid #ddd;
	border-collapse: collapse;
}

.pkpul-component__table th,
.pkpul-component__table td {
	border: 1px solid #ddd;
	padding: 1em;
	font-size: 14px;
	line-height: 1.5em;
	text-align: left;
	vertical-align: top;
}

.pkpul-component__table pre {
	margin: 0;
    font-family: monospace;
    font-size: 12px;
    line-height: 1.2rem;
    tab-size: 2;
	max-width: 20rem;
	overflow-x: auto;
}
</style>
