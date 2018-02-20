<template>
	<div>
		<badge
			:label="label"
			:hasDot="hasDot"
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
			content: 'Author',
			label: 'Participant assigned as author.',
			hasDot: true,
		};
	},
};
</script>
