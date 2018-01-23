<template>
	<div>
		<Badge
			:content="content"
			:label="label"
			:isButton="isButton"
			:stage="stage"
		/>
	</div>
</template>

<script>
import Badge from '@/components/Badge/Badge.vue';

export default {
	name: 'ViewBadge',
	components: {
		Badge,
	},
	data: function () {
		return {
			content: 'Submission',
			label: 'Currently in the submission stage',
			isButton: true,
			stage: 'submission',
		};
	},
};
</script>
