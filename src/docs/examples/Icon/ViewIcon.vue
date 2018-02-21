<template>
	<div>
		<icon
			:icon="icon"
			:inline="inline"
		/>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'ViewIcon',
	components: {
		Icon,
	},
	data: function () {
		return {
			icon: 'bug',
			inline: false,
		};
	},
};
</script>
