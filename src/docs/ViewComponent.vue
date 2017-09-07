<template>
	<div class="pkpul-component">
		<h1 class="pkpul-component__title">
			{{ componentName }}
			<span class="pkpul-component__subTitle" v-if="exampleName || implementationName">
				<template v-if="exampleName">
					{{ exampleName }}
				</template>
				<template v-elseif="implementationName">
					{{ implementationName }}
				</template>
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
				<h2 class="pkpul-component__examples-title">Implementations</h2>
				<ul class="pkpul-component__examples-list">
					<li v-for="implementation in implementationsList" class="pkpul-component__examples-list-item">
						<router-link :to="implementation.url">{{ implementation.label }}</router-link>
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
							<td v-html="config.dataDesc[data.key]" class="pkpul-component__dataDesc"></td>
						</tr>
					</table>
				</div>
				<div class="pkpul-component__notes">
					<h2 class="pkpul-component__heading">Notes</h2>
					<div v-html="componentNotes"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ComponentExamples from './examples.js';
import Vue from 'vue';
import marked from 'marked';

export default {
	name: 'ViewComponent',
	props: ['componentName', 'exampleName', 'implementationName'],
	computed: {
		componentType: function () {
			var cmp;
			if (this.exampleName) {
				if (this.config.examples[this.exampleName] !== 'undefined') {
					return this.config.examples[this.exampleName].component;
				}
			} else if (this.implementationName) {
				if (this.config.implementations[this.implementationName] !== 'undefined') {
					return this.config.implementations[this.implementationName].component;
				}
			}
			cmp = ComponentExamples[this.componentName].component;
			cmp.data = this.config.baseData;
			return cmp;
		},
		componentData: function () {
			var cmp = new Vue(this.componentType);
			var componentData = {};
			for (var key in cmp.$data) {
				componentData[key] = {
					key: key,
					type: cmp.$data[key] === null ? 'null' : typeof cmp.$data[key],
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
			} else if (this.implementationName) {
				if (this.config.implementations[this.implementationName] !== 'undefined') {
					file = this.config.implementations[this.implementationName].componentRaw;
				}
			} else {
				file = ComponentExamples[this.componentName].componentRaw;
			}
			return file.match(/<template>([\s\S]*?)\n<\/template>/g)[0];
		},
		componentNotes: function () {
			return marked(require('./../docs/examples/' + this.componentName + '/notes.md'));
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
		implementationsList: function () {
			var implementationsList = [];
			for (var i in this.config.implementations) {
				implementationsList.push({
					label: this.config.implementations[i].label,
					url: '/components/' + this.componentName + '/implementations/' + i,
				});
			}
			return implementationsList;
		},
		config: function () {
			var config = require('./examples/' + this.componentName + '/data.js').default;
			if (config.dataDesc) {
				for (var i in config.dataDesc) {
					config.dataDesc[i] = marked(config.dataDesc[i]);
				}
			}
			return config;
		},
		componentUrl: function () {
			return '/components/' + this.componentName;
		},
	},
};
</script>

<style lang="less">
@import '../styles/_import';

.pkpul-component {
	border-right: 1px solid #ddd;
}

.pkpul-component__title {
	width: 100%;
	padding: 0 2rem;
}

.pkpul-component__subTitle {
	margin-left: 0.5em;
	font-size: 14px;
	line-height: 1.5em;
	font-weight: normal;
	color: #777;
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
	margin: 0 0 2rem;
	padding: 0;
	list-style: none;
}

.pkpul-component__examples-list-item {
	list-style: none;
	padding: 0.5em 0;
	font-size: 14px;
	line-height: 1.5em;

	.router-link-exact-active {
		position: relative;
		color: @text;
		text-decoration: none;

		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			left: -1.25rem;
			width: 0.5rem;
			height: 0.5rem;
			margin-top: -0.25rem;
			border-radius: 50%;
			background: @primary;
		}
	}
}


.pkpul-component__preview,
.pkpul-component__markup,
.pkpul-component__data,
.pkpul-component__notes {
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
	color: #fff;
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
	max-height: 40rem;
	overflow: auto;
}

.pkpul-component__dataDesc {

	p:first-child {
		margin-top: 0;
	}

	p:last-child {
		margin-bottom: 0;
	}

	code {
		display: inline-block;
		background: #eee;
		border-radius: 0.15em;
		padding: 0 0.5em;
		margin: 0 0.25em;
		font-size: 12px;
		font-family: monospace;
	}
}

.pkpul-component__notes {
	line-height: 2em;

	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 4em;
		margin-bottom: 0;
	}

	p {
		margin: 2em 0;
	}

	pre,
	code {
		background: #eee;
		border-radius: 0.15em;
		padding: 0 0.5em;
		margin: 0 0.25em;
		font-size: 12px;
		font-family: monospace;
	}

	pre {
		padding: 1em;
	}

	code {
		display: inline-block;
	}
}
</style>
