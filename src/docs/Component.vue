<template>
	<div class="component" :class="classes">
		<h1 class="component__title">{{ name }}</h1>
		<nav class="component__examples" :aria-label="'Examples of ' + this.name">
			<nav-group>
				<template slot="heading">Examples</template>
				<li v-for="(label, route) in examples" :key="route">
					<router-link :to="routePrefix + route">{{ label }}</router-link>
				</li>
			</nav-group>
			<nav-group v-if="hasImplementations">
				<template slot="heading">Implementations</template>
				<li v-for="(label, route) in implementations" :key="route">
					<router-link :to="routePrefix + route">{{ label }}</router-link>
				</li>
			</nav-group>
		</nav>
		<component :is="currentExample" class="component__example" />
	</div>
</template>

<script>
import NavGroup from './NavGroup.vue';

export default {
	components: {
		NavGroup
	},
	data: () => {
		return {
			examples: {},
			implementations: {},
			parentRoute: ''
		};
	},
	computed: {
		/**
		 * Update the current example based on the route and load the first example
		 * if no route exists
		 */
		currentExample() {
			if (this.$route.params.example) {
				return this.$route.params.example;
			}
			const keys = Object.keys(this.examples);
			return keys.length ? keys[0] : '';
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
		 * Add class to wrapper element that indicate the component
		 */
		classes() {
			return ['component--' + this.name];
		},

		/**
		 * Are there any implementations for this component?
		 */
		hasImplementations() {
			return Object.keys(this.implementations).length;
		}
	}
};
</script>

<style lang="less">
@import '../styles/_import';

.component {
	display: grid;
	grid-template-columns: auto 200px;
	justify-items: stretch;
	min-width: 0;
}

.component__title {
	grid-column-start: 1;
	grid-column-end: 3;
	grid-row: 1;
	margin: 0;
	padding: 1rem 0;
	font-size: @font-lead;
	line-height: 1.5em;
}

.component__examples {
	grid-column: 2;
	grid-row: 2;
	min-width: 0;
	padding: 0 0.5rem;
}

.component__example {
	grid-column: 1;
	grid-row: 2;
	min-width: 0;
}

@media (min-width: 1400px) {
	.component {
		grid-template-columns: auto 300px;
	}
}
</style>
