<template>
	<div class="component" :class="'component--' + this.name">
		<div class="component__titleWrapper">
			<h1 class="component__title">{{ name }}</h1>
			<div class="component__settings">
				<div class="component__setting">
					<button
						class="component__settingOption"
						:class="screen === 'auto' ? 'component__settingOption--on' : ''"
						@click="screen = 'auto'"
					>
						<icon icon="arrows-h" />
					</button>
					<button
						class="component__settingOption"
						:class="screen === 'desktop' ? 'component__settingOption--on' : ''"
						@click="screen = 'desktop'"
					>
						<icon icon="desktop" />
					</button>
					<button
						class="component__settingOption"
						:class="screen === 'laptop' ? 'component__settingOption--on' : ''"
						@click="screen = 'laptop'"
					>
						<icon icon="laptop" />
					</button>
					<button
						class="component__settingOption"
						:class="screen === 'tablet' ? 'component__settingOption--on' : ''"
						@click="screen = 'tablet'"
					>
						<icon icon="tablet" />
					</button>
					<button
						class="component__settingOption"
						:class="screen === 'mobile' ? 'component__settingOption--on' : ''"
						@click="screen = 'mobile'"
					>
						<icon icon="mobile" />
					</button>
				</div>
				<div class="component__setting">
					<button
						class="component__settingOption"
						:class="dir === 'ltr' ? 'component__settingOption--on' : ''"
						@click="dir = 'ltr'"
					>
						A →
					</button>
					<button
						class="component__settingOption"
						:class="dir === 'rtl' ? 'component__settingOption--on' : ''"
						@click="dir = 'rtl'"
					>
						← A
					</button>
				</div>
			</div>
		</div>
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
					<template slot="heading">Examples</template>
					<li v-for="route in exampleRoutes" :key="route.path">
						<router-link :to="route.path">{{ route.name }}</router-link>
					</li>
				</nav-group>
			</nav>
			<div class="component__details">
				<div class="example">
					<template v-if="currentExample">
						<div
							class="component__example"
							:class="width !== 'auto' ? 'component__example--scroll' : ''"
						>
							<div
								class="component__exampleWrapper"
								:dir="dir"
								:style="'width: ' + width"
							>
								<component :is="currentExample.component" />
							</div>
						</div>
						<pre
							class="component__example__template"
						><div class="language-html" v-html="currentExample.template" /></pre>
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
import {marked} from 'marked';
import highlightjs from 'highlight.js';

export default {
	components: {
		NavGroup,
	},
	data() {
		return {
			dir: 'ltr',
			screen: 'auto',
			examples: [],
			implementations: {},
			name: '',
			parentRoute: '',
			readme: '',
			template: '',
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
					(example) =>
						this.getRoutePath(example.name) === this.$route.params.example
				);
			}
			return this.examples[0];
		},

		/**
		 * Route names and URL paths
		 */
		exampleRoutes() {
			return this.examples.map((example) => ({
				name: example.name,
				path:
					example.name === 'Base'
						? this.routePrefix
						: this.routePrefix + this.getRoutePath(example.name),
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
		},

		/**
		 * Width to display the example at
		 */
		width() {
			switch (this.screen) {
				case 'desktop':
					return '1900px';
				case 'laptop':
					return '1400px';
				case 'tablet':
					return '900px';
				case 'mobile':
					return '480px';
			}
			return 'auto';
		},
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
						.map((line) => (line[0] === '\t' ? line.substr(1) : line))
						.join('\n'),
					['html']
				).value;
			}
			return '';
		},
	},
	mounted() {
		if (this.readme) {
			marked.setOptions({
				highlight(code) {
					return highlightjs.highlightAuto(code).value;
				},
			});
			this.readme = marked.parse(this.readme);
		}
	},
};
</script>

<style lang="less">
@import '../styles/_import';

.component__titleWrapper {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.component__title {
	font-size: @font-lead;
	line-height: 1.5em;
}

.component__settings {
	display: flex;
	gap: 0.5rem;
	margin-inline-start: auto;
	margin-inline-end: 1rem;
}

.component__setting {
	background: @bg;
	font-size: 0.85rem;
	line-height: 1;
}

.component__settingOption {
	padding: 0.25rem 0.5rem;
	color: @text-light;
	border: 1px solid transparent;
	min-width: 2.25rem;

	&:focus,
	&:hover {
		border-color: @primary;
		background: @bg;
		outline: 0;
	}

	&:first-child {
		border-top-left-radius: @radius;
		border-bottom-left-radius: @radius;
	}

	&:last-child {
		border-top-right-radius: @radius;
		border-bottom-right-radius: @radius;
	}
}

.component__settingOption--on {
	background: @primary;
	color: @lift;

	&:focus,
	&:hover {
		background: @primary;
	}
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

.component__example--scroll {
	overflow: scroll;
}

.component__exampleWrapper {
	margin-left: auto;
	margin-right: auto;
	background: @lift;
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
