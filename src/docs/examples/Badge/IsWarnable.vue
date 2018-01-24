<template>
	<div>
		<badge
			:label="label"
			:isWarnable="isWarnable"
		>
			{{ content }}
		</badge>
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
			content: '7',
			label: '7 new messages',
			isWarnable: true,
		};
	},
};
</script>
