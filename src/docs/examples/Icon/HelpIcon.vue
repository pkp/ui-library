<template>
	<div>
		<icon :icon="icon" />
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'HelpIcon',
	components: {
		Icon,
	},
	data: function () {
		return {
			icon: 'info-circle',
		};
	},
};
</script>
