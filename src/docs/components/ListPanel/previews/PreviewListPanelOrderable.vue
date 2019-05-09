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
import i18n from '../helpers/i18n';

export default {
	extends: Container,
	data() {
		return {
			components: {
				example: {
					...props,
					id: 'example',
					items: items,
					canOrder: true,
					title: 'List Panel with Orderer',
					i18n: {
						...props.i18n,
						...i18n.orderable
					}
				}
			}
		};
	}
};
</script>
