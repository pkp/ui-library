<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<pkp-form
		v-bind="components.example"
		@set="set"
	/>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import {props} from '../config';

export default {
	extends: Container,
	data() {
		return {
			components: {
				example: props
			}
		};
	}
};
</script>
