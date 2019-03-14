<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<submissions-list-panel
		v-bind="components.example"
		@set="set"
	/>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import SubmissionsListPanel from '@/components/ListPanel/submissions/SubmissionsListPanel.vue';
import {propsSubmissionsListPanel} from '../config';

export default {
	extends: Container,
	components: {
		SubmissionsListPanel
	},
	data() {
		return {
			components: {
				example: {
					...propsSubmissionsListPanel,
					id: 'example',
					title: 'Submissions List Panel (OJS)'
				}
			}
		};
	}
};
</script>
