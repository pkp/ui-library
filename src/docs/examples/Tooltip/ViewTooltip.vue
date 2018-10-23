<template>
	<tooltip :tooltip="tooltip" :label="label" />
</template>

<script>
import Tooltip from '@/components/Tooltip/Tooltip.vue';

export default {
	name: 'ViewTooltip',
	components: {
		Tooltip,
	},
	data: function () {
		return {
			tooltip: 'Use tooltips to provide short, helpful advice on what is expected of the user. Do not use tooltips for required information.',
			label: 'Tooltip for the demonstration component.',
		};
	},
};
</script>
