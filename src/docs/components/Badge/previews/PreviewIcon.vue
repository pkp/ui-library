<template>
	<badge label="25 comments">
		<icon icon="comment-o" :inline="true" />
		25
	</badge>
</template>

<script>
import Badge from '@/components/Badge/Badge.vue';
import Icon from '@/components/Icon/Icon.vue';

export default {
	components: {
		Badge,
		Icon
	}
};
</script>
