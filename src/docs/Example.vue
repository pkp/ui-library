<template>
	<div class="example">
		<template v-if="component">
			<div class="example__preview" :class="previewSizeClass">
				<div class="example__previewControls">
					<button class="example__previewControl example__previewControl--mobile" :class="{'-isActive': previewSize === 'mobile'}" @click="previewSize = 'mobile'">
						<icon icon="mobile" />
					</button>
					<button class="example__previewControl example__previewControl--desktop" :class="{'-isActive': previewSize === 'desktop'}" @click="previewSize = 'desktop'">
						<icon icon="desktop" />
					</button>
					<button class="example__previewControl" :class="{'-isActive': previewSize === 'max'}" @click="previewSize = 'max'">
						<icon icon="arrows-alt" />
					</button>
				</div>
				<div class="example__previewWrapper" :class="'example__previewWrapper--' + component">
					<component :is="component" v-bind="props" v-on="listeners"/>
				</div>
			</div>
			<pre v-if="template" class="example__template"><code class="language-html" v-html="template" /></pre>
			<section v-if="propRows.length">
				<h2 class="example__sectionTitle">Props</h2>
				<doc-table
					:headers="['Key', 'Type', 'Value', 'Description']"
					:rows="propRows"
				/>
			</section>
			<section v-if="emitDocs.length">
				<h2 class="example__sectionTitle">Events</h2>
				<doc-table
				:headers="['Key', 'Type', 'Value', 'Description']"
				:rows="emitDocs"
				/>
			</section>
			<section v-if="dataDocs.length">
				<h2 class="example__sectionTitle">Data</h2>
				<doc-table
				:headers="['Key', 'Description']"
				:rows="dataDocs"
				/>
			</section>
			<section v-if="readme" class="example__readme bodyText">
				<h2 class="example__sectionTitle">Usage</h2>
				<div v-html="readme" />
			</section>
		</template>
		<div v-else class="example__none">
			<p>Please select a component from the list on the left.</p>
		</div>
	</div>
</template>

<script>
import DocTable from './DocTable.vue';
import Icon from '@/components/Icon/Icon.vue';
import marked from 'marked';
import highlightjs from 'highlight.js';

export default {
	components: {
		DocTable,
		Icon
	},
	data: () => {
		return {
			component: '',
			template: '',
			props: {},
			propDocs: [],
			emitDocs: [],
			dataDocs: [],
			readme: '',
			previewSize: 'desktop',
			listeners: {}
		};
	},
	computed: {
		/**
		 * Compile prop information for the prop documentation table
		 */
		propRows() {
			return this.propDocs.map(doc => {
				doc.value = this.props.hasOwnProperty(doc.key)
					? this.props[doc.key]
					: null;
				return doc;
			});
		},

		/**
		 * Get a class for the current preview size
		 */
		previewSizeClass() {
			return 'example__preview--' + this.previewSize;
		}
	},
	methods: {
		/**
		 * Extract the template from a Vue component
		 */
		extractTemplate(fileContent) {
			const matches = fileContent.match(/<template>([\s\S]*?)\n<\/template>/);
			if (matches.length > 1) {
				// Remove the first tab indendation of each line
				return highlightjs.highlightAuto(
					matches[1]
						.split('\n')
						.map(line => (line[0] === '\t' ? line.substr(1) : line))
						.join('\n'),
					['html']
				).value;
			}
			return '';
		}
	},
	mounted() {
		/**
		 * Load the readme and convert to markdown
		 */
		let readme;
		try {
			readme = require('./components/' + this.$route.name + '/readme.md');
		} catch (e) {
			readme = '';
		}
		if (readme) {
			this.readme = marked(readme, {
				highlight(code) {
					return highlightjs.highlightAuto(code).value;
				}
			});
		}
	}
};
</script>

<style lang="less">
@import '../styles/_import';

.example__preview {
	position: relative;
}

.example__previewWrapper {
	margin-left: auto;
	margin-right: auto;
	background: @lift;
	transition: max-width 0.2s;
}

.example__previewControls {
	display: none;
	position: absolute;
	top: 0;
	right: 0;
}

.example__previewControl {
	padding: 0 0.5em;
	border: none;
	box-shadow: none;
	border-radius: @radius;
	background: transparent;
	color: rgba(0, 0, 0, 0.2);
	line-height: 1.5rem;

	&.-isActive {
		color: rgba(0, 0, 0, 0.5);
	}

	&:focus {
		outline: 0;
		color: @primary;
	}
}

.example__preview--mobile .example__previewWrapper {
	max-width: 320px + 32;
}

.example__preview--desktop .example__previewWrapper {
	max-width: 992px + 32;
}

.example__preview--max .example__previewWrapper {
	max-width: 100%;
}

.example__previewControl--mobile {
	font-size: 19px;
}

.example__previewControl--desktop {
	font-size: 15px;
}

.example__template {
	margin: 0;
}

.example__sectionTitle {
	margin-top: 2rem;
	margin-bottom: 0.5rem;
}

@media (min-width: 992px) {
	.example__preview {
		padding: 2rem 1rem 1rem;
		background: @bg;
	}

	.example__previewWrapper {
		padding: 1rem;
	}

	.example__previewControls {
		display: block;
	}

	.example__preview--mobile .example__previewWrapper {
		max-width: 320px + 32;
	}

	.example__preview--desktop .example__previewWrapper {
		max-width: 992px + 32;
	}

	.example__template code {
		padding: 1.3rem 2rem 2rem;
	}
}

@media (min-width: 1200px) {
	.example__preview {
		padding: 4rem 3rem 3rem;
	}
}
</style>
