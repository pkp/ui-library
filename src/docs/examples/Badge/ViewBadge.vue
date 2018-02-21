<template>
	<div>
		<badge
			:label="label"
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
			content: '32',
			label: 'Submissions',
			isPrimary: false,
			isWarnable: false,
			isButton: false,
			hasDot: false,
			stage: '',
		};
	},
};
</script>
