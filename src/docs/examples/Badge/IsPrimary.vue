<template>
	<div>
		<badge
			:label="label"
			:isPrimary="isPrimary"
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
			content: '4',
			label: '4 assigned submissions',
			isPrimary: true,
		};
	},
};
</script>
