<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel v-bind="components.example" @set="set" />
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
					items: items,
					description:
						'This is an example of description text that can be displayed with the panel.'
				}
			}
		};
	}
};
</script>
