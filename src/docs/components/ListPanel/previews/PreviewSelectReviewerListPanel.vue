<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<select-reviewer-list-panel
		v-bind="components.example"
		@set="set"
	/>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import SelectReviewerListPanel from '@/components/ListPanel/users/SelectReviewerListPanel.vue';
import {propsSelectReviewerListPanel} from '../config';

export default {
	extends: Container,
	components: {
		SelectReviewerListPanel
	},
	data() {
		return {
			components: {
				example: {
					...propsSelectReviewerListPanel,
					id: 'example',
					title: 'Select Reviewer List Panel'
				}
			}
		};
	}
};
</script>
