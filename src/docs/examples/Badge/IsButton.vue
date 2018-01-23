<template>
	<div>
		<Badge
			:content="content"
			:label="label"
			:isButton="isButton"
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
			content: 'Layout Editor',
			label: 'View all layout editors',
			isButton: true,
		};
	},
};
</script>
