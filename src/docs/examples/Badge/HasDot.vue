<template>
	<div>
		<Badge
			:content="content"
			:label="label"
			:hasDot="hasDot"
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
			content: 'Author',
			label: 'Participant assigned as author.',
			hasDot: true,
		};
	},
};
</script>
