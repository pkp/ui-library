<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel
		v-bind="components.example"
		@set="set"
	/>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import {props} from '../config';
import items from '../helpers/items';

export default {
	extends: Container,
	data() {
		return {
			components: {
				example: {
					...props,
					id: 'example',
					items: items
				}
			}
		};
	}
};
</script>
