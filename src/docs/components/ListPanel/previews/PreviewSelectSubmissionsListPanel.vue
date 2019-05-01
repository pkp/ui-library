<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<select-submissions-list-panel
		v-bind="components.example"
		@set="set"
	/>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import SelectSubmissionsListPanel from '@/components/ListPanel/submissions/SelectSubmissionsListPanel.vue';
import {propsSelectSubmissionsListPanel} from '../config';

export default {
	extends: Container,
	components: {
		SelectSubmissionsListPanel
	},
	data() {
		return {
			components: {
				example: {
					...propsSelectSubmissionsListPanel,
					id: 'example',
					title: 'Select Submissions List Panel'
				}
			}
		};
	}
};
</script>
