<template>
	<div class="component" :class="'component--' + this.name">
		<h1 class="component__title">{{ name }}</h1>
		<div
			class="component__wrapper"
			:class="{'component__wrapper--hasExamples': exampleRoutes.length > 1}"
		>
			<nav
				v-if="exampleRoutes.length > 1"
				class="component__nav"
				:aria-label="'Examples of ' + this.name"
			>
				<nav-group>
					<template slot="heading">
						Examples
					</template>
					<li v-for="route in exampleRoutes" :key="route.path">
						<router-link :to="route.path">{{ route.name }}</router-link>
					</li>
				</nav-group>
			</nav>
			<div class="component__details">
				<div class="example">
					<template v-if="currentExample">
						<div class="component__example">
							<div class="component__exampleWrapper">
								<component :is="currentExample.component" />
							</div>
						</div>
						<pre
							class="component__example__template"
						><code class="language-html" v-html="currentExample.template" /></pre>
						<section v-if="readme" class="component__example__readme bodyText">
							<div v-html="readme" />
						</section>
					</template>
					<div v-else class="component__example__none">
						<p>Please select a component from the list on the left.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import NavGroup from './NavGroup.vue';
import marked from 'marked';
import highlightjs from 'highlight.js';

export default {
	components: {
		NavGroup
	},
	data() {
		return {
			examples: [],
			implementations: {},
			name: '',
			parentRoute: '',
			readme: '',
			template: ''
		};
	},
	computed: {
		/**
		 * The current example being shown
		 *
		 * @return {Object}
		 */
		currentExample() {
			if (this.$route.params.example) {
				return this.examples.find(
					example =>
						this.getRoutePath(example.name) === this.$route.params.example
				);
			}
			return this.examples[0];
		},

		/**
		 * Route names and URL paths
		 */
		exampleRoutes() {
			return this.examples.map(example => ({
				name: example.name,
				path:
					example.name === 'Base'
						? this.routePrefix
						: this.routePrefix + this.getRoutePath(example.name)
			}));
		},

		/**
		 * Route prefix for examples
		 */
		routePrefix() {
			let prefix = '/component/';
			if (this.parentRoute) {
				prefix += this.parentRoute + '/';
			}
			return prefix + this.name + '/';
		},

		/**
		 * Are there any implementations for this component?
		 */
		hasImplementations() {
			return Object.keys(this.implementations).length;
		}
	},
	methods: {
		/**
		 * Get the route path from the example name
		 *
		 * @return {String}
		 */
		getRoutePath(name) {
			return name.toLowerCase().replace(/\s/g, '-');
		},

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
		if (this.readme) {
			this.readme = marked(this.readme, {
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

.component__title {
	margin: 0;
	padding: 1rem 0;
	font-size: @font-lead;
	line-height: 1.5em;
}

.component__wrapper {
	display: grid;
	grid-template-columns: auto 0;
	justify-items: stretch;
	min-width: 0;
}

.component__wrapper--hasExamples {
	grid-template-columns: auto 15rem;
}

.component__nav {
	grid-column: 2;
	grid-row: 2;
	min-width: 0;
	padding: 0 0.5rem;
}

.component__details {
	grid-column: 1;
	grid-row: 2;
	min-width: 0;
}

.component__example {
	position: relative;
}

.component__exampleWrapper {
	margin-left: auto;
	margin-right: auto;
	max-width: 992px + 32;
	background: @lift;
	transition: max-width 0.2s;
}

.component__example__template {
	margin: 1rem 0 0;
}

.component__example__sectionTitle {
	margin-top: 2rem;
	margin-bottom: 0.5rem;
}

@media (min-width: 992px) {
	.component__example {
		padding: 1rem;
		background: @bg;
	}

	.component__exampleWrapper {
		padding: 1rem;
	}

	.component__example__template {
		margin: 0;
	}

	.component__example__template code {
		padding: 1.3rem 2rem 2rem;
	}
}

@media (min-width: 1200px) {
	.component__example {
		padding: 3rem;
	}
}

@media (min-width: 1400px) {
	.component {
		grid-template-columns: auto 300px;
	}
}
</style>
