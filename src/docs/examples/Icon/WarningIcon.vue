<template>
	<div>
		<icon :icon="icon" />
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'WarningIcon',
	components: {
		Icon,
	},
	data: function () {
		return {
			icon: 'exclamation-triangle',
		};
	},
};
</script>
