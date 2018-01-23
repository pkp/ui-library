<template>
	<div class="viewIcon">
		<icon
			:icon="icon"
			:inline="inline"
		/>
		<span style="font-size: 0.9rem;">Search</span>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'IsInline',
	components: {
		Icon,
	},
	data: function () {
		return {
			icon: 'search',
			inline: true,
		};
	},
};
</script>
