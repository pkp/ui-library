<template>
	<div>
		<badge
			:label="label"
		>
			<icon icon="comment-o" :inline="true" />
			{{ content }}
		</badge>
	</div>
</template>

<script>
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'WithIcon',
	components: {
		Badge,
		Icon,
	},
	data: function () {
		return {
			content: '25',
			label: '25 Comments',
		};
	},
};
</script>
